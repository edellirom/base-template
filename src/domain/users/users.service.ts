import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../../app';
import { TYPES } from '../../types';
import { UserRegisterDto, UserLoginDto } from './dto';
import { User } from './user.entity';
import { IUserService, IUsersRepository } from './interfaces';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ConfigService) private config: IConfigService,
	) {}

	async loginUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		return User.comparePassword(password, existedUser.password);
	}

	async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		const user = new User(email, name);
		const salt = this.config.get('PASSWORT_HASH_SALT');
		await user.setPassword(password, Number(salt));
		return this.usersRepository.create(user);
	}
	getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}
}
