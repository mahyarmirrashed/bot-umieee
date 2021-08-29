import { createIntl } from '@formatjs/intl';
import { Constants, GuildChannel, Interaction, Permissions } from 'discord.js';
import Bot from '../../client/Client';
import Handler from '../../interfaces/HandlerStorage';

export const handler: Handler<Interaction> = async (
  client: Bot,
  interaction: Interaction,
): Promise<void> => {
  if (interaction.isCommand()) {
    // cache command
    const command = client.commands.get(interaction.commandName);
    // if command is not undefined (exists)
    if (command) {
      // cannot send message in blacklisted channels
      if (
        command.channelsBlacklisted.every(
          (channelBlacklisted: string) =>
            interaction.channel instanceof GuildChannel &&
            channelBlacklisted !== interaction.channel.name,
        )
      ) {
        if (
          command.channelsWhitelisted.length === 0 ||
          command.channelsWhitelisted.some(
            (channelWhitelisted: string) =>
              interaction.channel instanceof GuildChannel &&
              channelWhitelisted === interaction.channel.name,
          )
        ) {
          if (
            interaction.member?.permissions instanceof Permissions &&
            interaction.member?.permissions.has(command.neededPermissions)
          ) {
            // handle command interaction
            command.handle(client, interaction);
          } else {
            // report user missing permissions
            interaction.reply({
              content: 'You are not permitted to use this slash command.',
              ephemeral: true,
            });
          }
        } else {
          // report channels where command can be called
          interaction.reply({
            content: `Call this command inside ${createIntl({
              locale: 'en',
            }).formatList(
              command.channelsWhitelisted.map(
                (channelWhitelisted: string) => `\`${channelWhitelisted}\``,
              ),
              {
                type: 'disjunction',
              },
            )}.`,
            ephemeral: true,
          });
        }
      } else {
        // report current channel is blacklisted for usage by command
        interaction.reply({
          content: 'Calling this command inside this channel is not permitted.',
          ephemeral: true,
        });
      }
    }
  }
};

export const name = Constants.Events.INTERACTION_CREATE;
