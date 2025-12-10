import { CookieOptions, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

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
  ACCESS_TOKEN_EXPIRED_IN,
  GOOGLE_PEOPLE_API,
  validateToken,
} from '../../lib';
import { validateCheckSession, validateTokenExchange } from '../../middleware';
import {
  getSession,
  updateUser,
  createSession,
  deleteSession,
  getUser,
} from '../../services';
import {
  IError,
  IGooglePeople,
  ISession,
  ITokenPayload,
  IUser,
} from '../../interfaces';

const router = Router();

router.get('/token', validateTokenExchange, async (req, res) => {
  try {
    const { code, aud, deviceType } = req.query;

    const data = {
      code: code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
    };

    const googleResponse = await callOtherService<{ access_token: string }>(
      GOOGLE_CODE_EXCHANGE_API,
      'POST',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    // Step 1: Extract Google User info, gender & birthday
    const googleResult = await callOtherService<IGooglePeople>(
      `${GOOGLE_PEOPLE_API}?personFields=names,emailAddresses,photos,birthdays,genders,phoneNumbers`,
      'GET',
      {},
      {
        headers: {
          Authorization: `Bearer ${googleResponse.access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const userInfo = {
      firstName: googleResult.names?.find((obj) => obj.metadata.primary)
        ?.givenName,
      lastName: googleResult.names?.find((obj) => obj.metadata.primary)
        ?.familyName,
      picture: googleResult.photos?.find((obj) => obj.metadata.primary)?.url,
      email: googleResult.emailAddresses?.find((obj) => obj.metadata.primary)
        ?.value,
      gender: googleResult.genders?.find((obj) => obj.metadata.primary)?.value,
      dob: {
        year: googleResult.birthdays?.find((obj) => obj.metadata.primary)?.date
          .year,
        month: googleResult.birthdays?.find((obj) => obj.metadata.primary)?.date
          .month,
        day: googleResult.birthdays?.find((obj) => obj.metadata.primary)?.date
          .day,
      },
    };

    // Step 2: Upsert User
    const user = (await updateUser({ email: userInfo?.email }, userInfo, {
      upsert: true,
    })) as IUser;

    // Step 3: create a login Session if doesn't exists.
    const deviceId = req.cookies?.deviceId ? req.cookies.deviceId : uuidv4();
    const isSessionExists = (await getSession({ deviceId })) as ISession;
    const uuid =
      isSessionExists && String(isSessionExists._user) === String(user._id)
        ? isSessionExists.uuid
        : uuidv4();

    const payload = {
      issuer: 'accounts.vibely.com',
      sub: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      uuid,
    };

    // Makesure one session exists for one device one user.
    if (
      !isSessionExists ||
      (isSessionExists && String(isSessionExists._user) !== String(user._id))
    ) {
      const { deviceName, userAgent, ipAddress } = getDeviceInfo(req);

      if (
        isSessionExists &&
        String(isSessionExists._user) !== String(user._id)
      ) {
        await deleteSession({ _id: isSessionExists._id });
      }

      await createSession({
        deviceId,
        uuid,
        _user: user._id,
        deviceType,
        deviceName,
        ipAddress,
        userAgent,
      });
    }

    // Step 4: Generate Access
    const accessToken = generateToken({ ...payload, aud }, 'access', {
      expiresIn: `${ACCESS_TOKEN_EXPIRED_IN}m`,
    });

    // Step 5: Set access token & deviceIdin cookie if device type is WEB.
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.vib3ly.shop',
    };
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('deviceId', deviceId, cookieOptions);
    res.cookie('uuid', uuid, cookieOptions);
    res.cookie('_user', user, cookieOptions);

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

router.get('/check-session', validateCheckSession, async (req, res) => {
  try {
    const uuid = req.cookies?.uuid;
    const _user = req.cookies?._user;
    const deviceId = req.cookies?.deviceId;
    const { aud, deviceType } = req.query;
    const session = (await getSession({
      $or: [{ uuid }, { _user, deviceId }],
    })) as ISession;

    if (!session) {
      throw new Error(RESPONSE_MESSAGES.en.session_not_found);
    }

    const user = (await getUser({ _id: session._user })) as IUser;

    const payload = {
      issuer: 'accounts.vibely.com',
      sub: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      uuid,
    };

    const accessToken = generateToken({ ...payload, aud }, 'access', {
      expiresIn: `${ACCESS_TOKEN_EXPIRED_IN}d`,
    });

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    };
    res.cookie('accessToken', accessToken, cookieOptions);

    return sendResponse(
      res,
      200,
      true,
      RESPONSE_MESSAGES.en.success,
      deviceType !== 'WEB' ? accessToken : '',
    );
  } catch (error) {
    const err = error as IError;
    return sendResponse(res, 401, false, err.message);
  }
});

router.get('/my-profile', async (req, res) => {
  try {
    console.log("Ip :", req.ip)
    console.log('--', req.cookies);
    const token = req.cookies?.accessToken;

    // If token is not found then send the response with 401 status code.
    if (!token) {
      throw new Error(RESPONSE_MESSAGES.en.unauthorized);
    }

    const payload = validateToken(token) as ITokenPayload;

    const session = (await getSession({
      uuid: payload.uuid,
      _user: payload.sub,
    })) as ISession;

    if (!session) {
      throw new Error(RESPONSE_MESSAGES.en.session_not_found);
    }

    if (session.revoked) {
      throw new Error(RESPONSE_MESSAGES.en.session_revoked);
    }

    const user = await getUser({ _id: payload.sub });

    return sendResponse(res, 200, true, RESPONSE_MESSAGES.en.success, user);
  } catch (error) {
    const err = error as IError;
    return sendResponse(res, 401, false, err.message);
  }
});

export const authController = router;
