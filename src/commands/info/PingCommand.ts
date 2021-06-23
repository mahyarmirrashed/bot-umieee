import { Message, Permissions } from 'discord.js';
import Bot from '../../client/Client';
import RunFunction from '../../interfaces/RunFunctionStorage';
import UsageFunction from '../../interfaces/UsageFunctionStorage';

export const run: RunFunction = async (
	client: Bot,
	message: Message
): Promise<void> => {
	message.channel.send('Pong!').then((pong: Message) => {
		client.sendReplyEmbed(
			message,
			{
				description: `Ping diagnostics: Web socket: \`${
					client.ws.ping
				}ms\`. Response time: \`${
					pong.createdTimestamp - message.createdTimestamp
				}ms\`.`,
			},
			'GREEN'
		);
		pong.delete();
		message.delete();
	});
};

export const usage: UsageFunction = (client: Bot): string => {
	return `**Usage:** \`${client.prefix}ping\``;
};

export const maximumArguments: number = 0;
export const minimumArguments: number = 0;
export const name: string = 'ping';
export const permissions: Permissions[] = [];
