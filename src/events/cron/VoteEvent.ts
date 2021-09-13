import { Guild } from 'discord.js';
import Bot from '../../client/Client';
import openVote from '../../helpers/cotw/OpenVote';
import closeVote from '../../helpers/cotw/CloseVote';
import findOrCreateCotwChannel from '../../helpers/guild/FindOrCreateCotwChannel';
import Handler from '../../interfaces/HandlerStorage';

export const cronJobFrequency = '30 8 * * MON';

export const handler: Handler<unknown> = async (client: Bot): Promise<void> => {
  // initiate close and/or open vote on all guilds
  await client.guilds.fetch();
  client.guilds.cache.each(async (guild: Guild) => {
    const cotwChannel = await findOrCreateCotwChannel(guild);
    closeVote(client, guild, cotwChannel);
    openVote(client, guild, cotwChannel);
  });
};

export const name = 'vote';
