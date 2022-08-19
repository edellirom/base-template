import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import { TYPES } from '../../types';
import {
	ValidationMiddleware,
	AuthGuardMiddleware,
	IConfigService,
	HTTPErrors,
	ILogger,
} from '../../app';
import { BaseController } from '../../app/controller';
import { IUserController, IUserService } from './interfaces';
import { UserLoginDto, UserRegisterDto } from './dto';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.UserService) private user: IUserService,
		@inject(TYPES.ConfigService) private config: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'post',
				path: '/register',
				handler: this.register,
				middlewares: [new ValidationMiddleware(UserRegisterDto)],
			},
			{
				method: 'post',
				path: '/login',
				handler: this.login,
				middlewares: [new ValidationMiddleware(UserLoginDto)],
			},
			{
				method: 'get',
				path: '/info',
				handler: this.info,
				middlewares: [new AuthGuardMiddleware()],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		response: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.user.loginUser(body);
		if (!user) {
			return next(new HTTPErrors(401, 'User does not unauthorised'));
		}
		const token = await this.signJWT(body.email, this.config.get('JWT_KEY'));
		this.ok(response, { token });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		response: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.user.createUser(body);
		if (!user) {
			return next(new HTTPErrors(422, 'User exist', 'register'));
		}

		this.ok(response, { id: user.id, email: user.email });
	}
	async info(
		{ user: email }: Request<{}, {}, UserRegisterDto>,
		response: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.user.getUserInfo(email);
		this.ok(response, { id: user?.id, user: user?.email });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 100),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(error, token) => {
					if (error) {
						reject(error);
					}
					resolve(token as string);
				},
			);
		});
	}
}
