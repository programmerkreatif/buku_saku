import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/database.js";
import {
    LoginRequest,
    RegisterRequest,
    User,
    JwtPayload
} from "../types/auth.types.js";

import { UserRow } from "../types/user.types.js";


export const register = async (
    data: RegisterRequest
): Promise<User> => {

    const [existingUsers] = await db.execute<UserRow[]>(
        "SELECT id FROM users WHERE email = ?",
        [data.email]
    );

    if (existingUsers.length > 0) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );

    const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)`,
        [
            data.name,
            data.email,
            hashedPassword
        ]
    );

    return {
        id: result.insertId,
        name: data.name,
        email: data.email,
        role: "user"
    };
};

export const login = async (
    data: LoginRequest
): Promise<{
    user: User;
    token: string;
}> => {

    const [rows] = await db.execute<UserRow[]>(
        `SELECT id, name, email, password, role
         FROM users
         WHERE email = ?`,
        [data.email]
    );

    if (rows.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = rows[0];

    const passwordValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!passwordValid) {
        throw new Error("Invalid email or password");
    }

    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
    };

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
        payload,
        secret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        } as jwt.SignOptions
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};