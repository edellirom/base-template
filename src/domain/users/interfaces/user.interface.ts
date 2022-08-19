export interface IUser {
	get email(): string;

	get name(): string;

	get password(): string;

	setPassword(password: string, salt: number): Promise<void>;
}
