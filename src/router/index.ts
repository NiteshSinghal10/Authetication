import { Router } from 'express';

import { authController } from '../controllers';

const router = Router();

router.use('/auth', authController);

export default router;
