import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { IUsersRepository } from './interfaces';
import { TYPES } from '../../types';
import { User } from './user.entity';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prisma: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prisma.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prisma.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
