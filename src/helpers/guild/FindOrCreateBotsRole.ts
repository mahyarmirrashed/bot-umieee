import { Guild, Permissions, Role } from 'discord.js';

const findOrCreateBotsRole = async (guild: Guild): Promise<Role> =>
  guild.roles.cache.find((role: Role) => role.name.toLowerCase() === 'bots') ??
  (await guild.roles.create({
    name: 'Bots',
    color: 'DARK_PURPLE',
    hoist: true,
    permissions: [
      Permissions.FLAGS.VIEW_CHANNEL,
      Permissions.FLAGS.MANAGE_ROLES,
      Permissions.FLAGS.SEND_MESSAGES,
      Permissions.FLAGS.EMBED_LINKS,
      Permissions.FLAGS.ADD_REACTIONS,
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
      Permissions.FLAGS.MANAGE_MESSAGES,
    ],
    mentionable: false,
    reason: 'For creating necessary permissions for current bot.',
  }));

export default findOrCreateBotsRole;
