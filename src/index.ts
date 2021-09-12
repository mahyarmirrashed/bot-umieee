import { config } from 'dotenv';
import Bot from './client/Client';

// set up environment variables from .env file
config();

// ensure environment variables are set
if (
  [
    process.env.CLIENT_ID,
    process.env.DATABASE_URI,
    process.env.DISCORD_TOKEN,
    process.env.MEMBERSHIP_VALIDATOR_CLIENT_ID,
    process.env.MEMBERSHIP_VALIDATOR_CLIENT_SECRET,
  ].every((envVar: string | undefined) => envVar)
) {
  new Bot().start();
} else {
  // eslint-disable-next-line no-console
  console.error('One or more environment variables are not set.');
}
