import { model, Schema } from 'mongoose';
import Membership from '../types/MembershipType';

const MembershipSchema = new Schema<Membership>(
  {
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    ieeeID: { type: Number, required: true },
  },
  {
    collection: 'members',
    minimize: false,
  },
);

// create composite primary key
MembershipSchema.index({ guildID: 1, userID: 1 }, { unique: true });

export default model<Membership>('Member', MembershipSchema);
