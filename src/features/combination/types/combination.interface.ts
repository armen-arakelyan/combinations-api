import { RowDataPacket } from "mysql2";

export interface CombinationInterface extends RowDataPacket {
    id: number;
    combination: string[];
}
