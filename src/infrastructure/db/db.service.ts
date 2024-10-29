import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    public pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    public async executeInTransaction<T>(callback: (connection: PoolConnection) => Promise<T>): Promise<T> {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    public async insert(table: string, data: Record<string, unknown>): Promise<number> {
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map(() => '?').join(', ');

        return this.executeInTransaction(async (connection) => {
            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
                values
            );
            return result.insertId;
        });
    }

    public async update(
        table: string,
        data: Record<string, unknown>,
        condition: string,
        conditionValues: unknown[]
    ): Promise<void> {
        const updates = Object.keys(data).map((key) => `${key} = ?`).join(', ');
        const values = [...Object.values(data), ...conditionValues];

        await this.executeInTransaction(async (connection) => {
            await connection.query(
                `UPDATE ${table} SET ${updates} WHERE ${condition}`,
                values
            );
        });
    }

    public async delete(table: string, condition: string, conditionValues: unknown[]): Promise<void> {
        await this.executeInTransaction(async (connection) => {
            await connection.query(
                `DELETE FROM ${table} WHERE ${condition}`,
                conditionValues
            );
        });
    }

    public async select<T extends RowDataPacket[]>(
        table: string,
        columns: string[],
        condition?: string,
        conditionValues: unknown[] = []
    ): Promise<T> {
        const columnList = columns.join(', ');
        const query = `SELECT ${columnList} FROM ${table}${condition ? ` WHERE ${condition}` : ''}`;

        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query<T>(query, conditionValues);
            return rows;
        } finally {
            connection.release();
        }
    }
}

const dbService = new Database();

const initializeDatabase = async (): Promise<void> => {
    try {
        const connection = await dbService.pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
};

export {
    dbService,
    initializeDatabase
};
