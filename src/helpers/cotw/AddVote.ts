import { bold, userMention } from '@discordjs/builders';
import { food } from 'discord-emoji';
import { Guild, Message, MessageEmbed, TextChannel } from 'discord.js';
import moment from 'moment';
import { Document, CallbackError } from 'mongoose';
import Bot from '../../client/Client';
import NominationModel from '../../models/NominationModel';
import { Nomination } from '../../types/NominationType';

const JAPANESE_FOOD_IDX = 70;

const addVote = (client: Bot, guild: Guild, cotwChannel: TextChannel): void => {
  // stringified date for previous, previous Monday
  const week = moment().day(-6).toISOString(true).split('T')[0];

  NominationModel.findOne({
    guildID: guild.id,
    week,
    'nominations.0': { $exists: true },
  })
    .exec()
    .then(
      async (
        res: (Document<unknown, unknown, Nomination> & Nomination) | null,
      ) => {
        if (res) {
          // extract Japanese food emojis from emoji dataset
          const foodEmojis = [
            ...new Set(Object.values(food).slice(JAPANESE_FOOD_IDX)),
          ].slice(0, res.nominations.length);

          // send voting message
          cotwChannel
            .send({
              embeds: [
                new MessageEmbed({
                  description: [
                    `${bold(
                      `COTW Vote: [${week}]`,
                    )}\nPlease vote for this week's COTW by reacting with a corresponding emoji:\n`,
                    res.nominations
                      .map(
                        (
                          {
                            nominee,
                            reason,
                          }: { nominee: string; reason: string },
                          i: number,
                        ) =>
                          `${foodEmojis[i]} : ${userMention(
                            nominee,
                          )} for "${reason}".`,
                      )
                      .join('\n'),
                  ].join('\n'),
                }),
              ],
            })
            .then((voteMessage: Message) => {
              // react with emojis
              foodEmojis.forEach((foodEmoji: string) =>
                voteMessage.react(foodEmoji),
              );

              // keep track of message Snowflake for removal
              NominationModel.updateOne(
                {
                  guildID: guild.id,
                  week,
                },
                {
                  message: voteMessage.id,
                },
                {},
                (e: CallbackError) => {
                  if (e) {
                    // error occurred during upsertion
                    client.logger.error(e);
                  } else {
                    // log database update
                    client.logger.success('Sucessfully updated nomination:');
                    client.logger.info(`guildID: ${guild.id}`);
                    client.logger.info(`messageID: ${voteMessage.id}`);
                  }
                },
              );
            })
            .catch(client.logger.error);
        }
      },
    );
};

export default addVote;
