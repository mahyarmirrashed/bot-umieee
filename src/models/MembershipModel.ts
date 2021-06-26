import { model, Schema } from 'mongoose';
import Membership from '../types/MembershipType';

const MembershipSchema: Schema = new Schema(
	{
		discordID: { type: String, required: true, unique: true },
		ieeeID: { type: String, required: true, unique: true },
	},
	{
		collection: 'members',
		minimize: false,
		strictQuery: true,
	}
);

export default model<Membership>('Member', MembershipSchema);
