import { CommandInteraction, PermissionResolvable } from 'discord.js';
import Bot from '../client/Client';

export default interface Command {
  channelsBlacklisted: readonly string[];
  channelsWhitelisted: readonly string[];
  handle: (client: Bot, interaction: CommandInteraction) => Promise<void>;
  json: SlashCommandJSON;
  neededPermissions: readonly PermissionResolvable[];
}
