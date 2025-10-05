import { Resend } from 'resend'

type EmailOptions = {
  to: string
  subject: string
  html: string
  from?: {
    email: string
    name: string
  }
}

type Bindings = {
  RESEND_API_KEY: string
  EMAIL_FROM: string
  EMAIL_FROM_NAME: string
}

export async function sendEmail(options: EmailOptions, env: Bindings): Promise<boolean> {
  const from = options.from || {
    email: env.EMAIL_FROM,
    name: env.EMAIL_FROM_NAME,
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: `${from.name} <${from.email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      console.error('Resend API error:', error)
      return false
    }

    console.log('Email sent successfully:', data)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
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
  `
}
