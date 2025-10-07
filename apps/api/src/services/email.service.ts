import { Resend } from "resend";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  from?: {
    email: string;
    name: string;
  };
};

type Bindings = {
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
};

export async function sendEmail(
  options: EmailOptions,
  env: Bindings,
): Promise<boolean> {
  const from = options.from || {
    email: env.EMAIL_FROM,
    name: env.EMAIL_FROM_NAME,
  };

  try {
    const resend = new Resend(env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: `${from.name} <${from.email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error("Resend API error:", error);
      return false;
    }

    console.log("Email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export function generateVerificationEmailHTML(verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>メールアドレスの確認</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #000000;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">メールアドレスの確認</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                      Born へのご登録ありがとうございます。
                    </p>
                    <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                      以下のボタンをクリックして、メールアドレスの確認を完了してください。
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 14px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                            メールアドレスを確認
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：<br>
                      <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all; text-decoration: underline;">${verificationUrl}</a>
                    </p>
                    <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      このリンクは24時間有効です。
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      ※このメールに心当たりがない場合は、破棄してください。
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; background-color: #f9fafb; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2024 Born. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function generateEmailChangeVerificationHTML(
  verificationUrl: string,
  newEmail: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>メールアドレス変更の確認</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #000000;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">メールアドレス変更の確認</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                      メールアドレスの変更リクエストを受け付けました。
                    </p>
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                      変更後のメールアドレス：<strong>${newEmail}</strong>
                    </p>
                    <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                      以下のボタンをクリックして、メールアドレスの変更を完了してください。
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${verificationUrl}" style="display: inline-block; padding: 14px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                            メールアドレス変更を確認
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：<br>
                      <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all; text-decoration: underline;">${verificationUrl}</a>
                    </p>
                    <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      このリンクは1時間有効です。
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      ※このメールに心当たりがない場合は、破棄してください。誰かがあなたのメールアドレスを誤って入力した可能性があります。
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; background-color: #f9fafb; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2024 Born. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function generatePasswordResetHTML(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>パスワードのリセット</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #000000;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">パスワードのリセット</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                      パスワードのリセットリクエストを受け付けました。
                    </p>
                    <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                      以下のボタンをクリックして、新しいパスワードを設定してください。
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 14px 40px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                            パスワードをリセット
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：<br>
                      <a href="${resetUrl}" style="color: #2563eb; word-break: break-all; text-decoration: underline;">${resetUrl}</a>
                    </p>
                    <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      このリンクは1時間有効です。
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      ※このメールに心当たりがない場合は、破棄してください。誰かがあなたのメールアドレスを誤って入力した可能性があります。
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; background-color: #f9fafb; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2024 Born. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function generatePasswordChangedNotificationHTML(
  frontendUrl: string,
): string {
  const forgotPasswordUrl = `${frontendUrl}/forgot-password`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>パスワードが変更されました</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #000000;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">パスワードが変更されました</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                      あなたのアカウントのパスワードが正常に変更されました。
                    </p>
                    <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                      この変更に心当たりがある場合は、このメールを無視してください。
                    </p>
                    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
                      <p style="margin: 0 0 12px; color: #991b1b; font-size: 14px; font-weight: 600;">
                        ⚠️ セキュリティに関する重要なお知らせ
                      </p>
                      <p style="margin: 0 0 12px; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                        もし、この変更に心当たりがない場合は、アカウントが危険にさらされている可能性があります。
                      </p>
                      <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
                        至急、以下のリンクからパスワードを再設定してください。
                      </p>
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${forgotPasswordUrl}" style="display: inline-block; padding: 14px 40px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                            パスワードを再設定する
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      ボタンが機能しない場合は、以下のURLをコピーしてブラウザに貼り付けてください：<br>
                      <a href="${forgotPasswordUrl}" style="color: #2563eb; word-break: break-all; text-decoration: underline;">${forgotPasswordUrl}</a>
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      ※このメールは、あなたのアカウントのセキュリティを保護するために自動送信されています。
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; background-color: #f9fafb; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      © 2024 Born. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
