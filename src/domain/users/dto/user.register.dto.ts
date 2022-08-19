import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsString({ message: 'Empty field' })
	name: string;

	@IsEmail({}, { message: 'Email incorect' })
	email: string;

	@IsString({ message: 'Empty field' })
	password: string;
}
