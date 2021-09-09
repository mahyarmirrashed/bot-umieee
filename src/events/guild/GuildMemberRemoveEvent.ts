import { Constants, GuildMember } from 'discord.js';
import Bot from '../../client/Client';
import removeInactiveUserStatus from '../../helpers/membership/RemoveInactiveUserStatus';
import Handler from '../../interfaces/HandlerStorage';

export const handler: Handler<GuildMember> = async (
  client: Bot,
  member: GuildMember,
): Promise<void> => {
  // potentially remove from inactive users database
  removeInactiveUserStatus(client, member.guild, member);
};

export const name = Constants.Events.GUILD_MEMBER_REMOVE;
