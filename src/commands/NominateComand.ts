import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from '@discordjs/builders';
import { PermissionResolvable, CommandInteraction } from 'discord.js';
import Bot from '../client/Client';
import addNomination from '../helpers/cotw/AddNomination';
import SlashCommandJSON from '../types/SlashCommandJSONType';

const MAXIMUM_REASON_LENGTH = 50;

// command metadata
export const channelsBlacklisted = Array<string>();
export const channelsWhitelisted = ['cotw'];
export const neededPermissions = Array<PermissionResolvable>();

// export slash command usage
export const json: SlashCommandJSON = new SlashCommandBuilder()
  .setName('nominate')
  .setDescription('Nominate someone as chump-of-the-week.')
  .setDefaultPermission(true)
  .addUserOption((option: SlashCommandUserOption) =>
    option
      .setName('user')
      .setDescription('User to nominate as chump-of-the-week.')
      .setRequired(true),
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName('reason')
      .setDescription('Reason for nominating this chump.')
      .setRequired(true),
  )
  .toJSON();

// export slash command handler
export const handle = (client: Bot, interaction: CommandInteraction): void => {
  const user = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason', true);

  if (reason.length <= MAXIMUM_REASON_LENGTH) {
    addNomination(client, interaction, interaction.user.id, user.id, reason);
  } else {
    interaction.reply({
      content: `Maximum reason error length is ${MAXIMUM_REASON_LENGTH} characters.`,
      ephemeral: true,
    });
  }
};
