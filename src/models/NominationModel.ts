import { model, Schema } from 'mongoose';
import Nomination from '../interfaces/NominationStorage';

const NominationSchema: Schema = new Schema(
	{
		week: { type: String, required: true, unique: true },
		nominations: [
			{
				nominator: { type: String, required: true },
				nominee: { type: String, required: true },
				reason: { type: String, required: true },
			},
		],
		message: { type: String, unique: true },
	},
	{
		collection: 'nominations',
		minimize: false,
		strictQuery: true,
	}
);

export default model<Nomination>('Nomination', NominationSchema);
