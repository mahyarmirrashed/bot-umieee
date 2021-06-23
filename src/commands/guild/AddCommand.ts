import {
	GuildMember,
	Message,
	TextChannel,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import Bot from '../../client/Client';
import addMembership from '../../helpers/AddMembershipHelper';
import modifyRole from '../../helpers/ModifyRoleHelper';
import RunFunction from '../../interfaces/RunFunctionStorage';
import UsageFunction from '../../interfaces/UsageFunctionStorage';

const IEEE_NUMBER_LENGTH: number = 9;
const DIGIT_PATTERN: RegExp = RegExp('\\d+', 'g');

export const run: RunFunction = async (
	client: Bot,
	message: Message,
	args: string[]
): Promise<void> => {
	if (
		message.channel instanceof TextChannel &&
		message.channel.name === 'bots'
	) {
		const [discordID, ieeeID] = args;

		if (discordID.match(DIGIT_PATTERN)) {
			const member: GuildMember = message.guild.member(
				discordID.match(DIGIT_PATTERN)[0]
			);

			if (member) {
				if (ieeeID.length == IEEE_NUMBER_LENGTH && DIGIT_PATTERN.test(ieeeID)) {
					// add member to database for validation
					addMembership(client, message, member.user.id, ieeeID);
					// update user role
					modifyRole(client, member, message.guild.roles, ieeeID);
				} else {
					client.sendReplyEmbed(message, {
						description: [
							'**Error:** Invalid IEEE membership number format.',
							usage(client),
						].join('\n'),
					});
				}
			} else {
				client.sendReplyEmbed(message, {
					description: [
						`**Error:** Could not find member IE, ${discordID}, on server.`,
						usage(client),
					].join('\n'),
				});
			}
		} else {
			client.sendReplyEmbed(message, {
				description: [
					'**Error:** Did not find member ID in command.',
					usage(client),
				].join('\n'),
			});
		}
	} else {
		client.sendReplyEmbed(message, {
			description: `Call this command inside the \`bots\` channel!`,
		});
	}
};

export const usage: UsageFunction = (client: Bot) => {
	return `**Usage:** \`${client.prefix}add <@user> [ieeeID]\``;
};

export const maximumArguments: number = 2;
export const minimumArguments: number = 2;
export const name: string = 'add';
export const permissions: PermissionResolvable[] = [
	Permissions.FLAGS.MANAGE_GUILD,
];
