import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../logger';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Problem with .env config');
		} else {
			this.config = result.parsed as DotenvParseOutput;
			this.logger.log('[ConfigService] Config defined successfuly');
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
