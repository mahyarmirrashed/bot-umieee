import { GuildMember, Constants } from 'discord.js';
import Bot from '../../client/Client';
import findOrCreateInactiveRole from '../../helpers/guild/FindOrCreateActiveRole';
import Handler from '../../interfaces/HandlerStorage';

export const handler: Handler<GuildMember> = async (
  client: Bot,
  guildMember: GuildMember,
): Promise<void> => {
  if (!guildMember.user.bot) {
    guildMember.roles
      .add(await findOrCreateInactiveRole(guildMember.guild))
      .catch(client.logger.error);
  }
};

export const name = Constants.Events.GUILD_MEMBER_ADD;
