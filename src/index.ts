import Bot from './client/Client';
import Config from './interfaces/ConfigStorage';
import * as File from '../config.json';

new Bot().start(File as Config);
