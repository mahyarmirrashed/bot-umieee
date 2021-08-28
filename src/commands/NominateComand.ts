import {
  roleMention,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from '@discordjs/builders';
import {
  PermissionResolvable,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import Bot from '../client/Client';
import addNomination from '../helpers/cotw/AddNomination';
import findOrCreateInactiveRole from '../helpers/guild/FindOrCreateInactiveRole';
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
      const inactiveRole = await findOrCreateInactiveRole(interaction.guild);
      // find mentioned member on server
      const member = await interaction.guild.members.fetch(user);

      // only members
      if (!user.bot && !member.roles.cache.has(inactiveRole.id)) {
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
          content:
            'You cannot nominate this user because of one or more of their roles.',
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
