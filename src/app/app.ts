import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger';
import { IExceptionHanlder } from './errors';
import { IConfigService } from './config';
import { AuthMiddleware } from './middlewares';
import { TYPES } from '../types';
import { ApiRouteType } from './types';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.ConfigService) private config: IConfigService,
		@inject(TYPES.ExceptionHanlder) private exceptionHandler: IExceptionHanlder,
		@inject(TYPES.PrismaService) private prisma: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(express.json());
		const authMiddleware = new AuthMiddleware(this.config.get('JWT_KEY'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(routes: ApiRouteType[]): void {
		routes.forEach(({ path, route }) => {
			this.app.use(path, route);
		});
	}

	useExceptionHanlder(): void {
		this.app.use(this.exceptionHandler.catch.bind(this.exceptionHandler));
	}

	public async init(routes: ApiRouteType[]): Promise<void> {
		this.useMiddleware();
		this.useRoutes(routes);
		this.useExceptionHanlder();
		await this.prisma.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server running on http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
