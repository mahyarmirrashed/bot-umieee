import {
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandUserOption,
} from '@discordjs/builders';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import { CommandInteraction, Permissions, GuildMember } from 'discord.js';
import Bot from '../client/Client';
import generateToken from '../helpers/membership/GenerateToken';
import modifyMember from '../helpers/membership/ModifyMember';
import registerMember from '../helpers/membership/RegisterMember';
import validateMember from '../helpers/membership/ValidateMember';

const MINIMUM_IEEE_ID = 10_000_000;

// command metadata
export const channelsBlacklisted = Array<string>();
export const channelsWhitelisted = ['bots'];
export const neededPermissions = [Permissions.FLAGS.MANAGE_GUILD];

// export slash command usage
export const json: RESTPostAPIApplicationCommandsJSONBody =
  new SlashCommandBuilder()
    .setName('add')
    .setDescription('Activate a new IEEE member on the server.')
    .setDefaultPermission(true)
    .addUserOption((option: SlashCommandUserOption) =>
      option
        .setName('user')
        .setDescription(
          'Mention user to associate with the IEEE membership number.',
        )
        .setRequired(true),
    )
    .addIntegerOption((option: SlashCommandIntegerOption) =>
      option
        .setName('ieee_number')
        .setDescription('IEEE membership number to associate with user.')
        .setRequired(true),
    )
    .toJSON();

// export slash command handler
export const handle = (client: Bot, interaction: CommandInteraction): void => {
  const user = interaction.options.getUser('user', true);
  const ieeeID = interaction.options.getInteger('ieee_number', true);

  // ensure IEEE membership number within acceptable range
  if (ieeeID > MINIMUM_IEEE_ID) {
    // add member to database for membership validation
    interaction
      .deferReply()
      .then(() => {
        // type guard for possibily null guild
        if (interaction.guild) {
          registerMember(
            client,
            interaction,
            interaction.guild.id,
            user.id,
            ieeeID,
          );
        }
      })
      // continue with steps to modify member role
      .then(() => generateToken())
      .then((token: string) => validateMember(token, ieeeID))
      .then(async (valid: boolean) => {
        if (interaction.guild && interaction.member instanceof GuildMember) {
          modifyMember(
            interaction.guild,
            await interaction.guild.members.fetch(user),
            valid,
          );
        }
      })
      .catch(client.logger.error);
  } else {
    interaction.reply({
      content: 'IEEE membership number not in acceptable range.',
      ephemeral: true,
    });
  }
};
