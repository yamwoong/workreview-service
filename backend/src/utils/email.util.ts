import nodemailer from 'nodemailer';
import { logger } from '../config/logger';

/**
 * Nodemailer transporter 설정
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * 비밀번호 재설정 이메일 전송
 * @param email - 수신자 이메일
 * @param resetToken - 재설정 토큰
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '[WorkReview] 비밀번호 재설정 요청',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .token-box {
                background: white;
                border: 2px dashed #667eea;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
                border-radius: 8px;
              }
              .token {
                font-size: 32px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 8px;
                margin: 20px 0;
                font-weight: bold;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #777;
              }
              .warning {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 비밀번호 재설정</h1>
              </div>
              <div class="content">
                <p>안녕하세요,</p>
                <p>비밀번호 재설정 요청을 받았습니다. 아래 인증 코드를 사용하여 비밀번호를 재설정하실 수 있습니다.</p>

                <div class="token-box">
                  <p style="margin: 0; color: #666; font-size: 14px;">인증 코드</p>
                  <div class="token">${resetToken}</div>
                  <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">유효 시간: 1시간</p>
                </div>

                <p style="text-align: center;">또는 아래 버튼을 클릭하세요:</p>

                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">비밀번호 재설정하기</a>
                </div>

                <div class="warning">
                  <strong>⚠️ 보안 안내</strong>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>이 요청을 하지 않으셨다면 이 이메일을 무시하세요.</li>
                    <li>인증 코드는 1시간 후 만료됩니다.</li>
                    <li>인증 코드는 타인에게 공유하지 마세요.</li>
                  </ul>
                </div>

                <div class="footer">
                  <p>감사합니다,<br>WorkReview 팀</p>
                  <p style="color: #999;">이 이메일은 자동으로 발송되었습니다. 회신하지 마세요.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
비밀번호 재설정 요청

인증 코드: ${resetToken}
유효 시간: 1시간

또는 아래 링크를 방문하세요:
${resetUrl}

이 요청을 하지 않으셨다면 이 이메일을 무시하세요.

감사합니다,
WorkReview 팀
      `,
    };

    await transporter.sendMail(mailOptions);

    logger.info('비밀번호 재설정 이메일 전송 성공', {
      email,
      resetUrl,
    });
  } catch (error) {
    logger.error('비밀번호 재설정 이메일 전송 실패', {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error('이메일 전송에 실패했습니다');
  }
};

/**
 * 비밀번호 재설정 완료 이메일 전송
 * @param email - 수신자 이메일
 * @param name - 사용자 이름
 */
export const sendPasswordChangedEmail = async (
  email: string,
  name: string
): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '[WorkReview] 비밀번호가 변경되었습니다',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .success-box {
                background: #d4edda;
                border-left: 4px solid #28a745;
                padding: 15px;
                margin: 20px 0;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ 비밀번호 변경 완료</h1>
              </div>
              <div class="content">
                <p>안녕하세요, ${name}님</p>

                <div class="success-box">
                  <strong>✓ 비밀번호가 성공적으로 변경되었습니다.</strong>
                  <p style="margin: 10px 0 0 0;">변경 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                </div>

                <p>본인이 변경하지 않으셨다면 즉시 고객 지원팀에 문의하시기 바랍니다.</p>

                <div class="footer">
                  <p>감사합니다,<br>WorkReview 팀</p>
                  <p style="color: #999;">이 이메일은 자동으로 발송되었습니다. 회신하지 마세요.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
안녕하세요, ${name}님

비밀번호가 성공적으로 변경되었습니다.
변경 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

본인이 변경하지 않으셨다면 즉시 고객 지원팀에 문의하시기 바랍니다.

감사합니다,
WorkReview 팀
      `,
    };

    await transporter.sendMail(mailOptions);

    logger.info('비밀번호 변경 완료 이메일 전송 성공', { email });
  } catch (error) {
    logger.error('비밀번호 변경 완료 이메일 전송 실패', {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    // 비밀번호는 이미 변경되었으므로 에러를 던지지 않음
  }
};
