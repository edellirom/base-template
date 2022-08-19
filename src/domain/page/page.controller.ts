import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger, BaseController } from '../../app';
import { IPageController } from './interfaces/page.controller.interface';

@injectable()
export class PageController extends BaseController implements IPageController {
	constructor(@inject(TYPES.Logger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'get',
				path: '/',
				handler: this.index,
			},
		]);
	}

	async index(request: Request, response: Response, next: NextFunction): Promise<void> {
		this.ok(response, { page: 'home' });
	}
}
