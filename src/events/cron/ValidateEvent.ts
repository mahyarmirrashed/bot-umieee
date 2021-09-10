import Bot from '../../client/Client';
import generateToken from '../../helpers/membership/GenerateToken';
import modifyMember from '../../helpers/membership/ModifyMember';
import validateMember from '../../helpers/membership/ValidateMember';
import Handler from '../../interfaces/HandlerStorage';
import MembershipModel from '../../models/MembershipModel';
import Membership from '../../types/MembershipType';

// cron job metadata
export const cronJobFrequency = '0 0 * * *';

export const handler: Handler<unknown> = async (client: Bot): Promise<void> => {
  // load all guilds
  await client.guilds.fetch();

  // generate token
  generateToken().then(async (token: string) => {
    // get all memberships
    MembershipModel.find({})
      .exec()
      .then(async (memberships: Membership[]) => {
        memberships.forEach(async (membership: Membership) => {
          // grab guild corresponding to membership
          const guild = client.guilds.cache.get(membership.guildID);
          // type guard for null
          if (guild) {
            // grab member corresponding to membership
            const member = (await guild.members.fetch()).get(membership.userID);
            // type guard for null
            if (member) {
              // validate member and modify their role accordingly
              validateMember(token, membership.ieeeID).then((valid: boolean) =>
                modifyMember(guild, member, valid),
              );
            }
          }
        });
      })
      .catch();
  });
};

export const name = 'validate';
