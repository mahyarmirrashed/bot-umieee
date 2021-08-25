import { model, Schema } from 'mongoose';
import Chump from '../types/ChumpType';

const ChumpSchema: Schema = new Schema(
	{
		week: { type: String, required: true, unique: true },
		chumps: [{ type: String, required: true }],
	},
	{
		collection: 'chumps',
		minimize: false,
		strictQuery: true,
	},
);

export default model<Chump>('Chump', ChumpSchema);
