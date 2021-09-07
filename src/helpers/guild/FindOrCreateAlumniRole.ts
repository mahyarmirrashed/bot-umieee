import { Guild, Role } from 'discord.js';

const findOrCreateAlumniRole = async (guild: Guild): Promise<Role> =>
  guild.roles.cache.find(
    (role: Role) => role.name.toLowerCase() === 'alumni',
  ) ??
  (await guild.roles.create({
    name: 'Alumni',
    color: 'ORANGE',
    hoist: false,
    permissions: [],
    mentionable: false,
    reason: 'For keeping track of active IEEE members.',
  }));

export default findOrCreateAlumniRole;
