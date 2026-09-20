import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/database.js";
import {
    History,
    HistoryRow,
    HistoryRequest,
    CreateHistoryRequest,
    UpdateHistoryRequest
} from "../types/history.types.js";



const mapRowToHistory = (row: HistoryRow): History => ({
    id: row.id,
    nominal: row.nominal,
    description: row.description,
    rekeningId: row.rekening_id,
    type: row.type,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});


/**
 * Ambil history milik satu rekening berdasarkan bulan & tahun.
 * @param rekeningId - ID rekening
 * @param month - 1-12
 * @param year - contoh 2026
 */

export const showdata = async (data: HistoryRequest): Promise<History[]> => {

    const [rows] = await db.execute<HistoryRow[]>(
        "SELECT id, nominal, description, rekening_id, type, created_at, updated_at FROM history WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?",
        [data.month, data.year]
    );

    return rows.map(mapRowToHistory);
};


/**
 * ✅ READ — Ambil satu history by ID (milik user).
 */
export const getHistoryById = async (
    historyId: number
): Promise<History | null> => {

    const [rows] = await db.execute<HistoryRow[]>(
        `SELECT h.id, h.nominal, h.description, h.rekening_id, h.type,
                h.created_at, h.updated_at
         FROM history h
         INNER JOIN rekening r ON r.id = h.rekening_id
         WHERE h.id = ?
         LIMIT 1`,
        [historyId]
    );

    if (rows.length === 0) return null;

    return mapRowToHistory(rows[0]);
};

/**
 * ✅ CREATE — Tambah history baru.
 */
export const createHistory = async (
userId: number, p0: { nominal: string; description: string; rekeningId: number; type: string; }, data: CreateHistoryRequest): Promise<History> => {

    // Pastikan rekening milik user
    const [rekening] = await db.execute<HistoryRow[]>(
        `SELECT id FROM rekening WHERE id = ?`,
        [data.rekeningId]
    );

    if (rekening.length === 0) {
        throw new Error("Rekening tidak ditemukan atau bukan milik Anda");
    }

    // 2️⃣ Hitung saldo baru — pakai BigInt biar presisi
    const saldoLama = BigInt(rekening[0].nominal.replace(".", ""));
    const nominal = BigInt(data.nominal.replace(".", ""));

    const saldoBaru =
        data.type === "pemasukan"
            ? saldoLama + nominal
            : saldoLama - nominal;

    if (saldoBaru < 0n) {
        throw new Error("Saldo tidak mencukupi");
    }
    const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO history (nominal, description, rekening_id)
         VALUES (?, ?, ?)`,
        [data.nominal, data.description, data.rekeningId]
    );

    const history = await getHistoryById(result.insertId);


    await db.execute<ResultSetHeader>(
        `UPDATE rekening SET nominal = ? WHERE id = ?`,
        [saldoBaru.toString(), data.rekeningId]
    );


    if (!history) {
        throw new Error("Gagal mengambil history yang baru dibuat");
    }

    return history;
};

/**
 * ✅ UPDATE — Ubah history milik user.
 */
// export const updateHistory = async (
//     userId: number,
//     historyId: number,
//     data: UpdateHistoryRequest
// ): Promise<History> => {

//     const existing = await getHistoryById(historyId);
//     if (!existing) {
//         throw new Error("History tidak ditemukan");
//     }

//     const fields: string[] = [];
//     const values: any[] = [];

//     if (data.nominal !== undefined) {
//         fields.push("nominal = ?");
//         values.push(data.nominal);
//     }
//     if (data.description !== undefined) {
//         fields.push("description = ?");
//         values.push(data.description);
//     }
//     if (data.rekeningId !== undefined) {
//         // Pastikan rekening baru juga milik user
//         const [rekening] = await db.execute<HistoryRow[]>(
//             `SELECT id FROM rekening WHERE id = ? AND user_id = ?`,
//             [data.rekeningId, userId]
//         );
//         if (rekening.length === 0) {
//             throw new Error("Rekening tujuan bukan milik Anda");
//         }
//         fields.push("rekening_id = ?");
//         values.push(data.rekeningId);
//     }

//     if (fields.length === 0) {
//         throw new Error("Tidak ada field yang diupdate");
//     }

//     values.push(historyId);

//     await db.execute<ResultSetHeader>(
//         `UPDATE history SET ${fields.join(", ")} WHERE id = ?`,
//         values
//     );

//     const updated = await getHistoryById(historyId);
//     if (!updated) {
//         throw new Error("Gagal mengambil history yang diupdate");
//     }

//     return updated;
// };

/**
 * ✅ DELETE — Hapus history milik user.
 */
export const deleteHistory = async (
    userId: number,
    historyId: number
): Promise<void> => {

    const existing = await getHistoryById(historyId);
    if (!existing) {
        throw new Error("History tidak ditemukan");
    }


    const [rekening] = await db.execute<HistoryRow[]>(
        `SELECT id FROM rekening WHERE id = ?`,
        [existing.rekeningId]
    );

    // 2️⃣ Hitung saldo baru — pakai BigInt biar presisi
    const saldoLama = BigInt(existing.nominal.replace(".", ""));
    const nominal = BigInt(rekening[0].nominal.replace(".", ""));

    const saldoBaru =
        rekening[0].type === "pemasukan"
            ? saldoLama + nominal
            : saldoLama - nominal;

    await db.execute<ResultSetHeader>(
        `UPDATE rekening SET nominal = ? WHERE id = ?`,
        [saldoBaru.toString(), existing.rekeningId]
    );


    await db.execute<ResultSetHeader>(
        `DELETE FROM history WHERE id = ?`,
        [historyId]
    );
};



