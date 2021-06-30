import { GuildChannel, TextChannel } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import TurndownService from 'turndown';
import Bot from '../../client/Client';
import RunFunction from '../../interfaces/RunFunctionStorage';
import Advertisement from '../../types/AdvertisementType';
import moment from 'moment';

// mappings to escape HTML-formatted results from vTools Events API
const MAPPINGS = Object.assign(Object.create(null), {
	'"': '"',
	"'": "'",
	'\\': '\\',
	b: '',
	f: '',
	n: '',
	r: '',
	t: '',
});

export const run: RunFunction = async (client: Bot): Promise<void> => {
	axios
		.get(
			// generate time delta for past seven days
			`https://services13.ieee.org/RST/events/api/public/v2/events/list.json?span=${moment()
				.day(-7)
				.toISOString()}~${moment().day(0).toISOString()}`
		)
		.then((response: AxiosResponse) => {
			const {
				data: { data: advertisements },
			}: { data: { data: Advertisement[] } } = response;

			if (client.guild) {
				// find 'events' channel
				const channel: TextChannel = client.guild.channels.cache.find(
					(channel: GuildChannel) =>
						channel.name === 'events' && channel instanceof TextChannel
				) as TextChannel;

				advertisements
					// filter to only Winnipeg results
					.filter(
						(advertisement: Advertisement) =>
							advertisement.attributes.city === 'Winnipeg'
					)
					// post each filtered result as embed to 'events' channel
					.forEach((advertisement: Advertisement) =>
						client.sendEmbed(channel, {
							author: { name: 'Winnipeg Section Event Announcement!' },
							title: advertisement.attributes.title,
							// use TurndownService to convert HTML to Markdown
							description: new TurndownService().turndown(
								advertisement.attributes.description.replace(
									/\\(["'\\bfnrt])/g,
									(_, c) => `${MAPPINGS[c] || c}`
								)
							),
							fields: [
								{
									name: 'Registration Link:',
									value: advertisement.attributes.link,
									inline: true,
								},
							],
						})
					);
			}
		})
		.catch((e: unknown) => client.logger.error(e));
};

export const name = 'advertise';
