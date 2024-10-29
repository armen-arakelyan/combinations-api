import express from 'express';
import bodyParser from 'body-parser';
import { combinationRouter } from './features/combination';
import dotenv from 'dotenv';
import { initializeDatabase } from './infrastructure';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/api', combinationRouter);

const startServer = async () => {
    await initializeDatabase();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();