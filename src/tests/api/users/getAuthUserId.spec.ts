import { test, expect } from '@jest/globals';
import { getAuthUserIdHandler } from '@/server/api/controllers/users.controller';

test('API Test', async () => {
  // TODO: Seed データ追加後に、テストユーザに変更する
  const email: string = process.env.TEST_AUTH_USER_EMAIL!;

  const { userId } = await getAuthUserIdHandler(email);

  expect(userId).toBeTruthy();
});
