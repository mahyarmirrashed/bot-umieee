import { PermissionResolvable } from 'discord.js';
import RunFunction from './RunFunctionStorage';

export default interface Command {
	maximumArguments: number;
	minimumArguments: number;
	name: string;
	permissions: PermissionResolvable[];
	run: RunFunction;
	usage: string;
}
