import { RowDataPacket } from "mysql2";

export interface HistoryRow extends RowDataPacket {
    id: number;
    nominal: string; //decimal
    description: string;
    rekening_id: number;
    created_at: Date | null;
    updated_at: Date | null;
}