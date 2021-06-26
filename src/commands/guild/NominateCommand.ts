import {
	Message,
	TextChannel,
	PermissionResolvable,
	GuildMember,
} from 'discord.js';
import Bot from '../../client/Client';
import addNomination from '../../helpers/cotw/AddNomination';
import RunFunction from '../../interfaces/RunFunctionStorage';

const DIGIT_PATTERN: RegExp = RegExp('\\d+', 'g');
const MAXIMUM_REASON_LENGTH: number = 50;

export const run: RunFunction = async (
	client: Bot,
	message: Message,
	args: string[]
): Promise<void> => {
	if (
		message.channel instanceof TextChannel &&
		message.channel.name === 'cotw'
	) {
		const [discordID, ...reasonArr] = args;
		const memberID: RegExpMatchArray | null = discordID.match(DIGIT_PATTERN);

		if (memberID) {
			if (message.guild) {
				const member: GuildMember = message.guild.member(
					memberID[0]
				) as GuildMember;
				const reason: string = reasonArr.join(' ');

				if (member) {
					if (reason.length < MAXIMUM_REASON_LENGTH) {
						// remove command invocation message
						message
							.delete()
							.then((message: Message) => {
								// add nomination and send relevant feedback messages
								addNomination(
									client,
									message,
									message.author.id,
									member.id,
									reason
								);
							})
							.catch((e: any) => client.logger.error(e));
					} else {
						client.sendReplyEmbed(message, {
							description: `**Error:** Maximum reason length is ${MAXIMUM_REASON_LENGTH} characters.`,
						});
					}
				} else {
					client.sendReplyEmbed(message, {
						description: [
							`**Error:** Could not find member with DiscordID, ${discordID}, on server.`,
							usage,
						].join('\n'),
					});
				}
			} else {
				client.sendReplyEmbed(message, {
					description:
						'**Error:** `message.guild` was `null` for some reason...',
				});
			}
		} else {
			client.sendReplyEmbed(message, {
				description: [
					'**Error:** Did not find member ID in command.',
					usage,
				].join('\n'),
			});
		}
	} else {
		client.sendReplyEmbed(message, {
			description: `Call this command inside the \`cotw\` channel!`,
		});
	}
};

export const usage: string = `**Usage:** \`${
	process.env.PREFIX as string
}nominate <@user> [reason]\``;

export const maximumArguments: number = Number.POSITIVE_INFINITY;
export const minimumArguments: number = 2;
export const name: string = 'nominate';
export const permissions: PermissionResolvable[] = [];