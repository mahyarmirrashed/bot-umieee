import { GuildMember } from 'discord.js';
import Bot from '../../client/Client';
import generateValidationToken from '../../helpers/membership/GenerateValidationToken';
import modifyRole from '../../helpers/membership/ModifyRole';
import RunFunction from '../../interfaces/RunFunctionStorage';
import MembershipModel from '../../models/MembershipModel';
import Membership from '../../types/MembershipType';

export const run: RunFunction = async (client: Bot): Promise<void> => {
	// generate validation token
	const token: string | void = await generateValidationToken(client);
	// upon valid token, update all member roles
	if (token) {
		((await MembershipModel.find({}).exec()) as Membership[]).forEach(
			async (membership: Membership) => {
				if (client.guild) {
					modifyRole(
						client,
						token,
						(await client.guild.members.fetch(
							membership.discordID,
						)) as GuildMember,
						client.guild.roles,
						membership.ieeeID,
					);
				}
			},
		);
	}
};

export const name = 'validate';
