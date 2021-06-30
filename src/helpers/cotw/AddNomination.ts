import { Message, Snowflake } from 'discord.js';
import Bot from '../../client/Client';
import NominationModel from '../../models/NominationModel';
import moment from 'moment';
import Nomination from '../../types/NominationType';

const MAXIMUM_NOMINATIONS = 20;

const addNomination = async (
	client: Bot,
	message: Message,
	nominator: Snowflake,
	nominee: Snowflake,
	reason: string
): Promise<void> => {
	// get stringified date for previous Monday
	const week: string = moment().day(1).toISOString(true).split('T')[0];

	// check if entry exist for this week
	const res: Nomination = (await NominationModel.findOne({
		week: week,
		$or: [
			{
				nominations: {
					$elemMatch: {
						nominator: nominator,
						nominee: nominee,
						reason: reason,
					},
				},
			},
			{
				nominations: {
					$size: MAXIMUM_NOMINATIONS,
				},
			},
		],
	}).exec()) as Nomination;

	if (res) {
		if (res.nominations.length === MAXIMUM_NOMINATIONS) {
			// maximum number of weekly nominations reached
			client.sendReplyEmbed(message, {
				description: `**Error:** Maximum number of weekly nominations reached (${MAXIMUM_NOMINATIONS}).`,
			});
		} else {
			// exact nomination match found
			client.sendReplyEmbed(message, {
				description: `**Error:** <@${nominator}>, you have already voted for this person for this reason already!`,
			});
		}
	} else {
		// upsert nomination into database
		NominationModel.updateOne(
			{
				week: week,
			},
			{
				$push: {
					nominations: {
						nominator: nominator,
						nominee: nominee,
						reason: reason,
					},
				},
			},
			{
				upsert: true,
			},
			(e: unknown) => {
				if (e) {
					client.logger.error(e);
				} else {
					// announce successful upsertion
					client.sendReplyEmbed(
						message,
						{
							description: [
								`<@${nominator}> nominated <@${nominee}> as this week's chump.`,
								'',
								`**Reason:** "${reason}".`,
							].join('\n'),
						},
						'GREEN'
					);
					// log database upsertion
					client.logger.success('Successfully upserted new nomination:');
					client.logger.info(`nominator: ${nominator}`);
					client.logger.info(`nominee: ${nominee}`);
					client.logger.info(`reason: "${reason}"`);
				}
			}
		);
	}
};

export default addNomination;
