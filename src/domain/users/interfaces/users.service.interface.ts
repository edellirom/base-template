import { UserModel } from '@prisma/client';
import { UserLoginDto, UserRegisterDto } from '../dto';

export interface IUserService {
	createUser(dto: UserRegisterDto): Promise<UserModel | null>;

	loginUser(dto: UserLoginDto): Promise<boolean>;

	getUserInfo(email: string): Promise<UserModel | null>;
}
