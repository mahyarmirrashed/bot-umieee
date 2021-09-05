import { Snowflake } from 'discord.js';

type InactiveUser = {
  guildID: Snowflake;
  userID: Snowflake;
  since: Date;
};

export default InactiveUser;
