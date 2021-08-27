import { model, Schema } from 'mongoose';
import Chump from '../types/ChumpType';

const ChumpSchema = new Schema<Chump>(
  {
    guildID: { type: String, required: true },
    week: { type: String, required: true },
    chumps: [{ type: String, required: true }],
  },
  {
    collection: 'chumps',
    minimize: false,
  },
);

// create composite primary key
ChumpSchema.index({ guildID: 1, week: 1 }, { unique: true });

export default model<Chump>('Chump', ChumpSchema);
