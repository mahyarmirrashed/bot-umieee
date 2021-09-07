import {
  SlashCommandBuilder,
  SlashCommandIntegerOption,
} from '@discordjs/builders';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import {
  Collection,
  CommandInteraction,
  Message,
  NewsChannel,
  Permissions,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import Bot from '../client/Client';

// command metadata
export const channelsBlacklisted = ['bots'];
export const channelsWhitelisted = Array<string>();
export const neededPermissions = [Permissions.FLAGS.MANAGE_MESSAGES];

// export slash command usage
export const json: RESTPostAPIApplicationCommandsJSONBody =
  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears messages from channel.')
    .setDefaultPermission(true)
    .addIntegerOption((option: SlashCommandIntegerOption) =>
      option
        .setName('count')
        .setDescription(
          'Number of messages to delete (default/maximum is 99).',
        ),
    )
    .toJSON();

// export slash command handler
export const handle = (_client: Bot, interaction: CommandInteraction): void => {
  // default to 99 messages
  // cap count at 99 messages (maximum value)
  const count = Math.min(interaction.options.getInteger('count') ?? 99, 99);

  if (count > 0) {
    // delete messages from channel
    if (
      interaction.channel instanceof NewsChannel ||
      interaction.channel instanceof TextChannel ||
      interaction.channel instanceof ThreadChannel
    ) {
      interaction.channel
        .bulkDelete(count)
        .then((messages: Collection<string, Message>) => {
          if (messages.size > 1) {
            interaction.reply(`Deleted ${messages.size} messages.`);
          } else {
            interaction.reply(`Deleted 1 message.`);
          }
          // delete message deletion report
          setTimeout(() => interaction.deleteReply(), 2000);
        });
    } else {
      interaction.reply({
        content: 'This command is only valid in text channels.',
        ephemeral: true,
      });
    }
  } else {
    // remind user about lower bound message count
    interaction.reply({
      content: 'Must delete at least one message.',
      ephemeral: true,
    });
  }
};
