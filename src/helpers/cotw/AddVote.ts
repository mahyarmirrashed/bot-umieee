import _ from 'discord-emoji';
import { GuildChannel, Message, TextChannel } from 'discord.js';
import moment from 'moment';
import Bot from '../../client/Client';
import NominationModel from '../../models/NominationModel';
import Nomination from '../../types/NominationType';

const emojis = _;
const JAPANESE_FOOD_IDX = 70;

const addVote = async (client: Bot): Promise<void> => {
	// get stringified date for previous, previous Monday
	const week: string = moment().day(-6).toISOString(true).split('T')[0];

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

			// send embedded voting message
			const message: void | Message = await client.sendEmbed(channel, {
				description: [
					`**COTW Vote: [${week}]**\nPlease vote for this week's COTW by reacting with a corresponding emoji:`,
					'',
					res.nominations
						.map(
							(
								{ nominee, reason }: { nominee: string; reason: string },
								i: number
							) => `${foodEmojis[i]} : <@${nominee}> for "${reason}".`
						)
						.join('\n'),
				].join('\n'),
			});

			// embedded message successfully sent
			if (message) {
				// react with available emojis
				foodEmojis
					.slice(0, res.nominations.length)
					.forEach((foodEmoji: string) => message.react(foodEmoji));
				// save sent message Snowflake (ID)
				NominationModel.updateOne(
					{ week: week },
					{ message: message.id },
					{},
					(e: unknown) => {
						if (e) {
							client.logger.error(e);
						} else {
							// log database update
							client.logger.success('Successfully updated nomination:');
							client.logger.info(`message: ${message.id}`);
						}
					}
				);
			}
		}
	}
};

export default addVote;
