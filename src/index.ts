import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import {
	App,
	ConfigService,
	IConfigService,
	LoggerService,
	ILogger,
	ExceptionHanlder,
	IExceptionHanlder,
} from './app';
import { PrismaService } from './database/prisma.service';
import { IUserController, IUserService, IUsersRepository } from './domain/users/interfaces';
import { UserController } from './domain/users/users.controller';
import { UserService } from './domain/users/users.service';
import { UsersRepository } from './domain/users/users.repository';
import { ApiRoutes, IApiRoutes } from './api';
import { IPageController } from './domain/page/interfaces/page.controller.interface';
import { PageController } from './domain/page/page.controller';

export interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IExceptionHanlder>(TYPES.ExceptionHanlder).to(ExceptionHanlder).inSingletonScope();
	bind<IPageController>(TYPES.PageController).to(PageController);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UserRepository).to(UsersRepository);
	bind<IApiRoutes>(TYPES.ApiRoutes).to(ApiRoutes);
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const routes = appContainer.get<IApiRoutes>(TYPES.ApiRoutes).getRoutes();
	const app = appContainer.get<App>(TYPES.Application);
	await app.init(routes);
	return { app, appContainer };
}

export const boot = bootstrap();
