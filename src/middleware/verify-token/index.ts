import { Request, Response, NextFunction } from 'express';
import { IError, ISession, ITokenPayload } from '../../interfaces';
import { RESPONSE_MESSAGES, sendResponse, validateToken } from '../../lib';
import { getSession } from '../../services';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;

    // If token is not found then send the response with 401 status code.
    if (!token) {
      throw new Error(RESPONSE_MESSAGES.en.unauthorized);
    }

    const payload = validateToken(token) as ITokenPayload;

    req.user = payload;

    const session = (await getSession({ uuid: payload.uuid })) as ISession;

    console.log({ uuid: payload.uuid });

    if (!session) {
      throw new Error(RESPONSE_MESSAGES.en.session_not_found);
    }

    if (session.revoked) {
      throw new Error(RESPONSE_MESSAGES.en.session_revoked);
    }

    return next();
  } catch (error) {
    const err = error as IError;
    return sendResponse(res, 401, false, err.message);
  }
};
