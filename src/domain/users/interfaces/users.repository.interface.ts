import { UserModel } from '@prisma/client';
import { IUser } from './user.interface';

export interface IUsersRepository {
	create(user: IUser): Promise<UserModel>;

	find(email: string): Promise<UserModel | null>;
}
