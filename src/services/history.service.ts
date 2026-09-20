import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/database.js";
import {
    History,
    HistoryRow,
    HistoryRequest
} from "../types/history.types.js";


/**
 * Ambil history milik satu rekening berdasarkan bulan & tahun.
 * @param rekeningId - ID rekening
 * @param month - 1-12
 * @param year - contoh 2026
 */

export const showdata = async (data: HistoryRequest): Promise<History[]> => {

    const [rows] = await db.execute<HistoryRow[]>(
        "SELECT id, nominal, description, rekening_id FROM users WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?",
        [data.month, data.year]
    );

    return rows.map((row) => ({
        id: row.id,
        nominal: row.nominal,
        description: row.description,
        rekening_id: row.rekening_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }));
};
