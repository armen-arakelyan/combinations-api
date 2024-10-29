import express from 'express';
import { CombinationController } from './combination.controller';

const combinationRouter = express.Router();
const combinationController = new CombinationController();

combinationRouter.post('/generate', (req, res) => combinationController.generateAndStoreCombinations(req, res));
combinationRouter.get('/combinations', (req, res) => combinationController.getAllCombinations(req, res));

export {
    combinationRouter
};
