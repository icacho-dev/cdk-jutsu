export interface User {
  id: string;
  name: string;
}

export class UserService {
  /**
   * Get user by ID
   * @param id - The user ID to retrieve
   * @returns Promise<User | null> - The user object or null if not found
   */
  async getUserById(id: string): Promise<User | null> {
    // Simulate async operation (e.g., database call)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock user data
    const mockUsers: Record<string, User> = {
      '1': { id: '1', name: 'John Doe' },
      '2': { id: '2', name: 'Jane Smith' },
      '3': { id: '3', name: 'Bob Johnson' },
    };

    return mockUsers[id] || null;
  }
}
