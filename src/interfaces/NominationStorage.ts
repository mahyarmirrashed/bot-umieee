import { Snowflake } from 'discord.js';

export default interface Nomination {
	week: string;
	nominations: { nominator: Snowflake; nomineee: Snowflake; reason: string }[];
}
