import Bot from '../client/Client';

export default interface Handler<T = Record<string, never>> {
  (client: Bot, args: T = null): Promise<void>;
}
