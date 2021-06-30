import consola, { Consola } from 'consola';
import {
	Client,
	Collection,
	Guild,
	Intents,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
	NewsChannel,
	TextChannel,
} from 'discord.js';
import glob from 'glob';
import { connect } from 'mongoose';
import { promisify } from 'util';

import Command from '../interfaces/CommandStorage';
import Event from '../interfaces/EventStorage';

const globPromise = promisify(glob);

export default class Bot extends Client {
	// readonly members
	public readonly commands: Collection<string, Command> = new Collection();
	public readonly events: Collection<string, Event> = new Collection();
	public readonly logger: Consola = consola;
	// modifiable members
	public guild!: Guild | undefined;

	public constructor() {
		// setup client connection options
		super({
			ws: {
				intents: [
					Intents.FLAGS.GUILDS,
					Intents.FLAGS.GUILD_EMOJIS,
					Intents.FLAGS.GUILD_MEMBERS,
					Intents.FLAGS.GUILD_MESSAGES,
					Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				],
			},
			messageCacheLifetime: 180,
			messageCacheMaxSize: 200,
			messageEditHistoryMaxSize: 200,
			messageSweepInterval: 180,
		});

		// log into client
		super
			.login(process.env.DISCORD_BOT_TOKEN as string)
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
						this.logger.log(`Registering command "${file.name}"...`);
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
						this.logger.log(`Registering event "${file.name}"...`);
						this.events.set(file.name, file);
						this.on(file.name, file.run.bind(null, this));
					});
				});
			})
			.catch((e: unknown) => this.logger.error(e));
	}

	public async sendEmbed(
		channel: TextChannel | NewsChannel,
		options: MessageEmbedOptions,
		color = 'BLUE'
	): Promise<void | Message> {
		return channel
			.send(new MessageEmbed({ ...options, color: color }))
			.catch((e: unknown) => this.logger.error(e));
	}

	public async sendReplyEmbed(
		message: Message,
		options: MessageEmbedOptions,
		color = 'RED'
	): Promise<void | Message> {
		return message.channel
			.send(new MessageEmbed({ ...options, color: color }))
			.catch((e: unknown) => this.logger.error(e));
	}
}
