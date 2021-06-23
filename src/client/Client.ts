import consola, { Consola } from 'consola';
import {
	Client,
	Collection,
	Intents,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';

import Command from '../interfaces/CommandStorage';
import Config from '../interfaces/ConfigStorage';
import Event from '../interfaces/EventStorage';

const globPromise = promisify(glob);

export default class Bot extends Client {
	public readonly logger: Consola = consola;
	public config: Config;
	public readonly commands: Collection<string, Command> = new Collection();
	public readonly events: Collection<string, Event> = new Collection();

	public constructor() {
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
	}

	public start(config: Config): void {
		this.config = config;
		super.login(config.token).catch((e: any) => this.logger.error(e));

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
			.catch((e: any) => this.logger.error(e));
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
			.catch((e: any) => this.logger.error(e));
	}

	public async sendReplyEmbed(
		message: Message,
		options: MessageEmbedOptions,
		color = 'RED'
	): Promise<void> {
		message.channel
			.send(new MessageEmbed({ ...options, color: color }))
			.catch((e: any) => this.logger.error(e));
		return new Promise<void>(() => Promise.resolve(null));
	}
}
