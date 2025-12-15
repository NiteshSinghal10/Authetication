import { Request, Response, Router } from 'express';
import { getErrorMessage, RESPONSE_MESSAGES, sendResponse } from '../../lib';
import { getUsers } from '../../services';
import { IGetQuery } from '../../interfaces';

const router = Router();

router.get('/users', async (req: Request, res: Response) => {
  try {
    const {
      search = {},
      project = {},
      options = {},
    } = req.query as unknown as IGetQuery;

    const users = await getUsers(search, project, options, []);

    return sendResponse(res, 200, true, RESPONSE_MESSAGES.en.success, users);
  } catch (error) {
    return sendResponse(res, 400, false, getErrorMessage(error));
  }
});

export const internalController = router;
