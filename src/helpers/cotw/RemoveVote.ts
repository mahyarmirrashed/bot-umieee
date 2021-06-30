import _ from 'discord-emoji';
import {
	GuildChannel,
	TextChannel,
	Message,
	MessageReaction,
} from 'discord.js';
import moment from 'moment';
import Bot from '../../client/Client';
import ChumpModel from '../../models/ChumpModel';
import NominationModel from '../../models/NominationModel';
import Nomination from '../../types/NominationType';

const emojis = _;
const JAPANESE_FOOD_IDX = 70;

const removeVote = async (client: Bot): Promise<void> => {
	// get stringified date for previous, previous, previous Monday
	const week: string = moment().day(-13).toISOString(true).split('T')[0];

	// check if entry exists for this week
	const res: Nomination = (await NominationModel.findOne({
		week: week,
		'nominations.0': { $exists: true },
	}).exec()) as Nomination;

	if (res && client.guild) {
		// find 'cotw' channel
		const channel: TextChannel = client.guild.channels.cache.find(
			(channel: GuildChannel) =>
				channel.name === 'cotw' && channel instanceof TextChannel
		) as TextChannel;

		if (channel) {
			// extract Japanese food emojis from emoji dataset
			const foodEmojis = [
				...new Set(Object.values(emojis.food).slice(JAPANESE_FOOD_IDX)),
			];
			// fetch message from channel
			const message: Message = (await channel.messages.fetch(
				res.message
			)) as Message;
			// keep track of chumps
			const chumps: Set<string> = new Set<string>();

			// calculate most voted reactions
			const maximum: number = Math.max(
				...message.reactions.cache.map(
					(reaction: MessageReaction) => reaction.count as number
				)
			);

			message.reactions.cache
				.filter((reaction: MessageReaction) => reaction.count === maximum)
				.forEach((reaction: MessageReaction) => {
					// extract chump Snowflake
					const chump: string =
						res.nominations[foodEmojis.indexOf(reaction.emoji.toString())]
							.nominee;
					// add chump Snowflake to set
					chumps.add(chump);

					// update chump into database
					ChumpModel.updateOne(
						{ week: week },
						{ $addToSet: { chumps: chump } },
						{ upsert: true },
						(e: unknown) => {
							if (e) {
								client.logger.error(e);
							} else {
								// log database addition
								client.logger.success('Successfully added chump to set:');
								client.logger.info(`chump: ${chump}`);
							}
						}
					);
				});

			client.sendEmbed(channel, {
				description: [
					`**COTW Vote Results: [${week}]**\n\nThis week's chump is/are:`,
					'',
					Array.from(chumps)
						.map((chump: string) => `<@${chump}>`)
						.join('\n'),
				].join('\n'),
			});
		}
	}
};

export default removeVote;
