import { Guild, GuildMember } from 'discord.js';
import findOrCreateActiveRole from '../guild/FindOrCreateActiveRole';
import findOrCreateInactiveRole from '../guild/FindOrCreateInactiveRole';

const modifyMember = async (
  guild: Guild,
  member: GuildMember,
  valid: boolean,
): Promise<void> => {
  // retrieve active and inactive role objects
  const activeRole = await findOrCreateActiveRole(guild);
  const inactiveRole = await findOrCreateInactiveRole(guild);

  // adjust member role as necessary
  if (valid) {
    member.roles.add(activeRole);
    member.roles.remove(inactiveRole);
  } else {
    member.roles.add(inactiveRole);
    member.roles.remove(activeRole);
  }
};

export default modifyMember;
