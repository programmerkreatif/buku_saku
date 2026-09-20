import { RowDataPacket } from "mysql2";
export type HistoryType = "pemasukan" | "pengeluaran";

/**
 * Row mentah dari tabel `history` (snake_case).
 */
export interface HistoryRow extends RowDataPacket {
    id: number;
    nominal: string;
    description: string;
    rekening_id: number;
    type: string;
    created_at: Date | null;
    updated_at: Date | null;
}

/**
 * Bentuk history yang dikirim ke client (camelCase).
 */
export interface History {
    id: number;
    nominal: string;
    description: string;
    rekeningId: number;
    type: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

/**
 * Body untuk filter history.
 */
export interface HistoryRequest {
    month: number;
    year: number;
}

/**
 * Body untuk create history.
 */
export interface CreateHistoryRequest {
    nominal: string;
    description: string;
    type: HistoryType;
    rekeningId: number;
}

/**
 * Body untuk update history.
 */
export interface UpdateHistoryRequest {
    nominal?: string;
    description?: string;
    rekeningId?: number;
}