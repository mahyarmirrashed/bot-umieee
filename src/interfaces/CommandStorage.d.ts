import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import { CommandInteraction, PermissionResolvable } from 'discord.js';
import Bot from '../client/Client';

export default interface Command {
  channelsBlacklisted: readonly string[];
  channelsWhitelisted: readonly string[];
  handle: (client: Bot, interaction: CommandInteraction) => Promise<void>;
  json: RESTPostAPIApplicationCommandsJSONBody;
  neededPermissions: readonly PermissionResolvable[];
}
