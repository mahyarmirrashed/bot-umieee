import { REST } from '@discordjs/rest';
import { cyan } from 'chalk';
import consola from 'consola';
import { CronJob } from 'cron';
import { Routes } from 'discord-api-types/v9';
import {
  LimitedCollection,
  Options,
  Client,
  Intents,
  Collection,
} from 'discord.js';
import { glob } from 'glob';
import { connect } from 'mongoose';
import { promisify } from 'util';
import Command from '../interfaces/CommandStorage';
import Event from '../interfaces/EventStorage';
import SlashCommandJSON from '../types/SlashCommandJSONType';

const globPromise = promisify(glob);

export default class Bot extends Client {
  // readonly members
  public readonly commands = new Collection<string, Command>();
  public readonly events = new Collection<string, Event>();
  public readonly logger = consola;

  public constructor() {
    super({
      // list intents bot requires for functionality
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
      // caching options for thread and messages
      makeCache: Options.cacheWithLimits({
        // default thread sweeping behaviour
        MessageManager: {
          sweepInterval: 180,
          sweepFilter: LimitedCollection.filterByLifetime({
            lifetime: 1800,
            getComparisonTimestamp: (e) =>
              e.editedTimestamp ?? e.createdTimestamp,
          }),
          maxSize: 200,
        },
      }),
    });

    // log into client
    super.login(process.env.DISCORD_TOKEN as string).catch(this.logger.error);

    // log into database
    connect(process.env.DATABASE_URI as string)
      .then(() =>
        this.logger.success('Successfully established database connection!'),
      )
      .catch(this.logger.error);
  }

  public start(): void {
    // register events
    globPromise(`${__dirname}/../events/**/*{.ts,.js}`)
      .then((events: string[]) => {
        events.map(async (eventPath: string) => {
          import(eventPath).then((event: Event) => {
            if (event.cronJobFrequency) {
              // cron job event
              new CronJob(event.cronJobFrequency, () =>
                event.handler(this),
              ).start();
            } else {
              // discord event
              this.logger.info(`Registering event ${cyan(event.name)}...`);
              this.events.set(event.name, event);
              this.on(event.name, event.handler.bind(null, this));
            }
          });
        });
      })
      .catch(this.logger.error);

    // register slash commands locally
    globPromise(`${__dirname}/../commands/**/*{.ts,.js}`).then(
      (commands: string[]) =>
        // once all promises return their json, report to API
        Promise.all(
          commands.map(
            async (commandPath: string): Promise<SlashCommandJSON> =>
              import(commandPath).then((command: Command): SlashCommandJSON => {
                this.logger.info(
                  `Registering command ${cyan(command.json.name)}...`,
                );
                this.commands.set(command.json.name, command);
                // return slash command's JSON for array construction
                return command.json;
              }),
          ),
        ).then((slashCommands: SlashCommandJSON[]) =>
          // report slash commands to Discord API
          new REST({ version: '9' })
            .setToken(process.env.DISCORD_TOKEN as string)
            .put(
              Routes.applicationGuildCommands(
                process.env.CLIENT_ID as string,
                process.env.GUILD_ID as string,
              ),
              {
                body: slashCommands,
              },
            )
            .then(() =>
              this.logger.success(
                'Successfully registered all application commands!',
              ),
            )
            .catch(this.logger.error),
        ),
    );
  }
}
