import { config } from 'dotenv';
import Bot from './client/Client';

// set up environment variables from .env file
config();

new Bot().start();
