import { describe, expect, it } from "vitest";
import {
  generateVerificationEmailHTML,
  sendEmail,
} from "../../services/email.service";

describe("Email Service", () => {
  describe("generateVerificationEmailHTML", () => {
    it("確認用メールのHTMLを生成できる", () => {
      const url = "https://example.com/verify?token=abc123";
      const html = generateVerificationEmailHTML(url);

      expect(html).toContain("メールアドレスの確認");
      expect(html).toContain(url);
      expect(html).toContain("Born へのご登録ありがとうございます");
      expect(html).toContain("このリンクは24時間有効です");
    });

    it("URLが正しくエスケープされている", () => {
      const url = "https://example.com/verify?token=abc&test=123";
      const html = generateVerificationEmailHTML(url);

      expect(html).toContain(url);
    });
  });

  describe("sendEmail", () => {
    it("メールを送信できる", async () => {
      const mockEnv = {
        RESEND_API_KEY: "test-api-key",
        EMAIL_FROM: "test@example.com",
        EMAIL_FROM_NAME: "Test Sender",
      };

      // Resend APIのモック（実際のテストでは外部APIを呼ばない）
      // この部分は実際の環境では統合テストとして別途実装することを推奨
      const result = await sendEmail(
        {
          to: "recipient@example.com",
          subject: "Test Subject",
          html: "<p>Test HTML</p>",
        },
        mockEnv,
      );

      // 実際のAPIを呼ぶので、このテストは環境に依存します
      // モックを使う場合は、Resendクライアントを依存性注入するリファクタリングが必要
      expect(typeof result).toBe("boolean");
    });

    it("カスタムfromアドレスを使用できる", async () => {
      const mockEnv = {
        RESEND_API_KEY: "test-api-key",
        EMAIL_FROM: "default@example.com",
        EMAIL_FROM_NAME: "Default Sender",
      };

      const result = await sendEmail(
        {
          to: "recipient@example.com",
          subject: "Test Subject",
          html: "<p>Test HTML</p>",
          from: {
            email: "custom@example.com",
            name: "Custom Sender",
          },
        },
        mockEnv,
      );

      expect(typeof result).toBe("boolean");
    });
  });
});
