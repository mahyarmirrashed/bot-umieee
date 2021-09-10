import { bold, userMention } from '@discordjs/builders';
import { yellow } from 'chalk';
import { food } from 'discord-emoji';
import {
  Guild,
  MessageEmbed,
  MessageReaction,
  Snowflake,
  TextChannel,
} from 'discord.js';
import moment from 'moment';
import { CallbackError } from 'mongoose';
import Bot from '../../client/Client';
import ChumpModel from '../../models/ChumpModel';
import NominationModel from '../../models/NominationModel';
import { Nomination } from '../../types/NominationType';

const JAPANESE_FOOD_IDX = 70;

const closeVote = (
  client: Bot,
  guild: Guild,
  cotwChannel: TextChannel,
): void => {
  // stringified date for previous, previous, previous Monday
  const week = moment().day(-13).toISOString(true).split('T')[0];

  // check for existing entries for current week
  NominationModel.findOne({
    guildID: guild.id,
    week,
    'nominations.0': { $exists: true },
  })
    .exec()
    .then(async (res: Nomination | null) => {
      if (res) {
        // extract Japanese food emojis from emoji dataset
        const foodEmojis = [
          ...new Set(Object.values(food).slice(JAPANESE_FOOD_IDX)),
        ];

        // fetch vote message from channel
        const voteMessage = await cotwChannel.messages.fetch(res.message);

        if (voteMessage) {
          // calculate most voted reactions
          const mostReactions = Math.max(
            ...voteMessage.reactions.cache.map(
              (reaction: MessageReaction) => reaction.count,
            ),
          );

          // all unique chumps this week
          const chumps = new Set<Snowflake>(
            voteMessage.reactions.cache
              .filter(
                (reaction: MessageReaction) => reaction.count === mostReactions,
              )
              .map(
                (reaction: MessageReaction) =>
                  res.nominations[foodEmojis.indexOf(reaction.emoji.toString())]
                    .nominee as Snowflake,
              ),
          );

          // load chumps into database
          chumps.forEach((chump: Snowflake) => {
            ChumpModel.updateOne(
              {
                guildID: guild.id,
                week,
              },
              {
                $addToSet: { chumps: chump },
              },
              {
                upsert: true,
              },
              (e: CallbackError) => {
                if (e) {
                  // error occurred during upsertion
                  client.logger.error(e);
                } else {
                  // log database insertion
                  client.logger.success('Successfully added chump:');
                  client.logger.info(`guild: ${guild.id}`);
                  client.logger.info(`week: ${week}`);
                  client.logger.info(`chump: ${chump}`);
                }
              },
            );
          });

          // report chump results
          cotwChannel.send({
            embeds: [
              new MessageEmbed({
                description:
                  chumps.size > 1
                    ? [
                        `${bold(
                          `COTW Vote Results: [${week}]`,
                        )}\n\nThis week's chump is/are:\n`,
                        Array.from(chumps)
                          .map((chump: string) => `${userMention(chump)}`)
                          .join('\n'),
                      ].join('\n')
                    : `${bold(
                        `COTW Vote Results: [${week}]`,
                      )}\n\nThis week's chump is ${userMention(
                        Array.from(chumps)[0],
                      )}`,
              }),
            ],
          });
        } else {
          client.logger.error(
            `Expected message ${yellow(res.message)} did not exist in ${
              guild.name
            } (${guild.id}).`,
          );
        }
      }
    });
};

export default closeVote;
