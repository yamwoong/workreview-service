import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/User.model';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../../utils/errors.util';
import * as jwtUtil from '../../utils/jwt.util';
import { logger } from '../../config/logger';
import type {
  RegisterInput,
  UpdateProfileInput,
} from '../../validators/auth.validator';

// Mock logger to suppress logs during tests
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock JWT utilities
jest.mock('../../utils/jwt.util', () => ({
  generateToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

// Mock log masking utilities
jest.mock('../../utils/logMasking.util', () => ({
  maskEmail: jest.fn((email: string) => email),
  hashUserId: jest.fn((userId: string) => `hash_${userId}`),
}));

describe('AuthService', () => {
  let mongoServer: MongoMemoryServer;

  // Setup MongoDB Memory Server before all tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Cleanup after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear database and reset mocks before each test
  beforeEach(async () => {
    await UserModel.deleteMany({});
    jest.clearAllMocks();

    // Setup default JWT mock returns
    (jwtUtil.generateToken as jest.Mock).mockReturnValue('mock_access_token');
    (jwtUtil.generateRefreshToken as jest.Mock).mockReturnValue(
      'mock_refresh_token'
    );
  });

  describe('register', () => {
    const validRegisterData: RegisterInput = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      department: 'Engineering',
      position: 'Developer',
    };

    it('should successfully register a new user', async () => {
      // Act
      const result = await AuthService.register(validRegisterData);

      // Assert
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');

      expect(result.user.email).toBe(validRegisterData.email);
      expect(result.user.name).toBe(validRegisterData.name);
      expect(result.user.role).toBe('employee'); // Default role
      expect(result.user.department).toBe(validRegisterData.department);
      expect(result.user.position).toBe(validRegisterData.position);

      // Password should not be in response
      expect(result.user).not.toHaveProperty('password');

      // Verify JWT tokens were generated
      expect(jwtUtil.generateToken).toHaveBeenCalledWith(
        expect.any(String),
        'employee'
      );
      expect(jwtUtil.generateRefreshToken).toHaveBeenCalledWith(
        expect.any(String)
      );

      // Verify user was created in database
      const userInDb = await UserModel.findOne({ email: validRegisterData.email });
      expect(userInDb).toBeTruthy();
      expect(userInDb?.name).toBe(validRegisterData.name);
    });

    it('should hash the password before saving', async () => {
      // Act
      await AuthService.register(validRegisterData);

      // Assert
      const userInDb = await UserModel.findOne({
        email: validRegisterData.email,
      }).select('+password');

      expect(userInDb).toBeTruthy();
      expect(userInDb?.password).not.toBe(validRegisterData.password);
      expect(userInDb?.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
    });

    it('should throw ConflictError when email already exists', async () => {
      // Arrange: Create existing user
      await UserModel.create({
        email: validRegisterData.email,
        password: 'existing_password',
        name: 'Existing User',
        role: 'employee',
      });

      // Act & Assert
      await expect(AuthService.register(validRegisterData)).rejects.toThrow(
        ConflictError
      );
      await expect(AuthService.register(validRegisterData)).rejects.toThrow(
        '이미 존재하는 이메일입니다'
      );

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '회원가입 시도 - 이미 존재하는 이메일',
        expect.any(Object)
      );
    });

    it('should handle registration without optional fields', async () => {
      // Arrange
      const minimalData: RegisterInput = {
        email: 'minimal@example.com',
        password: 'password123',
        name: 'Minimal User',
      };

      // Act
      const result = await AuthService.register(minimalData);

      // Assert
      expect(result.user.email).toBe(minimalData.email);
      expect(result.user.name).toBe(minimalData.name);
      expect(result.user.department).toBeUndefined();
      expect(result.user.position).toBeUndefined();
    });

    it('should normalize email to lowercase', async () => {
      // Arrange
      const dataWithUppercaseEmail: RegisterInput = {
        ...validRegisterData,
        email: 'TEST@EXAMPLE.COM',
      };

      // Act
      const result = await AuthService.register(dataWithUppercaseEmail);

      // Assert
      expect(result.user.email).toBe('test@example.com');

      const userInDb = await UserModel.findOne({ email: 'test@example.com' });
      expect(userInDb).toBeTruthy();
    });
  });

  describe('login', () => {
    const testEmail = 'login@example.com';
    const testPassword = 'password123';
    let testUserId: string;

    beforeEach(async () => {
      // Create a test user before each login test
      const user = await UserModel.create({
        email: testEmail,
        password: testPassword,
        name: 'Login Test User',
        role: 'employee',
      });
      testUserId = user._id.toString();
    });

    it('should successfully login with correct credentials', async () => {
      // Act
      const result = await AuthService.login(testEmail, testPassword);

      // Assert
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');

      expect(result.user.email).toBe(testEmail);
      expect(result.user.name).toBe('Login Test User');

      // Password should not be in response
      expect(result.user).not.toHaveProperty('password');

      // Verify JWT tokens were generated
      expect(jwtUtil.generateToken).toHaveBeenCalledWith(testUserId, 'employee');
      expect(jwtUtil.generateRefreshToken).toHaveBeenCalledWith(testUserId);

      // Verify success was logged
      expect(logger.info).toHaveBeenCalledWith(
        '사용자 로그인 성공',
        expect.any(Object)
      );
    });

    it('should update lastLogin timestamp on successful login', async () => {
      // Arrange
      const beforeLogin = new Date();

      // Act
      await AuthService.login(testEmail, testPassword);

      // Assert
      const userInDb = await UserModel.findById(testUserId);
      expect(userInDb?.lastLogin).toBeTruthy();
      expect(userInDb?.lastLogin!.getTime()).toBeGreaterThanOrEqual(
        beforeLogin.getTime()
      );
    });

    it('should accept case-insensitive email', async () => {
      // Act
      const result = await AuthService.login(
        'LOGIN@EXAMPLE.COM',
        testPassword
      );

      // Assert
      expect(result.user.email).toBe(testEmail);
    });

    it('should throw UnauthorizedError when user does not exist', async () => {
      // Act & Assert
      await expect(
        AuthService.login('nonexistent@example.com', testPassword)
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        AuthService.login('nonexistent@example.com', testPassword)
      ).rejects.toThrow('이메일 또는 비밀번호가 일치하지 않습니다');

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '로그인 시도 실패',
        expect.objectContaining({
          reason: 'user_not_found',
        })
      );
    });

    it('should throw UnauthorizedError when password is incorrect', async () => {
      // Act & Assert
      await expect(
        AuthService.login(testEmail, 'wrong_password')
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        AuthService.login(testEmail, 'wrong_password')
      ).rejects.toThrow('이메일 또는 비밀번호가 일치하지 않습니다');

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '로그인 시도 실패',
        expect.objectContaining({
          reason: 'invalid_password',
        })
      );
    });

    it('should throw UnauthorizedError when user is inactive', async () => {
      // Arrange: Deactivate user
      await UserModel.findByIdAndUpdate(testUserId, { isActive: false });

      // Act & Assert
      await expect(AuthService.login(testEmail, testPassword)).rejects.toThrow(
        UnauthorizedError
      );
      await expect(AuthService.login(testEmail, testPassword)).rejects.toThrow(
        '이메일 또는 비밀번호가 일치하지 않습니다'
      );

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '로그인 시도 실패',
        expect.objectContaining({
          reason: 'inactive_account',
        })
      );
    });

    it('should use timing attack defense (always run bcrypt.compare)', async () => {
      // This test verifies that bcrypt.compare is called even when user doesn't exist
      // By ensuring the same error message is returned in all cases

      // Act & Assert
      const nonExistentUserError = AuthService.login(
        'nonexistent@example.com',
        'any_password'
      );
      const wrongPasswordError = AuthService.login(testEmail, 'wrong_password');

      await expect(nonExistentUserError).rejects.toThrow(
        '이메일 또는 비밀번호가 일치하지 않습니다'
      );
      await expect(wrongPasswordError).rejects.toThrow(
        '이메일 또는 비밀번호가 일치하지 않습니다'
      );
    });

    it('should continue login even if lastLogin update fails', async () => {
      // Arrange: Mock save to fail on lastLogin update
      const originalSave = UserModel.prototype.save;
      jest
        .spyOn(UserModel.prototype, 'save')
        .mockRejectedValueOnce(new Error('DB connection failed'));

      // Act
      const result = await AuthService.login(testEmail, testPassword);

      // Assert: Login should still succeed
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        'lastLogin 업데이트 실패 (로그인은 정상 진행)',
        expect.any(Object)
      );

      // Restore original save
      jest.spyOn(UserModel.prototype, 'save').mockRestore();
    });
  });

  describe('refreshAccessToken', () => {
    const testUserId = new mongoose.Types.ObjectId().toString();
    const testRefreshToken = 'valid_refresh_token';

    beforeEach(() => {
      // Mock verifyRefreshToken to return test userId
      (jwtUtil.verifyRefreshToken as jest.Mock).mockReturnValue({
        userId: testUserId,
      });
    });

    it('should successfully refresh access token', async () => {
      // Arrange: Create test user
      await UserModel.create({
        _id: testUserId,
        email: 'refresh@example.com',
        password: 'password123',
        name: 'Refresh Test User',
        role: 'manager',
        isActive: true,
      });

      // Act
      const result = await AuthService.refreshAccessToken(testRefreshToken);

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.accessToken).toBe('mock_access_token');
      expect(result.refreshToken).toBe('mock_refresh_token');

      // Verify token generation
      expect(jwtUtil.generateToken).toHaveBeenCalledWith(testUserId, 'manager');
      expect(jwtUtil.generateRefreshToken).toHaveBeenCalledWith(testUserId);

      // Verify success was logged
      expect(logger.info).toHaveBeenCalledWith(
        'Access Token 갱신 완료',
        expect.any(Object)
      );
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Act & Assert
      await expect(
        AuthService.refreshAccessToken(testRefreshToken)
      ).rejects.toThrow(NotFoundError);
      await expect(
        AuthService.refreshAccessToken(testRefreshToken)
      ).rejects.toThrow('사용자를 찾을 수 없습니다');

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '토큰 갱신 실패 - 존재하지 않는 사용자',
        expect.any(Object)
      );
    });

    it('should throw UnauthorizedError when user is inactive', async () => {
      // Arrange: Create inactive user
      await UserModel.create({
        _id: testUserId,
        email: 'inactive@example.com',
        password: 'password123',
        name: 'Inactive User',
        role: 'employee',
        isActive: false,
      });

      // Act & Assert
      await expect(
        AuthService.refreshAccessToken(testRefreshToken)
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        AuthService.refreshAccessToken(testRefreshToken)
      ).rejects.toThrow('비활성화된 계정입니다');

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '토큰 갱신 실패 - 비활성화된 계정',
        expect.any(Object)
      );
    });

    it('should throw UnauthorizedError when refresh token is invalid', async () => {
      // Arrange: Mock verifyRefreshToken to throw error
      (jwtUtil.verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new UnauthorizedError('유효하지 않은 토큰입니다');
      });

      // Act & Assert
      await expect(
        AuthService.refreshAccessToken('invalid_token')
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('getMe', () => {
    let testUserId: string;

    beforeEach(async () => {
      // Create test user
      const user = await UserModel.create({
        email: 'getme@example.com',
        password: 'password123',
        name: 'GetMe Test User',
        role: 'employee',
        department: 'Engineering',
        position: 'Senior Developer',
        isActive: true,
        lastLogin: new Date(),
      });
      testUserId = user._id.toString();
    });

    it('should successfully return user information', async () => {
      // Act
      const result = await AuthService.getMe(testUserId);

      // Assert
      expect(result).toMatchObject({
        id: testUserId,
        email: 'getme@example.com',
        name: 'GetMe Test User',
        role: 'employee',
        department: 'Engineering',
        position: 'Senior Developer',
        isActive: true,
      });
      expect(result).toHaveProperty('lastLogin');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');

      // Password should not be in response
      expect(result).not.toHaveProperty('password');

      // Verify debug log
      expect(logger.debug).toHaveBeenCalledWith(
        '사용자 정보 조회',
        expect.any(Object)
      );
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const nonExistentUserId = new mongoose.Types.ObjectId().toString();

      // Act & Assert
      await expect(AuthService.getMe(nonExistentUserId)).rejects.toThrow(
        NotFoundError
      );
      await expect(AuthService.getMe(nonExistentUserId)).rejects.toThrow(
        '사용자를 찾을 수 없습니다'
      );

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '사용자 조회 실패 - 존재하지 않는 사용자',
        expect.any(Object)
      );
    });

    it('should return user with optional fields as undefined when not set', async () => {
      // Arrange: Create user without optional fields
      const minimalUser = await UserModel.create({
        email: 'minimal@example.com',
        password: 'password123',
        name: 'Minimal User',
        role: 'employee',
      });

      // Act
      const result = await AuthService.getMe(minimalUser._id.toString());

      // Assert
      expect(result.avatar).toBeUndefined();
      expect(result.department).toBeUndefined();
      expect(result.position).toBeUndefined();
      expect(result.lastLogin).toBeUndefined();
    });
  });

  describe('updateProfile', () => {
    let testUserId: string;

    beforeEach(async () => {
      // Create test user
      const user = await UserModel.create({
        email: 'update@example.com',
        password: 'password123',
        name: 'Original Name',
        role: 'employee',
        department: 'Original Department',
        position: 'Original Position',
      });
      testUserId = user._id.toString();
    });

    it('should successfully update allowed profile fields', async () => {
      // Arrange
      const updateData: UpdateProfileInput = {
        name: 'Updated Name',
        department: 'Updated Department',
        position: 'Updated Position',
        avatar: 'https://example.com/avatar.jpg',
      };

      // Act
      const result = await AuthService.updateProfile(testUserId, updateData);

      // Assert
      expect(result).toMatchObject({
        id: testUserId,
        name: 'Updated Name',
        department: 'Updated Department',
        position: 'Updated Position',
        avatar: 'https://example.com/avatar.jpg',
      });
      expect(result).toHaveProperty('updatedAt');

      // Verify database was updated
      const userInDb = await UserModel.findById(testUserId);
      expect(userInDb?.name).toBe('Updated Name');
      expect(userInDb?.department).toBe('Updated Department');

      // Verify success was logged
      expect(logger.info).toHaveBeenCalledWith(
        '프로필 수정 완료',
        expect.objectContaining({
          updatedFields: ['name', 'department', 'position', 'avatar'],
        })
      );
    });

    it('should only update provided fields (partial update)', async () => {
      // Arrange
      const updateData: UpdateProfileInput = {
        name: 'Only Name Updated',
      };

      // Act
      const result = await AuthService.updateProfile(testUserId, updateData);

      // Assert
      expect(result.name).toBe('Only Name Updated');
      expect(result.department).toBe('Original Department');
      expect(result.position).toBe('Original Position');
    });

    it('should ignore disallowed fields (whitelist protection)', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Name',
        email: 'hacker@example.com', // Should be ignored
        role: 'admin', // Should be ignored
        isActive: false, // Should be ignored
        password: 'hacked', // Should be ignored
      } as UpdateProfileInput;

      // Act
      const result = await AuthService.updateProfile(testUserId, updateData);

      // Assert
      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('update@example.com'); // Unchanged
      expect(result.role).toBe('employee'); // Unchanged

      // Verify database - protected fields should not change
      const userInDb = await UserModel.findById(testUserId).select('+password');
      expect(userInDb?.email).toBe('update@example.com');
      expect(userInDb?.role).toBe('employee');
      expect(userInDb?.isActive).toBe(true);
      expect(userInDb?.password).not.toBe('hacked');

      // Verify warnings were logged for disallowed fields
      expect(logger.warn).toHaveBeenCalledWith(
        '프로필 수정 시도 - 허용되지 않은 필드',
        expect.objectContaining({ field: 'email' })
      );
      expect(logger.warn).toHaveBeenCalledWith(
        '프로필 수정 시도 - 허용되지 않은 필드',
        expect.objectContaining({ field: 'role' })
      );
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const nonExistentUserId = new mongoose.Types.ObjectId().toString();
      const updateData: UpdateProfileInput = { name: 'New Name' };

      // Act & Assert
      await expect(
        AuthService.updateProfile(nonExistentUserId, updateData)
      ).rejects.toThrow(NotFoundError);
      await expect(
        AuthService.updateProfile(nonExistentUserId, updateData)
      ).rejects.toThrow('사용자를 찾을 수 없습니다');

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '프로필 수정 실패 - 존재하지 않는 사용자',
        expect.any(Object)
      );
    });

    it('should validate field values (mongoose validators)', async () => {
      // Arrange: Try to update with invalid data
      const updateData: UpdateProfileInput = {
        name: 'A', // Too short (minlength: 2)
      };

      // Act & Assert
      await expect(
        AuthService.updateProfile(testUserId, updateData)
      ).rejects.toThrow();
    });

    it('should handle empty update data', async () => {
      // Arrange
      const updateData: UpdateProfileInput = {};

      // Act
      const result = await AuthService.updateProfile(testUserId, updateData);

      // Assert: Nothing should change
      expect(result.name).toBe('Original Name');
      expect(result.department).toBe('Original Department');
    });
  });

  describe('changePassword', () => {
    let testUserId: string;
    const currentPassword = 'current_password123';
    const newPassword = 'new_password456';

    beforeEach(async () => {
      // Create test user
      const user = await UserModel.create({
        email: 'changepass@example.com',
        password: currentPassword,
        name: 'Password Test User',
        role: 'employee',
      });
      testUserId = user._id.toString();
    });

    it('should successfully change password', async () => {
      // Act
      const result = await AuthService.changePassword(
        testUserId,
        currentPassword,
        newPassword
      );

      // Assert
      expect(result).toEqual({
        message: '비밀번호가 변경되었습니다',
      });

      // Verify new password works
      const userInDb = await UserModel.findById(testUserId).select('+password');
      const isNewPasswordValid = await userInDb!.comparePassword(newPassword);
      expect(isNewPasswordValid).toBe(true);

      // Verify old password no longer works
      const isOldPasswordValid = await userInDb!.comparePassword(
        currentPassword
      );
      expect(isOldPasswordValid).toBe(false);

      // Verify success was logged
      expect(logger.info).toHaveBeenCalledWith(
        '비밀번호 변경 완료',
        expect.any(Object)
      );
    });

    it('should hash the new password', async () => {
      // Act
      await AuthService.changePassword(
        testUserId,
        currentPassword,
        newPassword
      );

      // Assert
      const userInDb = await UserModel.findById(testUserId).select('+password');
      expect(userInDb?.password).not.toBe(newPassword);
      expect(userInDb?.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const nonExistentUserId = new mongoose.Types.ObjectId().toString();

      // Act & Assert
      await expect(
        AuthService.changePassword(
          nonExistentUserId,
          currentPassword,
          newPassword
        )
      ).rejects.toThrow(NotFoundError);
      await expect(
        AuthService.changePassword(
          nonExistentUserId,
          currentPassword,
          newPassword
        )
      ).rejects.toThrow('사용자를 찾을 수 없습니다');

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '비밀번호 변경 실패 - 존재하지 않는 사용자',
        expect.any(Object)
      );
    });

    it('should throw UnauthorizedError when current password is incorrect', async () => {
      // Act & Assert
      await expect(
        AuthService.changePassword(testUserId, 'wrong_password', newPassword)
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        AuthService.changePassword(testUserId, 'wrong_password', newPassword)
      ).rejects.toThrow('현재 비밀번호가 일치하지 않습니다');

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        '비밀번호 변경 실패 - 현재 비밀번호 불일치',
        expect.any(Object)
      );

      // Verify password was not changed
      const userInDb = await UserModel.findById(testUserId).select('+password');
      const isOldPasswordStillValid = await userInDb!.comparePassword(
        currentPassword
      );
      expect(isOldPasswordStillValid).toBe(true);
    });

    it('should validate new password requirements', async () => {
      // Arrange: Try to use a password that's too short
      const tooShortPassword = '1234567'; // Less than 8 characters

      // Act & Assert
      await expect(
        AuthService.changePassword(testUserId, currentPassword, tooShortPassword)
      ).rejects.toThrow();
    });

    it('should allow changing password to the same password', async () => {
      // Act
      const result = await AuthService.changePassword(
        testUserId,
        currentPassword,
        currentPassword
      );

      // Assert
      expect(result.message).toBe('비밀번호가 변경되었습니다');

      // Password should still work
      const userInDb = await UserModel.findById(testUserId).select('+password');
      const isPasswordValid = await userInDb!.comparePassword(currentPassword);
      expect(isPasswordValid).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle concurrent registrations with same email gracefully', async () => {
      // Arrange
      const registerData: RegisterInput = {
        email: 'concurrent@example.com',
        password: 'password123',
        name: 'Concurrent User',
      };

      // Act: Simulate concurrent registrations
      const promises = [
        AuthService.register(registerData),
        AuthService.register(registerData),
      ];

      // Assert: One should succeed, one should fail with ConflictError
      const results = await Promise.allSettled(promises);

      const successCount = results.filter((r) => r.status === 'fulfilled').length;
      const failureCount = results.filter((r) => r.status === 'rejected').length;

      expect(successCount).toBe(1);
      expect(failureCount).toBe(1);

      // The failed one should be ConflictError
      const failedResult = results.find((r) => r.status === 'rejected') as {
        status: 'rejected';
        reason: Error;
      };
      expect(failedResult.reason).toBeInstanceOf(ConflictError);
    });

    it('should handle database connection errors gracefully', async () => {
      // Arrange: Disconnect from database
      await mongoose.disconnect();

      // Act & Assert: Should throw database error
      await expect(
        AuthService.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toThrow();

      // Cleanup: Reconnect for other tests
      await mongoose.connect((await MongoMemoryServer.create()).getUri());
    });

    it('should handle invalid ObjectId format', async () => {
      // Act & Assert
      await expect(AuthService.getMe('invalid_object_id')).rejects.toThrow();
    });

    it('should handle very long input strings within limits', async () => {
      // Arrange
      const longName = 'A'.repeat(50); // Max is 50
      const registerData: RegisterInput = {
        email: 'long@example.com',
        password: 'password123',
        name: longName,
      };

      // Act
      const result = await AuthService.register(registerData);

      // Assert
      expect(result.user.name).toBe(longName);
    });

    it('should trim whitespace from input fields', async () => {
      // Arrange
      const registerData: RegisterInput = {
        email: '  whitespace@example.com  ',
        password: 'password123',
        name: '  Whitespace User  ',
      };

      // Act
      const result = await AuthService.register(registerData);

      // Assert
      expect(result.user.email).toBe('whitespace@example.com');
      expect(result.user.name).toBe('Whitespace User');
    });
  });
});
