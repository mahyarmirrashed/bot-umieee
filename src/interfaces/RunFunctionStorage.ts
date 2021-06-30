import Bot from '../client/Client';

export default interface RunFunction {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(client: Bot, ...args: any[]): Promise<void>;
}
