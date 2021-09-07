import { Guild, Permissions, Role } from 'discord.js';

const findOrCreateActiveRole = async (guild: Guild): Promise<Role> =>
  guild.roles.cache.find(
    (role: Role) => role.name.toLowerCase() === 'active',
  ) ??
  (await guild.roles.create({
    name: 'Active',
    color: 'GREEN',
    hoist: false,
    permissions: [
      Permissions.FLAGS.VIEW_CHANNEL,
      Permissions.FLAGS.CHANGE_NICKNAME,
      Permissions.FLAGS.SEND_MESSAGES,
      Permissions.FLAGS.USE_PUBLIC_THREADS,
      Permissions.FLAGS.USE_PRIVATE_THREADS,
      Permissions.FLAGS.EMBED_LINKS,
      Permissions.FLAGS.ATTACH_FILES,
      Permissions.FLAGS.ADD_REACTIONS,
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
      Permissions.FLAGS.USE_EXTERNAL_STICKERS,
      Permissions.FLAGS.READ_MESSAGE_HISTORY,
      Permissions.FLAGS.USE_APPLICATION_COMMANDS,
      Permissions.FLAGS.CONNECT,
      Permissions.FLAGS.SPEAK,
      Permissions.FLAGS.STREAM,
      Permissions.FLAGS.USE_VAD,
      Permissions.FLAGS.REQUEST_TO_SPEAK,
    ],
    mentionable: false,
    reason: 'For keeping track of active IEEE members.',
  }));

export default findOrCreateActiveRole;
