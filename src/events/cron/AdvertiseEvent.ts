import { bold } from '@discordjs/builders';
import axios, { AxiosResponse } from 'axios';
import { Guild, Message, MessageEmbed, NewsChannel } from 'discord.js';
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

export const handler: Handler<unknown> = async (client: Bot): Promise<void> => {
  axios
    .get(
      // fetch all upcoming events
      'https://events.vtools.ieee.org/feeds/v2/c/R70031?span=now~&sort=start_time',
    )
    .then(async (res: AxiosResponse) => {
      // extract advertisements from JSON response
      const {
        data: { data: advertisements },
      }: { data: { data: Advertisement[] } } = res;
      // map advertisements to embeds
      const embeds = [
        new MessageEmbed({
          title: bold('Upcoming Events in the IEEE Winnipeg Section'),
          color: 'BLUE',
        }),
        ...advertisements.map(
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
        ),
      ];

      // if advertisements exist, post on all guilds
      if (advertisements.length > 0) {
        await client.guilds.fetch();
        client.guilds.cache.each(async (guild: Guild) =>
          (await findOrCreateEventsChannel(guild))
            .send({ embeds })
            .then((announcement: Message) => {
              // only publish if inside NewsChannel
              if (announcement.channel instanceof NewsChannel) {
                announcement.crosspost();
              }
            })
            .then(() =>
              client.logger.info(`Made announcements on guild (${guild.id})`),
            )
            .catch(client.logger.error),
        );
      }
    })
    .catch(client.logger.error);
};

export const name = 'advertise';
