import { model, Schema } from 'mongoose';
import { Nomination } from '../types/NominationType';

const NominationSchema = new Schema<Nomination>(
  {
    guildID: { type: String, required: true },
    week: { type: String, required: true },
    nominations: [
      {
        nominator: { type: String, required: true },
        nominee: { type: String, required: true },
        reason: { type: String, required: true },
        unique: true,
      },
    ],
    message: { type: String, unique: true },
  },
  {
    collection: 'nominations',
    minimize: false,
  },
);

// create composite primary key
NominationSchema.index({ guildID: 1, week: 1 }, { unique: true });

export default model<Nomination>('Nomination', NominationSchema);
