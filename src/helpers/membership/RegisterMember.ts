import { userMention } from '@discordjs/builders';
import { magenta } from 'chalk';
import { CommandInteraction, Snowflake } from 'discord.js';
import { CallbackError, Document } from 'mongoose';
import Bot from '../../client/Client';
import MembershipModel from '../../models/MembershipModel';
import Membership from '../../types/MembershipType';

const registerMember = async (
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
    .then(
      (res: (Document<unknown, unknown, Membership> & Membership) | null) => {
        if (res) {
          // user in database already assigned particular IEEE membership number
          interaction.reply({
            content: `${userMention(
              res.userID,
            )} is already assigned ${ieeeID} inside this guild!`,
            ephemeral: true,
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
                interaction.reply({
                  content: 'Error occurred when upserting member.',
                  ephemeral: true,
                });
              } else {
                // report successful upsertion
                interaction.reply(
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
      },
    );
};

export default registerMember;
