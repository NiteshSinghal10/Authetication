import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../lib';

export const validateTokenExchange = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = joi
    .object({
      code: joi.string(),
    })
    .validate(req.query);

  if (error) {
    return sendResponse(res, 400, false, error.message);
  }

  return next();
};
