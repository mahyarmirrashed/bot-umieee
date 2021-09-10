import { Guild, GuildMember } from 'discord.js';
import findOrCreateActiveRole from '../guild/FindOrCreateActiveRole';
import findOrCreateAlumniRole from '../guild/FindOrCreateAlumniRole';

const modifyMember = async (
  guild: Guild,
  member: GuildMember,
  valid: boolean,
): Promise<void> => {
  // retrieve active and inactive role objects
  const alumniRole = await findOrCreateAlumniRole(guild);
  const activeRole = await findOrCreateActiveRole(guild);

  // ensure member is still inside guild
  await guild.members.fetch();
  if (guild.members.cache.has(member.id)) {
    // adjust member role as necessary
    if (valid && !member.roles.cache.has(alumniRole.id)) {
      await member.roles.add(activeRole);
    } else {
      // remove on alumnis too if assigned
      await member.roles.remove(activeRole);
    }
  }
};

export default modifyMember;
