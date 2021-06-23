import { Snowflake } from 'discord.js';

export default interface Membership {
	discordID: Snowflake;
	ieeeID: string;
}
