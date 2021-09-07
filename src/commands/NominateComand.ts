import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from '@discordjs/builders';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import {
  PermissionResolvable,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import Bot from '../client/Client';
import addNomination from '../helpers/cotw/AddNomination';
import findOrCreateActiveRole from '../helpers/guild/FindOrCreateActiveRole';

const MAXIMUM_REASON_LENGTH = 50;

// command metadata
export const channelsBlacklisted = Array<string>();
export const channelsWhitelisted = ['cotw'];
export const neededPermissions = Array<PermissionResolvable>();

// export slash command usage
export const json: RESTPostAPIApplicationCommandsJSONBody =
  new SlashCommandBuilder()
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
export const handle = async (
  client: Bot,
  interaction: CommandInteraction,
): Promise<void> => {
  const user = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason', true);

  if (reason.length <= MAXIMUM_REASON_LENGTH) {
    if (
      interaction.guild &&
      interaction.member &&
      interaction.member instanceof GuildMember
    ) {
      const activeRole = await findOrCreateActiveRole(interaction.guild);
      // find mentioned member on server
      const member = await interaction.guild.members.fetch(user);

      // only members
      if (!user.bot && member.roles.cache.has(activeRole.id)) {
        addNomination(
          client,
          interaction,
          interaction.guild.id,
          interaction.user.id,
          user.id,
          reason,
        );
      } else {
        interaction.reply({
          content: 'You cannot nominate this user.',
          ephemeral: true,
        });
      }
    }
  } else {
    interaction.reply({
      content: `Maximum reason error length is ${MAXIMUM_REASON_LENGTH} characters.`,
      ephemeral: true,
    });
  }
};
