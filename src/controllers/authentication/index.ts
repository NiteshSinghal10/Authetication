import { CookieOptions, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URL,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CODE_EXCHANGE_API,
  RESPONSE_MESSAGES,
  sendResponse,
  callOtherService,
  generateToken,
  getDeviceInfo,
  encrypt,
} from '../../lib';
import { validateTokenExchange } from '../../middleware';
import { getSession, updateUser, createSession } from '../../services';
import { IUser } from '../../interfaces';

const router = Router();

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.get('/sign-in', validateTokenExchange, async (req, res) => {
  try {
    const { code, aud, deviceType } = req.query;

    const data = {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
    };

    const googleResponse = await callOtherService<{ id_token: string }>(
      GOOGLE_CODE_EXCHANGE_API,
      'POST',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    // Step 1: Extract Google User info
    const googleResult = await client.verifyIdToken({
      idToken: googleResponse.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const userInfo = googleResult.getPayload();

    // Step 2: Upsert User
    const user = (await updateUser(
      { email: userInfo?.email },
      { name: userInfo?.name, picture: userInfo?.picture },
      { upsert: true },
    )) as IUser;

    // Step 3: Generate Access
    const uuid = uuidv4();

    const deviceId = req.cookies?.deviceId ? req.cookies.deviceId : uuidv4();

    const payload = {
      issuer: 'accounts.vibely.com',
      sub: user._id,
      name: user.name,
      email: user.email,
      uuid,
    };

    const accessToken = generateToken({ ...payload, aud }, 'access', {
      expiresIn: '15m',
    });

    // Step 4: create a login Session if doesn't exists.
    const isSessionExists = await getSession({ deviceId });

    if (!isSessionExists) {
      const refreshToken = generateToken(payload, 'refresh', {
        expiresIn: '15m',
      });
      const { deviceName, userAgent, ipAddress } = getDeviceInfo(req);
      const encryptedRefreshToken = encrypt(refreshToken);

      await createSession({
        deviceId,
        uuid,
        _user: user._id,
        deviceType,
        deviceName,
        ipAddress,
        userAgent,
        encryptedRefreshToken,
      });
    }

    // Step 5: Set access token & device Id in cookie.
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    };
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('deviceId', deviceId, cookieOptions);

    return sendResponse(
      res,
      200,
      true,
      RESPONSE_MESSAGES.en.success,
      deviceType !== 'WEB' ? accessToken : '',
    );
  } catch (error: any) {
    return sendResponse(res, 400, false, error);
  }
});

export const authController = router;
