import { Schema, model } from 'mongoose';
import InactiveUser from '../types/InactiveUserType';

const InactiveUserSchema = new Schema<InactiveUser>(
  {
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    since: { type: Date, required: true },
  },
  {
    collection: 'inactiveUsers',
    minimize: false,
  },
);

// create composite primary key
InactiveUserSchema.index({ guildID: 1, userID: 1 }, { unique: true });

export default model<InactiveUser>('inactiveMember', InactiveUserSchema);
