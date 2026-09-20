export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}