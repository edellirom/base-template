import { hash, compare } from 'bcryptjs';
import { IUser } from './interfaces';

export class User implements IUser {
	private _password: string;

	constructor(private readonly _email: string, private readonly _name: string) {}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}

	public static async comparePassword(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}
