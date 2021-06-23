import Bot from '../client/Client';

export default interface UsageFunction {
	(client: Bot): string;
}
