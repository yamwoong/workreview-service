/**
 * 기본 애플리케이션 에러 클래스
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

/**
 * 잘못된 요청 에러 (400)
 */
export class BadRequestError extends AppError {
  constructor(message = '잘못된 요청입니다') {
    super(message, 400, 'BAD_REQUEST');
  }
}

/**
 * 인증 실패 에러 (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message = '인증이 필요합니다') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

/**
 * 권한 없음 에러 (403)
 */
export class ForbiddenError extends AppError {
  constructor(message = '접근 권한이 없습니다') {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * 리소스를 찾을 수 없음 에러 (404)
 */
export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * 충돌 에러 (409)
 */
export class ConflictError extends AppError {
  constructor(message = '리소스가 이미 존재합니다') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * 검증 에러 상세 정보 타입
 */
export type ValidationErrorDetail = {
  field: string;
  message: string;
};

/**
 * 검증 실패 에러 (422)
 */
export class ValidationError extends AppError {
  public readonly details?: ValidationErrorDetail[];

  constructor(
    message = '입력값 검증에 실패했습니다',
    details?: ValidationErrorDetail[]
  ) {
    super(message, 422, 'VALIDATION_ERROR');
    this.details = details;
  }
}

/**
 * 너무 많은 요청 에러 (429)
 */
export class TooManyRequestsError extends AppError {
  constructor(message = '너무 많은 요청이 발생했습니다') {
    super(message, 429, 'TOO_MANY_REQUESTS');
  }
}

/**
 * 내부 서버 에러 (500)
 */
export class InternalServerError extends AppError {
  constructor(message = '서버 내부 오류가 발생했습니다') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}














