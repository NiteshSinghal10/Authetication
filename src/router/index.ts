import { Router } from 'express';

import { authController } from '../controllers';

const router = Router();

router.use('/auth/token', authController);

export default router;
