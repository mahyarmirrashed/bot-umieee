import { GuildChannel, TextChannel } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import TurndownService from 'turndown';
import Bot from '../../client/Client';
import RunFunction from '../../interfaces/RunFunctionStorage';
import Advertisement from '../../types/AdvertisementType';

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
			// fetch all upcoming events
			'https://events.vtools.ieee.org/feeds/v2/c/R70031?span=now~&sort=start_time'
		)
		.then((res: AxiosResponse) => {
			const {
				data: { data: advertisements },
			}: { data: { data: Advertisement[] } } = res;

			if (client.guild && advertisements.length > 0) {
				// find 'events' channel
				const channel: TextChannel = client.guild.channels.cache.find(
					(channel: GuildChannel) =>
						channel.name === 'events' && channel instanceof TextChannel
				) as TextChannel;

				// header for advertisements
				client.sendEmbed(channel, {
					title: '**Upcoming Events in IEEE Winnipeg Section**',
				});

				// post each advertisement as embed to 'events' channel
				advertisements.forEach((advertisement: Advertisement) =>
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
