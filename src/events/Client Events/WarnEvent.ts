import Bot from '../../client/Client';
import RunFunction from '../../interfaces/RunFunctionStorage';

export const run: RunFunction = async (
	client: Bot,
	info: string
): Promise<void> => {
	client.logger.info(info);
};

export const name: string = 'warn';
