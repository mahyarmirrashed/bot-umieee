import { hyperlink, SlashCommandBuilder } from '@discordjs/builders';
import { PermissionResolvable, CommandInteraction } from 'discord.js';
import Bot from '../client/Client';
import SlashCommandJSON from '../types/SlashCommandJSONType';

// command metadata
export const channelsBlacklisted = Array<string>();
export const channelsWhitelisted = Array<string>();
export const neededPermissions = Array<PermissionResolvable>();

// export slash command usage
export const json: SlashCommandJSON = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get in touch with IEEE.')
  .setDefaultPermission(true)
  .toJSON();

// export slash command handler
export const handle = (_client: Bot, interaction: CommandInteraction): void => {
  // provide contact resources
  interaction.reply({
    content: `If you are a UMIEEE member, come see us in E1-514 or send us an email at ${hyperlink(
      'ieee@umes.mb.ca',
      'mailto:ieee@umes.mb.ca',
    )}. Otherwise, contact ${hyperlink(
      'IEEE support',
      'https://www.ieee.org/about/contact.html',
    )}.`,
    ephemeral: true,
  });
};
