import axios, { AxiosResponse } from 'axios';
import { Guild, MessageEmbed } from 'discord.js';
import TurndownService from 'turndown';
import Bot from '../../client/Client';
import findOrCreateEventsChannel from '../../helpers/guild/FindOrCreateEventsChannel';
import Handler from '../../interfaces/HandlerStorage';
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

// cron job metadata
export const cronJobFrequency = '0 0 * * MON';

export const handler: Handler = async (client: Bot): Promise<void> => {
  axios
    .get(
      // fetch all upcoming events
      'https://events.vtools.ieee.org/feeds/v2/c/R70031?span=now~&sort=start_time',
    )
    .then((res: AxiosResponse) => {
      // extract advertisements from JSON response
      const {
        data: { data: advertisements },
      }: { data: { data: Advertisement[] } } = res;
      // map advertisements to embeds
      const embeds = advertisements.map(
        (advertisement: Advertisement) =>
          new MessageEmbed({
            author: { name: 'Winnipeg Section Event Announcement!' },
            title: advertisement.attributes.title,
            // use TurndownService to convert HTML to Markdown
            description: new TurndownService().turndown(
              advertisement.attributes.description.replace(
                /\\(["'\\bfnrt])/g,
                (_, c) => `${MAPPINGS[c] || c}`,
              ),
            ),
            fields: [
              {
                name: 'Registration Link:',
                value: advertisement.attributes.link,
                inline: true,
              },
            ],
            color: 'BLUE',
          }),
      );

      // if advertisements exist, post on all guilds
      if (advertisements.length > 0) {
        client.guilds.cache.forEach(async (guild: Guild) => {
          (await findOrCreateEventsChannel(guild))
            .send({ embeds })
            .catch(client.logger.error);
        });
      }
    })
    .catch(client.logger.error);
};

export const name = 'advertise';
