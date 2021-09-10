import { Guild } from 'discord.js';
import Bot from '../../client/Client';
import Handler from '../../interfaces/HandlerStorage';

export const cronJobFrequency = '0 0 * * MON';

export const handler: Handler<unknown> = async (client: Bot): Promise<void> => {
  // prune all guilds
  await client.guilds.fetch();
  client.guilds.cache.each(async (guild: Guild) => {
    guild.members
      .prune({
        dry: true,
        days: 30,
        reason: 'Please rejoin when you are active on the server again.',
      })
      .then((pruneCount: number) =>
        client.logger.info(`Pruned ${pruneCount} members from ${guild.id}`),
      );
  });
};

export const name = 'prune';
