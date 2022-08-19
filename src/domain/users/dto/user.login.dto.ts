import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Email not valid' })
	@IsString({ message: "Email field can't empty" })
	email: string;

	@IsString({ message: "Passward field can't empty" })
	password: string;
}
