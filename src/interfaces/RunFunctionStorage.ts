import Bot from '../client/Client';

export default interface RunFunction {
	(client: Bot, ...args: any[]): Promise<void>;
}
