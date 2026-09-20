export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
}

export interface JwtPayload {
    userId: number;
    email: string;
    role: "admin" | "user";
}