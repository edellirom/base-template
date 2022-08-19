import { App } from '../src/app';
import { boot } from '../src/index';
import request from 'supertest';

const existingUserDetails = {
	name: 'First User',
	email: 'first-user@mail.com',
	password: 'FirstUserP@ssword',
};

const missingUserDetails = {
	name: 'Second User',
	email: 'second-user@mail.com',
	password: 'SecondUserP@ssword',
};

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

afterAll(() => {
	application.close();
});

describe('Users e2e', () => {
	describe('POST /users/register endpoint', () => {
		test('should return 422 when user already exist', async () => {
			await request(application.app).post('/users/register').send(existingUserDetails);
			const result = await request(application.app)
				.post('/users/register')
				.send(existingUserDetails);
			expect(result.statusCode).toBe(422);
		});
	});

	describe('POST /users/login endpoint', () => {
		test('should return defined jwt token', async () => {
			const { name, ...userDetails } = existingUserDetails;
			const result = await request(application.app).post('/users/login').send(userDetails);
			expect(result.body.token).not.toBeUndefined();
		});
	});

	describe('POST /users/info endpoint', () => {
		test('should return 404 if user does not exist', async () => {
			const result = await request(application.app).post('/users/info').send(missingUserDetails);
			expect(result.statusCode).toBe(404);
		});
	});
});
