import { bold } from '@discordjs/builders';
import { Guild, GuildMember } from 'discord.js';
import Bot from '../../client/Client';
import InactiveModel from '../../models/InactiveUserModel';
import InactiveUser from '../../types/InactiveUserType';
import dateDayDelta from '../DateDayDelta';
import addInactiveUserStatus from './AddInactiveUserStatus';

// permit inactivity for one week
const MAXIMUM_DAYS_INACTIVE = 15;

const remindOrKickInactiveUser = (
  client: Bot,
  guild: Guild,
  member: GuildMember,
): void => {
  InactiveModel.findOne({
    guildID: guild.id,
    userID: member.id,
  })
    .exec()
    .then((res: InactiveUser | null) => {
      if (res) {
        const daysInactive = Math.abs(dateDayDelta(new Date(), res.since));
        if (daysInactive >= MAXIMUM_DAYS_INACTIVE) {
          // kick user for membership inactivity
          member
            .kick('You were kicked being inactive for more than three weeks.')
            .catch(client.logger.error);
        } else {
          member.send(
            `${bold(
              'Warning!',
            )} You will be kicked from the UMIEEE Discord in ${
              MAXIMUM_DAYS_INACTIVE - daysInactive
            } days for being an inactive user.`,
          );
        }
      } else {
        // add inactive user to database
        addInactiveUserStatus(client, guild, member);
        // report addition to database
        member.send(`${bold('Warning!')} Your UMIEEE membership has expired.`);
      }
    });
};

export default remindOrKickInactiveUser;
