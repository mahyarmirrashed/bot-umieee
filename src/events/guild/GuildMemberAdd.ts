import { GuildMember, Role } from 'discord.js';
import Bot from '../../client/Client';
import RunFunction from '../../interfaces/RunFunctionStorage';

export const run: RunFunction = async (
	client: Bot,
	guildMember: GuildMember
): Promise<void> => {
	client.logger.info(`${guildMember.id} joined the channel!`);
	// assign guild member inactive role upon re-entry
	if (client.guild) {
		guildMember.roles
			.add(
				client.guild.roles.cache.find(
					(role: Role) => role.name.toLowerCase() === 'inactive'
				) as Role
			)
			.catch((e: unknown) => client.logger.error(e));
	}
};

export const name = 'guildMemberAdd';
