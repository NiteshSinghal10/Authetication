import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { DEVICE_TYPE, sendResponse } from '../../lib';

export const validateTokenExchange = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = joi
    .object({
      code: joi.string().required(),
      aud: joi.string().required(),
      deviceType: joi
        .string()
        .valid(...DEVICE_TYPE)
        .required(),
    })
    .validate(req.query);

  if (error) {
    return sendResponse(res, 400, false, error.message);
  }

  return next();
};

export const validateCheckSession = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = joi
    .object({
      aud: joi.string().required(),
      deviceType: joi
        .string()
        .valid(...DEVICE_TYPE)
        .required(),
    })
    .validate(req.query);

  if (error) {
    return sendResponse(res, 400, false, error.message);
  }

  return next();
};
