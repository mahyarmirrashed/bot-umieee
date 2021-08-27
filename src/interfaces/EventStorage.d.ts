import Handler from './HandlerStorage';

export default interface Event {
  cronJobFrequency?: string;
  name: string;
  handler: Handler;
}
