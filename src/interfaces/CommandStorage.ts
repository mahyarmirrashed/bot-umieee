import { PermissionResolvable } from 'discord.js';
import RunFunction from './RunFunctionStorage';

export default interface Command {
	listWhite: string[];
	listBlack: string[];
	maximumArguments: number;
	minimumArguments: number;
	name: string;
	permissions: PermissionResolvable[];
	run: RunFunction;
	usage: string;
}
