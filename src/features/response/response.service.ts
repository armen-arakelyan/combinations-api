import { dbService } from '../../infrastructure';
import { ResponseEntity } from './response.entity';

class ResponseService {
    private db = dbService;

    async storeResponse(combinationId: string): Promise<void> {
        const responseEntity = new ResponseEntity(combinationId);

        await this.db.executeInTransaction(async (connection) => {
            await connection.query(
                `INSERT INTO responses (id, combination_id) VALUES (?, ?)`,
                [responseEntity.id, responseEntity.combinationId]
            );
        });
    }
}

const responseService = new ResponseService();

export { responseService };
