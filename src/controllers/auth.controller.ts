import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export const register = async (
    req: Request,
    res: Response
) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const user = await authService.register({
            name,
            email,
            password
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: user
        });

    } catch (error) {

        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong";

        return res.status(400).json({
            success: false,
            message
        });
    }
};

export const login = async (
    req: Request,
    res: Response
) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const result = await authService.login({
            email,
            password
        });

        return res.json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (error) {

        const message =
            error instanceof Error
                ? error.message
                : "Something went wrong";

        return res.status(401).json({
            success: false,
            message
        });
    }
};