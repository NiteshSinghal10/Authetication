import { Router } from 'express';

import { authController, internalController } from '../controllers';
import { sendResponse } from '../lib';
import { verifyToken } from '../middleware';

const router = Router();

router.use('/auth', authController);

router.use('/internal', internalController);

router.use('/test', verifyToken, async (req, res) => {
  try {
    return sendResponse(res, 200, true, 'Successfully', req.user);
  } catch (error) {
    return sendResponse(res, 400, false, 'Error', error);
  }
});

export default router;
