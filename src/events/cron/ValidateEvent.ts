import Bot from '../../client/Client';
import generateToken from '../../helpers/membership/GenerateToken';
import modifyMember from '../../helpers/membership/ModifyMember';
import validateMember from '../../helpers/membership/ValidateMember';
import Handler from '../../interfaces/HandlerStorage';
import MembershipModel from '../../models/MembershipModel';
import Membership from '../../types/MembershipType';

// cron job metadata
export const cronJobFrequency = '0 0 * * *';

export const handler: Handler<never> = async (client: Bot): Promise<void> => {
  generateToken().then(async (token: string) => {
    ((await MembershipModel.find({}).exec()) as Membership[]).forEach(
      async (membership: Membership) => {
        const guild = await client.guilds.fetch(membership.guildID);
        // type guard for possibly null guild
        if (guild) {
          const member = await guild.members.fetch(membership.userID);
          // type guard for possibly null member
          if (member) {
            // finally, perform member role modification
            modifyMember(
              guild,
              member,
              await validateMember(token, membership.ieeeID),
            );
          }
        }
      },
    );
  });
};

export const name = 'validate';
