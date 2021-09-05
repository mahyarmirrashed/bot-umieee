import { Guild, GuildMember } from 'discord.js';
import Bot from '../../client/Client';
import findOrCreateInactiveRole from '../../helpers/guild/FindOrCreateInactiveRole';
import generateToken from '../../helpers/membership/GenerateToken';
import modifyMember from '../../helpers/membership/ModifyMember';
import remindOrKickInactiveMember from '../../helpers/membership/RemindOrKickInactiveUser';
import removeInactiveUser from '../../helpers/membership/RemoveInactiveUser';
import validateMember from '../../helpers/membership/ValidateMember';
import Handler from '../../interfaces/HandlerStorage';
import MembershipModel from '../../models/MembershipModel';
import Membership from '../../types/MembershipType';

// cron job metadata
export const cronJobFrequency = '0 0 * * *';

export const handler: Handler<unknown> = async (client: Bot): Promise<void> => {
  generateToken()
    .then(async (token: string) => {
      ((await MembershipModel.find({}).exec()) as Membership[]).forEach(
        async (membership: Membership) => {
          const guild = await client.guilds.fetch(membership.guildID);
          // type guard for possibly null guild
          if (guild) {
            const member = await guild.members.fetch(membership.userID);
            // type guard for possibly null member
            if (member) {
              const valid = await validateMember(token, membership.ieeeID);
              // perform member role modification
              modifyMember(guild, member, valid);
            }
          }
        },
      );
    })
    .then(() => {
      client.guilds.cache.forEach(async (guild: Guild) => {
        const inactiveRole = await findOrCreateInactiveRole(guild);
        guild.members.cache.forEach((member: GuildMember) => {
          if (member.roles.cache.has(inactiveRole.id)) {
            remindOrKickInactiveMember(client, guild, member);
          } else {
            // potentially remove user from inactive user database
            removeInactiveUser(client, guild, member);
          }
        });
      });
    });
};

export const name = 'validate';
