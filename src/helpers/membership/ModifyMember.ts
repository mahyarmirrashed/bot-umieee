import { Guild, GuildMember } from 'discord.js';
import findOrCreateInactiveRole from '../guild/FindOrCreateInactiveRole';

const modifyMember = async (
  guild: Guild,
  member: GuildMember,
  valid: boolean,
): Promise<void> => {
  // retrieve active and inactive role objects
  const inactiveRole = await findOrCreateInactiveRole(guild);

  // adjust member role as necessary
  if (valid) {
    // TODO: fix issue with role adding
    await member.roles.remove(inactiveRole);
  } else {
    await member.roles.add(inactiveRole);
  }
};

export default modifyMember;
