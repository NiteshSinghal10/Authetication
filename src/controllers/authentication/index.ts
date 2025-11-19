import { Router } from 'express';

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CODE_EXCHANGE_API,
  RESPONSE_MESSAGES,
  sendResponse,
  callOtherService,
} from '../../lib';
import { validateTokenExchange } from '../../middleware';

const router = Router();

router.get('/', validateTokenExchange, async (req, res) => {
  try {
    const { code } = req.query;

    const data = {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
    };

    const googleResponse = await callOtherService(
      GOOGLE_CODE_EXCHANGE_API,
      'POST',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return sendResponse(
      res,
      200,
      true,
      RESPONSE_MESSAGES.en.success,
      googleResponse,
    );
  } catch (error: any) {
    return sendResponse(res, 400, false, error);
  }
});

export const authController = router;
