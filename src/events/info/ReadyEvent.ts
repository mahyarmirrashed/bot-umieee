import Bot from '../../client/Client';
import RunFunction from '../../interfaces/RunFunctionStorage';

export const run: RunFunction = async (client: Bot): Promise<void> => {
	if (client.user) {
		client.logger.success(`${client.user.username} successfully logged in!`);
        // register guild onto client
        client.guild = client.guilds.cache.get(process.env.GUILD as string);
	} else {
		client.logger.error(
			'`user` property on `client` was `null` for some reason...'
		);
	}
};

export const name: string = 'ready';
