import { test, expect } from '@jest/globals';
import { getAuthUserIdHandler } from '@/server/api/controllers/users.controller';

test('API Test', async () => {
  const email: string = 'example@example.com';

  const { userId } = await getAuthUserIdHandler(email);

  expect(userId).toBeTruthy();
});
