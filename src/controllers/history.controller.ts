import { Request, Response } from "express";
import * as historyService from "../services/history.service.js";
import {
    showdata,
    getHistoryById,
    createHistory,
    deleteHistory
} from "../services/history.service.js";

const getUserId = (req: Request): number | null => {
    return (req as Request & { user?: { userId?: number } }).user?.userId ?? null;
};



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

/**
 * ✅ READ — GET /api/history/:id
 */
export const getHistoryDetail = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User tidak terautentikasi"
            });
        }

        const historyId = Number(req.params.id);
        const history = await getHistoryById(historyId);

        if (!history) {
            return res.status(404).json({
                success: false,
                message: "History tidak ditemukan"
            });
        }

        return res.json({ success: true, data: history });

    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Something went wrong";
        return res.status(500).json({ success: false, message });
    }
};

/**
 * ✅ CREATE — POST /api/history
 */
export const createHistoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User tidak terautentikasi"
            });
        }

        const { nominal, description, rekeningId, type } = req.body;

        if (!nominal || !description || !rekeningId) {
            return res.status(400).json({
                success: false,
                message: "nominal, description, rekeningId wajib diisi"
            });
        }

        const history = await createHistory(userId, {
            nominal: String(nominal),
            description: String(description),
            rekeningId: Number(rekeningId),
            type: String(type)
        }, req.body);

        return res.status(201).json({
            success: true,
            data: history
        });

    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Something went wrong";
        return res.status(500).json({ success: false, message });
    }
};

/**
 * ✅ DELETE — DELETE /api/history/:id
 */
export const deleteHistoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User tidak terautentikasi"
            });
        }

        const historyId = Number(req.params.id);
        await deleteHistory(userId, historyId);

        return res.json({
            success: true,
            message: "History berhasil dihapus"
        });

    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Something went wrong";
        return res.status(500).json({ success: false, message });
    }
};