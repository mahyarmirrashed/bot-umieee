import {
  Guild,
  GuildChannel,
  Permissions,
  ThreadChannel,
  NewsChannel,
} from 'discord.js';
import findOrCreateBotsRole from './FindOrCreateBotsRole';

const findOrCreateEventsChannel = async (guild: Guild): Promise<NewsChannel> =>
  (guild.channels.cache.find(
    (channel: GuildChannel | ThreadChannel) =>
      channel.name === 'events' && channel instanceof NewsChannel,
  ) as NewsChannel) ??
  (await guild.channels.create('events', {
    type: 'GUILD_NEWS',
    topic: 'Check-in weekly to see the latest IEEE Winnipeg Section events.',
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: [
          Permissions.FLAGS.CREATE_INSTANT_INVITE,
          Permissions.FLAGS.SEND_MESSAGES,
          Permissions.FLAGS.EMBED_LINKS,
          Permissions.FLAGS.ATTACH_FILES,
          Permissions.FLAGS.ADD_REACTIONS,
        ],
        type: 'role',
      },
      {
        id: (await findOrCreateBotsRole(guild)).id,
        allow: [
          Permissions.FLAGS.SEND_MESSAGES,
          Permissions.FLAGS.EMBED_LINKS,
          Permissions.FLAGS.MANAGE_MESSAGES,
        ],
        type: 'role',
      },
    ],
    reason: 'For announcing the latest IEEE Winnipeg Section events.',
  }));

export default findOrCreateEventsChannel;
