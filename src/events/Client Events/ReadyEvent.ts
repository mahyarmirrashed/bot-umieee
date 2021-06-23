import Bot from '../../client/Client';
import RunFunction from '../../interfaces/RunFunctionStorage';

export const run: RunFunction = async (client: Bot) => {
	client.logger.success(`${client.user.username} successfully logged in!`);
};

export const name: string = 'ready';
