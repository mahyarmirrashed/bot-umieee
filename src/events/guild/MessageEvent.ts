import RunFunction from '../../interfaces/RunFunctionStorage';
import { Message, TextChannel } from 'discord.js';
import Bot from '../../client/Client';
import Command from '../../interfaces/CommandStorage';

export const run: RunFunction = async (
	client: Bot,
	message: Message,
): Promise<void> => {
	if (
		!message.author.bot &&
		message.guild &&
		message.content.toLowerCase().startsWith(process.env.PREFIX as string)
	) {
		// extract command and optional arguments from message
		const [cmd, ...args] = message.content
			.trim()
			.substring((process.env.PREFIX as string).length)
			.split(/\s+/);

		// search client for command and run if found
		const command: Command = client.commands.get(cmd) as Command;
		if (command && message.channel instanceof TextChannel) {
			const name = message.channel.name;
			if (
				command.listBlack.every(
					(deniedChannel: string) => deniedChannel !== name,
				)
			) {
				if (
					command.listWhite.length == 0 ||
					command.listWhite.some(
						(permittedChannel: string) => permittedChannel === name,
					)
				) {
					if (
						args.length >= command.minimumArguments &&
						args.length <= command.maximumArguments
					) {
						if (message.member) {
							if (message.member.hasPermission(command.permissions)) {
								command
									.run(client, message, args)
									.catch((e: unknown) =>
										client.sendReplyEmbed(message, {
											description: `An error occurred: ${e}`,
										}),
									)
									.catch((e: unknown) => client.logger.error(e));
							} else {
								client.sendReplyEmbed(
									message,
									{
										description: 'Unauthorized command!',
									},
									'DARK_RED',
								);
							}
						} else {
							client.sendReplyEmbed(message, {
								description:
									'**Error:** `message.member` was `null` for some reason...',
							});
						}
					} else {
						client.sendReplyEmbed(message, { description: command.usage });
					}
				} else {
					client.sendReplyEmbed(message, {
						description: `This command can only be called inside ${command.listWhite
							.map((permittedChannel: string) => `\`${permittedChannel}\``)
							.join(', ')}!`,
					});
				}
			} else {
				client.sendReplyEmbed(message, {
					description: `Calling this command inside ${command.listBlack
						.map((deniedChannel: string) => `\`${deniedChannel}\``)
						.join(', ')} is not permitted!`,
				});
			}
		}
	}
};

export const name = 'message';
