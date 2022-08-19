import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger';
import { TYPES } from '../../types';
import { IExceptionHanlder } from './exception.handler.interface';
import { HTTPErrors } from './http.errors';

@injectable()
export class ExceptionHanlder implements IExceptionHanlder {
	constructor(@inject(TYPES.Logger) private logger: ILogger) {}
	catch(
		error: Error | HTTPErrors,
		request: Request,
		response: Response,
		next: NextFunction,
	): Response | void {
		if (error instanceof HTTPErrors) {
			this.logger.error(`[${error.context}] ERROR ${error.statusCode}: ${error.message}`);
			return response.status(error.statusCode).send({ error: error.message });
		}
		this.logger.error(`${error.message}`);
		response.status(500).send({ error: error.message });
	}
}
