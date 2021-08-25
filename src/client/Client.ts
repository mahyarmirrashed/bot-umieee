import consola, { Consola } from 'consola';
import { CronJob } from 'cron';
import {
	Client,
	Collection,
	Guild,
	Intents,
	LimitedCollection,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
	NewsChannel,
	Options,
	TextChannel,
} from 'discord.js';
import glob from 'glob';
import { connect } from 'mongoose';
import { promisify } from 'util';

import Command from '../interfaces/CommandStorage';
import Event from '../interfaces/EventStorage';

import { run as postAdvertisements } from '../events/cron/AdvertisementEvent';
import { run as validateMembers } from '../events/cron/ValidateEvent';
import { run as cotwVote } from '../events/cron/VoteEvent';
import { cyan } from 'chalk';

const globPromise = promisify(glob);

export default class Bot extends Client {
	// readonly members
	public readonly commands: Collection<string, Command> = new Collection();
	public readonly events: Collection<string, Event> = new Collection();
	public readonly logger: Consola = consola;
	// modifiable members
	public guild!: Guild | undefined;

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
			// caching options for threads and messages
			makeCache: Options.cacheWithLimits({
				// default thread sweeping behaviour
				...Options.defaultMakeCacheSettings,
				// sweep messages every 3 minutes
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
		super
			.login(process.env.DISCORD_TOKEN as string)
			.catch((e: unknown) => this.logger.error(e));

		// log into database
		connect(process.env.DATABASE_URI as string, {
			useCreateIndex: true,
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
			.then(() => {
				this.logger.success('UMIEEE database connection established!');
			})
			.catch((e: unknown) => this.logger.error(e));
	}

	public start(): void {
		// set up commands
		globPromise(`${__dirname}/../commands/**/*{.ts,.js}`)
			.then((commandFiles: string[]) => {
				commandFiles.map(async (value: string) => {
					import(value).then((file: Command) => {
						this.logger.info(`Registering command ${cyan(file.name)}...`);
						this.commands.set(file.name, file);
					});
				});
			})
			.catch((e: unknown) => this.logger.error(e));
		// set up events
		globPromise(`${__dirname}/../events/**/*{.ts,.js}`)
			.then((eventsFiles: string[]) => {
				eventsFiles.map(async (value: string) => {
					import(value).then((file: Event) => {
						this.logger.info(`Registering event ${cyan(file.name)}...`);
						this.events.set(file.name, file);
						this.on(file.name, file.run.bind(null, this));
					});
				});
			})
			.catch((e: unknown) => this.logger.error(e));

		// set up cron jobs
		new CronJob('0 0 * * MON', () => postAdvertisements(this)).start();
		new CronJob('0 0 * * MON', () => cotwVote(this)).start();
		new CronJob('0 0 * * *', () => validateMembers(this)).start();
	}

	public async sendEmbed(
		channel: TextChannel | NewsChannel,
		options: MessageEmbedOptions,
		color = 'BLUE',
	): Promise<void | Message> {
		return channel
			.send(new MessageEmbed({ ...options, color: color }))
			.catch((e: unknown) => this.logger.error(e));
	}

	public async sendReplyEmbed(
		message: Message,
		options: MessageEmbedOptions,
		color = 'RED',
	): Promise<void | Message> {
		return message.channel
			.send(new MessageEmbed({ ...options, color: color }))
			.catch((e: unknown) => this.logger.error(e));
	}
}
