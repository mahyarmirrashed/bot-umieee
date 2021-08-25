import validateMembership from './ValidateMembership';
import { GuildMember, Role, RoleManager } from 'discord.js';
import Bot from '../../client/Client';

const modifyRole = async (
	client: Bot,
	token: string,
	member: GuildMember,
	roles: RoleManager,
	ieeeID: string,
): Promise<void> => {
	const active: Role = roles.cache.find(
		(role: Role) => role.name.toLowerCase() === 'active',
	) as Role;
	const inactive: Role = roles.cache.find(
		(role: Role) => role.name.toLowerCase() === 'inactive',
	) as Role;

	if (await validateMembership(client, token, ieeeID)) {
		member.roles
			.add(active)
			.then((member: GuildMember) => member.roles.remove(inactive))
			.catch((e: unknown) => client.logger.error(e));
	} else {
		member.roles
			.add(inactive)
			.then((member: GuildMember) => member.roles.remove(active))
			.catch((e: unknown) => client.logger.error(e));
	}
};

export default modifyRole;
