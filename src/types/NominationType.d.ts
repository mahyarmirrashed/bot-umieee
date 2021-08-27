import { Snowflake } from 'discord.js';

type Nomination = {
  guildID: Snowflake;
  week: string;
  nominations: readonly {
    nominator: Snowflake;
    nominee: Snowflake;
    reason: string;
  }[];
  message: Snowflake;
};
