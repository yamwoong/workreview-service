import mongoose from 'mongoose';
import { UserModel } from '../models/User.model';
import { connectDatabase } from '../config/database';
import { logger } from '../config/logger';

/**
 * 테스트 사용자 시드 데이터
 */
const seedUsers = [
  {
    email: 'tester@test.com',
    password: 'test1234',
    username: 'test_user',
    role: 'employee' as const,
    department: 'QA',
    position: 'Tester',
    isActive: true,
    isEmailVerified: true,
    points: 100,
    trustScore: 75,
    reviewCount: 0,
    helpfulVoteCount: 0,
  },
  {
    email: 'admin@test.com',
    password: 'admin1234',
    username: 'admin_user',
    role: 'admin' as const,
    department: 'Management',
    position: 'Administrator',
    isActive: true,
    isEmailVerified: true,
    points: 500,
    trustScore: 100,
    reviewCount: 0,
    helpfulVoteCount: 0,
    badges: [
      {
        type: 'early_adopter' as const,
        name: 'Early Adopter',
        earnedAt: new Date(),
      },
    ],
  },
];

/**
 * Seed 스크립트 실행
 */
async function seed() {
  try {
    // 데이터베이스 연결
    await connectDatabase();

    logger.info('🌱 사용자 Seed 스크립트 시작');

    // 기존 테스트 사용자 삭제 (테스트/어드민 계정만)
    const deleteResult = await UserModel.deleteMany({
      email: { $in: ['tester@test.com', 'admin@test.com'] },
    });
    logger.info(`🗑️  기존 테스트 계정 ${deleteResult.deletedCount}개 삭제`);

    // Seed 데이터 삽입
    const insertedUsers = await UserModel.insertMany(seedUsers);
    logger.info(`✅ ${insertedUsers.length}개의 사용자 생성 완료`);

    // 결과 출력
    console.log('\n📊 생성된 사용자 계정:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    insertedUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.username} (${user.email})`
      );
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Password: ${seedUsers[index].password}`);
      console.log(`   - Points: ${user.points}`);
      console.log(`   - Trust Score: ${user.trustScore}`);
      console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    logger.info('🎉 사용자 Seed 완료!');
    logger.info('이제 다음 계정으로 로그인할 수 있습니다:');
    logger.info('  👤 테스터: tester@test.com / test1234');
    logger.info('  👑 어드민: admin@test.com / admin1234');

    // DB 연결 종료
    await mongoose.connection.close();
    logger.info('DB 연결 종료');
    process.exit(0);
  } catch (error) {
    logger.error('Seed 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
seed();
