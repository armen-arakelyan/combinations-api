import { Request, Response } from 'express';
import { CombinationService } from './combination.service';
import { HTTP_STATUS } from '../../constants';
import { sendJSONResponse } from '../../utils';
import { GenerateAndStoreCombinationsInterface } from './types';
 
export class CombinationController {
    private combinationService: CombinationService;

    constructor() {
        this.combinationService = new CombinationService();
    }

    async generateAndStoreCombinations(req: Request, res: Response): Promise<void> {
        try {
            const { items, length } = req.body as GenerateAndStoreCombinationsInterface;

            if (!Array.isArray(items) || typeof length !== 'number') {
                sendJSONResponse(res, HTTP_STATUS.BAD_REQUEST, { error: 'Invalid input data' })
                return;
            }

            const combinations = this.combinationService.generateCombinations(items, length);

            const storedCombinations = await this.combinationService.storeAllCombinations(combinations);

            sendJSONResponse(res, HTTP_STATUS.OK, storedCombinations)
        } catch (error) {
            console.log(2333, error);
            sendJSONResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: 'Failed to generate and store combinations' })
        }
    }

    async getAllCombinations(req: Request, res: Response): Promise<void> {
        try {
            const combinations = await this.combinationService.getAllCombinations();
            sendJSONResponse(res, HTTP_STATUS.OK, combinations);
        } catch (error) {
            sendJSONResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: 'Failed to retrieve combinations' });
        }
    }
}
