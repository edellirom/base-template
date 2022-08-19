import { Request, Response, NextFunction, Router } from 'express';
import { IMiddleware } from '../middlewares/middleware.interface';

export interface IRouteController {
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'put' | 'delete'>;
	path: string;
	handler: (request: Request, response: Response, next: NextFunction) => void;
	middlewares?: IMiddleware[];
}
export type ExpressResponseType = Response<any, Record<string, any>>;
