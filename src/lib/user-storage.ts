import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize with default users if file doesn't exist
function initializeUsersFile() {
  ensureDataDirectory();
  
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers: User[] = [
      {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        password: '$2b$12$7CNdrN2S8WXx4ITP9XJPveoD.8DkQlBxbYjvxk552nNgwXg8rCJGC', // 'password123'
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Admin User',
        email: 'admin@postdost.com',
        password: '$2b$12$7CNdrN2S8WXx4ITP9XJPveoD.8DkQlBxbYjvxk552nNgwXg8rCJGC', // 'password123'
        createdAt: new Date().toISOString(),
      }
    ];
    
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
}

export function getAllUsers(): User[] {
  try {
    initializeUsersFile();
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

export function getUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id: string): User | null {
  const users = getAllUsers();
  return users.find(user => user.id === id) || null;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if user already exists
    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create new user
    const newUser: User = {
      id: Date.now().toString(), // Simple ID generation
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Add to users array
    const users = getAllUsers();
    users.push(newUser);

    // Save to file
    ensureDataDirectory();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword as User };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
  const user = getUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}