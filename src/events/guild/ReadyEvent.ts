import { ActivityType, PresenceUpdateStatus } from 'discord-api-types/v9';
import { Constants } from 'discord.js';
import Bot from '../../client/Client';
import Handler from '../../interfaces/HandlerStorage';

export const handler: Handler = async (client: Bot): Promise<void> => {
  if (client.user) {
    // report successful login
    client.logger.success('Successfully logged in!');
    // set bot rich presence on servers
    client.user.setPresence({
      status: PresenceUpdateStatus.Online,
      afk: false,
      activities: [{ name: '/help', type: ActivityType.Game }],
    });
  } else {
    client.logger.error('`user` property on `client` was `null`...');
  }
};

export const name = Constants.Events.CLIENT_READY;
