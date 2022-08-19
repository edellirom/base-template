import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';

export interface TokenInterface {
	email: string;
	iat: number;
}

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(request: Request, response: Response, next: NextFunction): void {
		if (request.headers.authorization) {
			const token = request.headers.authorization.split(' ')[1];
			verify(token, this.secret, (error, payload) => {
				if (error) {
					return next();
				}
				if (payload) {
					request.user = (<TokenInterface>payload).email;
					return next();
				}
			});
		} else {
			next();
		}
	}
}
