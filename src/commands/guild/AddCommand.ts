import {
	GuildMember,
	Message,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import Bot from '../../client/Client';
import addMembership from '../../helpers/membership/AddMembership';
import generateValidationToken from '../../helpers/membership/GenerateValidationToken';
import modifyRole from '../../helpers/membership/ModifyRole';
import RunFunction from '../../interfaces/RunFunctionStorage';

const IEEE_NUMBER_LENGTH = 8;
const DIGIT_PATTERN = () => new RegExp('\\d+', 'g');

export const run: RunFunction = async (
	client: Bot,
	message: Message,
	args: string[],
): Promise<void> => {
	const [discordID, ieeeID] = args;
	const memberID: RegExpMatchArray | null = discordID.match(DIGIT_PATTERN());

	if (memberID) {
		if (client.guild) {
			const member: GuildMember = (await client.guild.members.fetch(
				memberID.shift() as string,
			)) as GuildMember;

			if (member) {
				if (
					ieeeID.length == IEEE_NUMBER_LENGTH &&
					DIGIT_PATTERN().test(ieeeID)
				) {
					// add member to database for validation
					addMembership(client, message, member.user.id, ieeeID);
					// generate validation token
					const token: string | void = await generateValidationToken(client);
					// upon valid token, update user role
					if (token) {
						modifyRole(client, token, member, client.guild.roles, ieeeID);
					}
				} else {
					client.sendReplyEmbed(message, {
						description: [
							'**Error:** Invalid IEEE membership number format.',
							usage,
						].join('\n'),
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
				description: '**Error:** `message.guild` was `null` for some reason...',
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
};

export const usage = `**Usage:** \`${
	process.env.PREFIX as string
}add <@user> [ieeeID]\``;

export const listBlack = [];
export const listWhite = ['bots'];
export const maximumArguments = 2;
export const minimumArguments = 2;
export const name = 'add';
export const permissions: PermissionResolvable[] = [
	Permissions.FLAGS.MANAGE_GUILD,
];
