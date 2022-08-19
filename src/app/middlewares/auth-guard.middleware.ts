import { Request, Response, NextFunction } from 'express';
import { HTTPErrors } from '../errors';
import { IMiddleware } from './middleware.interface';

export class AuthGuardMiddleware implements IMiddleware {
	execute(request: Request, response: Response, next: NextFunction): void {
		if (request.user) {
			return next();
		}
		next(new HTTPErrors(401, 'NOT Authorized'));
	}
}
