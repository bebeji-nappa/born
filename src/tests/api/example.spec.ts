import { test, expect } from '@jest/globals';
import { getAllUsersHandler } from '../../server/api/controllers/users.controller';

test('API Example Test', async () => {
  const data = await getAllUsersHandler();
  expect(data?.users).not.toHaveLength(3);
});
