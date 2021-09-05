import { CallbackError } from 'mongoose';
import { Guild, GuildMember } from 'discord.js';
import InactiveUserModel from '../../models/InactiveUserModel';
import Bot from '../../client/Client';

const addInactiveUser = (
  client: Bot,
  guild: Guild,
  member: GuildMember,
): void => {
  InactiveUserModel.create(
    {
      guildID: guild.id,
      userID: member.id,
      since: Date.now(),
    },
    (e: CallbackError) => {
      if (e) {
        // error occurred during creation
        client.logger.error(e);
      }
    },
  );
};

export default addInactiveUser;
