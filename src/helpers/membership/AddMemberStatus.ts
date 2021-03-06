import { inlineCode, userMention } from '@discordjs/builders';
import { magenta } from 'chalk';
import { CommandInteraction, Snowflake } from 'discord.js';
import { CallbackError } from 'mongoose';
import Bot from '../../client/Client';
import MembershipModel from '../../models/MembershipModel';
import Membership from '../../types/MembershipType';

const addMemberStatus = async (
  client: Bot,
  interaction: CommandInteraction,
  guildID: Snowflake,
  userID: Snowflake,
  ieeeID: number,
): Promise<void> => {
  // edge case: search for user with same IEEE membership number
  MembershipModel.findOne({
    guildID,
    userID: { $ne: userID },
    ieeeID,
  })
    .exec()
    .then((res: Membership | null) => {
      if (res) {
        // user in database already assigned particular IEEE membership number
        interaction.editReply({
          content: `${userMention(
            res.userID,
          )} is already assigned the IEEE memberhip number, ${inlineCode(
            String(ieeeID),
          )}, inside this guild!`,
        });
      } else {
        // attempt to upsert member into database
        MembershipModel.updateOne(
          {
            guildID,
            userID,
          },
          {
            guildID,
            userID,
            ieeeID,
          },
          {
            upsert: true,
          },
          (e: CallbackError) => {
            if (e) {
              // error occurred during upsertion
              client.logger.error(e);
              // report unsuccessful upsertion
              interaction.editReply({
                content: 'Error occurred when upserting member.',
              });
            } else {
              // report successful upsertion
              interaction.editReply(
                `Successfully assigned ${userMention(
                  userID,
                )} IEEE membership number ${ieeeID}.`,
              );
              // log database upsertion
              client.logger.success('Successfully upserted new member:');
              client.logger.log(`guildID: ${magenta(guildID)}`);
              client.logger.log(`userID: ${magenta(userID)}`);
              client.logger.log(`ieeeID: ${magenta(ieeeID)}`);
            }
          },
        );
      }
    });
};

export default addMemberStatus;
