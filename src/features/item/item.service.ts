import { dbService } from '../../infrastructure';
import { ItemEntity } from './item.entity';

class ItemService {
    private db = dbService;

    async storeItems(items: string[]): Promise<void> {
        const uniqueItems = Array.from(new Set(items));

        for (const item of uniqueItems) {
            const itemEntity = new ItemEntity(item);

            await this.db.executeInTransaction(async (connection) => {
                await connection.query(
                    `INSERT IGNORE INTO items (id, item_name) VALUES (?, ?)`,
                    [itemEntity.id, itemEntity.itemName]
                );
            });
        }
    }
}

const itemService = new ItemService();

export { itemService };
