import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import { IConfigService } from '../../common/config';
import { TYPES } from '../../../types';
import { IUserService, IUsersRepository } from '../interfaces';
import { UserService } from '../users.service';
import { User } from '../user.entity';

const userDetails = {
	id: 1,
	name: 'Name',
	email: 'test@email.com',
	password: 'Password',
};

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UserRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UserRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

beforeEach(() => {
	configService.get = jest.fn().mockReturnValueOnce('1');

	usersRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => userDetails);
});

describe('Users service', () => {
	describe('[createUser]', () => {
		test('should check success user creation porcess', async () => {
			const result = await usersService.createUser(userDetails);

			expect(result?.id).toEqual(userDetails.id);
			expect(result?.password).not.toEqual(userDetails.password);
		});
	});

	describe('[loginUser]', () => {
		test('should check success user login process', async () => {
			const createdUser = await usersService.createUser(userDetails);
			usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
			const result = await usersService.loginUser({
				email: userDetails.email,
				password: userDetails.password,
			});

			expect(result).toBeTruthy();
		});

		test('should check if faild user login, when we provide wrong password', async () => {
			const createdUser = await usersService.createUser(userDetails);
			usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
			const result = await usersService.loginUser({
				email: userDetails.email,
				password: 'wrongpassword',
			});

			expect(result).toBeFalsy();
		});

		test('should check if faild user login, when user does not exist', async () => {
			usersRepository.find = jest.fn().mockReturnValueOnce(null);
			const result = await usersService.loginUser(userDetails);

			expect(result).toBeFalsy();
		});
	});
});
