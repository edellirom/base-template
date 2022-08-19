import { Request, Response, NextFunction } from 'express';

export interface IPageController {
	index(request: Request, response: Response, next: NextFunction): Promise<void>;
}
