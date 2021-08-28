import { inlineCode, userMention } from '@discordjs/builders';
import { magenta } from 'chalk';
import { CommandInteraction } from 'discord.js';
import { Document, CallbackError } from 'mongoose';
import moment from 'moment';
import NominationModel from '../../models/NominationModel';
import { Nomination } from '../../types/NominationType';
import Bot from '../../client/Client';

const MAXIMUM_NOMINATIONS = 20;

const addNomination = (
  client: Bot,
  interaction: CommandInteraction,
  nominator: string,
  nominee: string,
  reason: string,
): void => {
  // stringified date for previous Monday
  const week = moment().day(1).toISOString(true).split('T')[0];

  // check for existing entries for current week
  NominationModel.findOne({
    week,
    $or: [
      {
        nominations: {
          $elemMatch: {
            nominator,
            nominee,
            reason,
          },
        },
      },
      {
        nominations: {
          $size: MAXIMUM_NOMINATIONS,
        },
      },
    ],
  })
    .exec()
    .then(
      (res: (Document<unknown, unknown, Nomination> & Nomination) | null) => {
        if (res) {
          if (res.nominations.length === MAXIMUM_NOMINATIONS) {
            interaction.reply({
              content: 'Maximum number of weekly nominations reached.',
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content: 'You voted for this chump for this reason already!',
              ephemeral: true,
            });
          }
        } else {
          // attempt to upsert nomination into database
          NominationModel.updateOne(
            {
              week,
            },
            {
              $push: {
                nominations: {
                  nominator,
                  nominee,
                  reason,
                },
              },
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
                  content: 'Error occurred when upserting nomination.',
                  ephemeral: true,
                });
              } else {
                // report successful upsertion
                interaction.reply(
                  `${userMention(nominator)} nominated ${userMention(
                    nominee,
                  )} as this week's chump.\nReason: ${inlineCode(reason)}.`,
                );
                // log database upsertion
                client.logger.success('Successfully upserted new nomination:');
                client.logger.info(`nominator: ${magenta(nominator)}`);
                client.logger.info(`nominee: ${magenta(nominee)}`);
                client.logger.info(`reason: "${magenta(reason)}"`);
              }
            },
          );
        }
      },
    );
};

export default addNomination;
