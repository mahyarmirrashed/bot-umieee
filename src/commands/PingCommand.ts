import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionResolvable } from 'discord.js';
import Bot from '../client/Client';
import SlashCommandJSON from '../types/SlashCommandJSONType';

// command metadata
export const channelsBlacklisted = Array<string>();
export const channelsWhitelisted = Array<string>();
export const neededPermissions = Array<PermissionResolvable>();

// export slash command usage
export const json: SlashCommandJSON = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Checks ping time with web socket.')
  .setDefaultPermission(true)
  .toJSON();

// export slash command handler
export const handle = (client: Bot, interaction: CommandInteraction): void => {
  interaction.reply({
    content: `Pong! (${client.ws.ping}ms)`,
    ephemeral: true,
  });
};
