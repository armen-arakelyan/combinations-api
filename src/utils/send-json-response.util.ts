import { Response } from 'express';

const sendJSONResponse = (res: Response, status: number, content: object = {}): void => {
    res.status(status).json(content);
};

export {
    sendJSONResponse
};
