import { bold } from '@discordjs/builders';
import { Guild, GuildMember } from 'discord.js';
import Bot from '../../client/Client';
import InactiveModel from '../../models/InactiveUserModel';
import InactiveUser from '../../types/InactiveUserType';
import dateDayDelta from '../DateDayDelta';
import addInactiveUser from './AddInactiveUser';
import removeInactiveUser from './RemoveInactiveUser';

// only inactive for three weeks
const MAXIMUM_DAYS_INACTIVE = 21;

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
          // remove kicked user from database
          removeInactiveUser(client, guild, member);
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
        addInactiveUser(client, guild, member);
        // report addition to database
        member.send(`${bold('Warning!')} Your UMIEEE membership has expired.`);
      }
    });
};

export default remindOrKickInactiveUser;
