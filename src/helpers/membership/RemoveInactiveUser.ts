import { CallbackError } from 'mongoose';
import { Guild, GuildMember } from 'discord.js';
import InactiveUserModel from '../../models/InactiveUserModel';
import Bot from '../../client/Client';

const removeInactiveUser = (
  client: Bot,
  guild: Guild,
  member: GuildMember,
): void => {
  InactiveUserModel.findOneAndDelete(
    {
      guildID: guild.id,
      userID: member.id,
    },
    {},
    (e: CallbackError) => {
      if (e) {
        // error occurred during deletion
        client.logger.error(e);
      }
    },
  );
};

export default removeInactiveUser;
