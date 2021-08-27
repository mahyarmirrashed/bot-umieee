import { Guild, Permissions, Role } from 'discord.js';

const findOrCreateInactiveRole = async (guild: Guild): Promise<Role> =>
  guild.roles.cache.find(
    (role: Role) => role.name.toLowerCase() === 'inactive',
  ) ??
  (await guild.roles.create({
    name: 'Inactive',
    color: 'DARK_RED',
    hoist: false,
    permissions: [
      Permissions.FLAGS.VIEW_CHANNEL,
      Permissions.FLAGS.CHANGE_NICKNAME,
      Permissions.FLAGS.READ_MESSAGE_HISTORY,
    ],
    mentionable: false,
    reason: 'For keeping track of inactive IEEE members on server.',
  }));

export default findOrCreateInactiveRole;
