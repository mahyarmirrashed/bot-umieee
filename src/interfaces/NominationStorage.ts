import { Snowflake } from 'discord.js';

export default interface Nomination {
	week: string;
	nominations: { nominator: Snowflake; nominee: Snowflake; reason: string }[];
    message: Snowflake;
}
