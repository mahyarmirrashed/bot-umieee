import { Snowflake } from 'discord-api-types';

type Chump = {
  guildID: Snowflake;
  week: string;
  chumps: readonly Snowflake[];
};

export default Chump;
