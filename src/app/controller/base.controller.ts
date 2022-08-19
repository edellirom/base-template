import { Router, Response } from 'express';
import { ExpressResponseType, IRouteController } from './route.controller.interface';
import { ILogger } from '../logger';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(response: Response, code: number, message: T): ExpressResponseType {
		response.type('application/json');
		return response.status(code).json(message);
	}

	public ok<T>(response: Response, message: T): ExpressResponseType {
		return this.send(response, 200, message);
	}

	protected bindRoutes(routes: IRouteController[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.handler.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
