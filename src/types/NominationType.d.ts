import { Snowflake } from 'discord.js';

type Nomination = {
	week: string;
	nominations: { nominator: Snowflake; nominee: Snowflake; reason: string }[];
	message: Snowflake;
};

export default Nomination;
