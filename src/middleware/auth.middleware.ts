import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types.js";

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token tidak ditemukan"
            });
        }

        const token = authHeader.split(" ")[1];

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Tempelkan payload ke request
        (req as Request & { user: JwtPayload }).user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau sudah expired"
        });
    }
};