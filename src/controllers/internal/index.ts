import { Request, Response, Router } from 'express';
import { getErrorMessage, RESPONSE_MESSAGES, sendResponse } from '../../lib';
import { getUsers } from '../../services';

const router = Router();

router.post('/users', async (req: Request, res: Response) => {
  try {
    const {
      search = {},
      project = {},
      options = {},
      searchValue = '',
    } = req.body;

    const regex = new RegExp(searchValue.trim(), 'i');

    const users = await getUsers(
      {
        ...search,
        ...(searchValue
          ? { $or: [{ firstName: regex }, { lastName: regex }] }
          : {}),
      },
      project,
      options,
      [],
    );

    return sendResponse(res, 200, true, RESPONSE_MESSAGES.en.success, users);
  } catch (error) {
    return sendResponse(res, 400, false, getErrorMessage(error));
  }
});

export const internalController = router;
