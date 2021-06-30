import { Message, Snowflake } from 'discord.js';
import Bot from '../../client/Client';
import MembershipModel from '../../models/MembershipModel';
import Membership from '../../types/MembershipType';

const addMembership = async (
	client: Bot,
	message: Message,
	discordID: Snowflake,
	ieeeID: string
): Promise<void> => {
	// check if other users exist with same ieeeID but different discordID
	const res: Membership = (await MembershipModel.findOne({
		ieeeID: ieeeID,
		discordID: { $ne: discordID },
	}).exec()) as Membership;

	if (res) {
		// indicate which user already has the targeted ieeeID
		client.sendReplyEmbed(message, {
			description: `<@${res.discordID}> is already assigned the IEEE ID, ${ieeeID}!`,
		});
	} else {
		MembershipModel.updateOne(
			{ discordID: discordID },
			{ discordID: discordID, ieeeID: ieeeID },
			{ upsert: true },
			(e: unknown) => {
				if (e) {
					client.logger.error(e);
				} else {
					// announce successful upsertion
					client.sendReplyEmbed(
						message,
						{
							description: `Successfully assigned <@${discordID}> the IEEE ID, ${ieeeID}!`,
						},
						'GREEN'
					);
					// log database upsertion
					client.logger.success('Successfully upserted new member:');
					client.logger.info(`discordID: ${discordID}`);
					client.logger.info(`ieeeID: ${ieeeID}`);
				}
			}
		);
	}
};

export default addMembership;
