import { RowDataPacket } from "mysql2";

export interface RekeingRow extends RowDataPacket {
    id: number;
    bank: string;
    rekening: string;
    nominal: string; // decimal
    saldo: string; // decimal
    created_at: Date | null;
    updated_at: Date | null;
}