import { Request, Response } from "express";
import * as historyService from "../services/history.service.js";

export const showdatabyfilter = async (
    req: Request,
    res: Response
) => {
    try {

        const { month, year } = req.body;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: "Month and year are required"
            });
        }

        const history = await historyService.showdata({
            month,
            year
        });

        return res.status(200).json({
            success: true,
            message: "History data retrieved successfully",
            data: history
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