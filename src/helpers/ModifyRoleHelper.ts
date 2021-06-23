import validateMembership from './ValidateMembershipHelper';
import { GuildMember, Role, RoleManager } from 'discord.js';
import Bot from '../client/Client';

const modifyRole = async (
	client: Bot,
	member: GuildMember,
	roles: RoleManager,
	ieeeID: string
): Promise<void> => {
	const active: Role = roles.cache.find(
		(role: Role) => role.name.toLowerCase() === 'active'
	);
	const inactive: Role = roles.cache.find(
		(role: Role) => role.name.toLowerCase() === 'inactive'
	);

	if (await validateMembership(ieeeID)) {
		member.roles
			.add(active)
			.then((member: GuildMember) => member.roles.remove(inactive))
			.catch((e: any) => client.logger.error(e));
	} else {
		member.roles
			.add(inactive)
			.then((member: GuildMember) => member.roles.remove(active))
			.catch((e: any) => client.logger.error(e));
	}
};

export default modifyRole;
