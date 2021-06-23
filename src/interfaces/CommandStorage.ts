import { PermissionResolvable } from 'discord.js';
import RunFunction from './RunFunctionStorage';
import UsageFunction from './UsageFunctionStorage';

export default interface Command {
	maximumArguments: number;
	minimumArguments: number;
	name: string;
	permissions: PermissionResolvable[];
	run: RunFunction;
	usage: UsageFunction;
}
