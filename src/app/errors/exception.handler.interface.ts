import { Request, Response, NextFunction } from 'express';

export interface IExceptionHanlder {
	catch: (error: Error, request: Request, response: Response, next: NextFunction) => void;
}
