import { Guild, GuildChannel, TextChannel, ThreadChannel } from 'discord.js';

const findOrCreateCotwChannel = async (guild: Guild): Promise<TextChannel> =>
  (guild.channels.cache.find(
    (channel: GuildChannel | ThreadChannel) =>
      channel.name === 'cotw' && channel instanceof TextChannel,
  ) as TextChannel) ??
  (await guild.channels.create('cotw', {
    type: 'GUILD_TEXT',
    topic:
      'Chump of the week. Did something chumpy or know a chump? Vote them for the chump of the week here. Self-nominations are expected for the most honest of us.',
    reason: 'For voting chumps.',
  }));

export default findOrCreateCotwChannel;
