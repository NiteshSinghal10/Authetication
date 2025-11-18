import { connect } from 'mongoose';
import { MONGO_URI } from '../../lib';

export const dbLoader = async () => {
	await connect(String(MONGO_URI));
	console.log('Connected to MongoDB');
};
