import {
	Message,
	PermissionResolvable,
	Permissions,
	TextChannel,
} from 'discord.js';
import Bot from '../../client/Client';
import RunFunction from '../../interfaces/RunFunctionStorage';
import UsageFunction from '../../interfaces/UsageFunctionStorage';

const DEFAULT_AMOUNT: number = 99;
const DIGIT_PATTERN: RegExp = RegExp('^\\d+$', 'g');

export const run: RunFunction = async (
	client: Bot,
	message: Message,
	args: string[]
): Promise<void> => {
	let amount: number = DEFAULT_AMOUNT;
	let [limit] = args;

	// parse limit, if provided
	if (args.length == 1 && !DIGIT_PATTERN.test(limit)) {
		client.sendReplyEmbed(message, {
			description: ['**Error:** Invalid integer format.', usage(client)].join(
				'\n'
			),
		});
	} else {
		if (args.length == 1) {
			// maximum message to delete is DEFAULT_AMOUNT
			amount = Math.min(DEFAULT_AMOUNT, parseInt(limit, 10));
		}

		// delete command invocation
		message.delete().then((message: Message) => {
			client.sendReplyEmbed(message, {
				description: `Deleting last ${amount} message${
					amount > 1 ? 's' : ''
				}...`,
			});
			// allow user to see bot reply
			setTimeout(() => {
				if (message.channel instanceof TextChannel) {
					return message.channel.bulkDelete(amount + 1);
				}
			}, 1000);
		});
	}
};

export const usage: UsageFunction = (client: Bot): string => {
	return `**Usage:** \`${client.prefix}clear (amount)\``;
};

export const maximumArguments: number = 1;
export const minimumArguments: number = 0;
export const name: string = 'clear';
export const permissions: PermissionResolvable[] = [
	Permissions.FLAGS.MANAGE_MESSAGES,
];
