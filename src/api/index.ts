import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ApiRouteType } from '../app';
import { UserController } from '../domain/users/users.controller';
import { PageController } from '../domain/page/page.controller';

export interface IApiRoutes {
	initRoutes(): void;
	getRoutes(): ApiRouteType[];
}

@injectable()
export class ApiRoutes implements IApiRoutes {
	private routes: ApiRouteType[] = [];

	constructor(
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.PageController) private pageController: PageController,
	) {
		this.initRoutes();
	}

	initRoutes(): void {
		this.routes = [
			{ path: '/users', route: this.userController.router },
			{ path: '/', route: this.pageController.router },
		];
	}

	getRoutes(): ApiRouteType[] {
		return this.routes;
	}
}
