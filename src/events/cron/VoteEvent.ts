import { Guild } from 'discord.js';
import Bot from '../../client/Client';
import addVote from '../../helpers/cotw/AddVote';
import removeVote from '../../helpers/cotw/RemoveVote';
import findOrCreateCotwChannel from '../../helpers/guild/FindOrCreateCotwChannel';
import Handler from '../../interfaces/HandlerStorage';

export const cronJobFrequency = '0 0 * * MON';

export const handler: Handler<unknown> = async (client: Bot): Promise<void> => {
  // perform for all guilds
  client.guilds.cache.forEach(async (guild: Guild) => {
    const cotwChannel = await findOrCreateCotwChannel(guild);
    removeVote(client, guild, cotwChannel);
    addVote(client, guild, cotwChannel);
  });
};

export const name = 'vote';
