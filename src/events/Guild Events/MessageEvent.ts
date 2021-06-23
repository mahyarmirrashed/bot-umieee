import RunFunction from '../../interfaces/RunFunctionStorage';
import { Message } from 'discord.js';
import Bot from '../../client/Client';
import Command from '../../interfaces/CommandStorage';

export const run: RunFunction = async (client: Bot, message: Message) => {
	if (
		!message.author.bot &&
		message.guild &&
		message.content.toLowerCase().startsWith(client.prefix)
	) {
		// extract command and optional arguments from message
		const [cmd, ...args] = message.content
			.trim()
			.substring(client.prefix.length)
			.split(/\s+/);

		// search client for command and run if found
		const command: Command = client.commands.get(cmd);
		if (command) {
			if (
				args.length >= command.minimumArguments &&
				args.length <= command.maximumArguments
			) {
				if (message.member.hasPermission(command.permissions)) {
					command
						.run(client, message, args)
						.catch((e: any) =>
							client.sendReplyEmbed(message, {
								description: `An error occurred: ${e}`,
							})
						)
						.catch((e: any) => client.logger.error(e));
				} else {
					client.sendReplyEmbed(
						message,
						{
							description: 'Unauthorized command!',
						},
						'DARK_RED'
					);
				}
			} else {
				client.sendReplyEmbed(message, { description: command.usage(client) });
			}
		}
	}
};

export const name: string = 'message';