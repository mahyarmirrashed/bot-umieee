import { Snowflake } from 'discord.js';

type Membership = {
  guildID: Snowflake;
  userID: Snowflake;
  ieeeID: number;
};

export default Membership;
