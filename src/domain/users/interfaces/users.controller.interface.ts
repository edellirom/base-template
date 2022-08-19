import { Request, Response, NextFunction } from 'express';

export interface IUserController {
	login(request: Request, response: Response, next: NextFunction): void;
	register(request: Request, response: Response, next: NextFunction): void;
	info(request: Request, response: Response, next: NextFunction): void;
}
