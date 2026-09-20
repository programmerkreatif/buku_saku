import { RowDataPacket } from "mysql2";


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

export interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
}