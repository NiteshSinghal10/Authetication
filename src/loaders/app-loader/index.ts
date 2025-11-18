import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { PORT } from '../../lib';
import router from '../../router';

const app = express();

export const appLoader = () => {
	app.use(express.json());

	app.use(
		cors({
			origin: '*', // Allow all origins. Change as needed for production.
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
		})
	);

	app.use(morgan('dev'));

	app.use('/api/v1', router);

	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
};
