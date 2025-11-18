import { appLoader, dbLoader } from './src/loaders';

const startServer = async () => {
	await dbLoader();
	appLoader();
};

startServer();
