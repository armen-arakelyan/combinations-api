import { dbService } from '../../infrastructure';
import { generateCombinations } from './combination.util';
import { CombinationEntity } from './combination.entity';
import { CombinationInterface } from './types';
import { responseService } from '../response';
import { itemService } from '../item';

export class CombinationService {
    private db = dbService;
    private responseService = responseService;

    generateCombinations(items: number[], length: number): string[][] {
        return generateCombinations(items, length);
    }

    async storeCombination(combinationItems: string[]): Promise<string> {
        const combinationEntity = new CombinationEntity(combinationItems);

        await this.db.insert('combinations', {
            id: combinationEntity.id,
            combination: JSON.stringify(combinationEntity.combination),
        });

        return combinationEntity.id;
    }

    async storeAllCombinations(combinations: string[][]): Promise<{ id: string; combination: string[] }[]> {
        const storedCombinations: { id: string; combination: string[] }[] = [];

        for (const combinationItems of combinations) {
            const combinationId = await this.storeCombination(combinationItems);
            await this.responseService.storeResponse(combinationId);
            storedCombinations.push({ id: combinationId, combination: combinationItems });
        }

        return storedCombinations;
    }

    async generateAndStoreItemsAndCombinations(items: number[], length: number): Promise<{ id: string; combination: string[] }[]> {
        const prefixedItems = items.map((item, index) => `${String.fromCharCode(65 + index)}${item}`);
        
        await itemService.storeItems(prefixedItems);

        const combinations = this.generateCombinations(items, length);

        return this.storeAllCombinations(combinations);
    }


    async getAllCombinations(): Promise<CombinationInterface[]> {
        return this.db.select<CombinationInterface[]>('combinations', ['id', 'combination']);
    }
}
