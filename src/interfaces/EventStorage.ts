import RunFunction from './RunFunctionStorage';

export default interface Event {
	name: string;
	run: RunFunction;
}
