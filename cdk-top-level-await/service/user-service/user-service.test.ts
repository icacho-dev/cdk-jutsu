import { describe, it, expect, beforeEach } from 'vitest';
import { UserService, User } from './user-service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should return user when valid ID is provided', async () => {
    const userId = '1';
    const result = await userService.getUserById(userId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe('1');
    expect(result?.name).toBe('John Doe');
  });

  it('should return null when invalid ID is provided', async () => {
    const userId = '999';
    const result = await userService.getUserById(userId);

    expect(result).toBeNull();
  });

  it('should return correct user for different valid IDs', async () => {
    const user2 = await userService.getUserById('2');
    const user3 = await userService.getUserById('3');

    expect(user2?.name).toBe('Jane Smith');
    expect(user3?.name).toBe('Bob Johnson');
  });
});
