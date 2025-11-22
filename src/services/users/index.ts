import { IPopulate } from '../../interfaces';
import { USER } from '../../models';

export const createUser = (data: object) =>
  new Promise((resolve, reject) =>
    USER.create(data).then(resolve).catch(reject),
  );

export const getUser = (
  search: object,
  projection?: object,
  options?: object,
  populate?: IPopulate[],
) =>
  new Promise((resolve, reject) => {
    const query = USER.findOne(search, projection, options);

    if (populate && populate.length) {
      populate.forEach((pop) => query.populate(pop));
    }

    return query.lean().exec().then(resolve).catch(reject);
  });

export const getUsers = (
  search: object,
  projection: object,
  options: object,
  populate: IPopulate[],
) =>
  new Promise((resolve, reject) => {
    const query = USER.find(search, projection, options);

    if (populate.length) {
      populate.forEach((pop) => query.populate(pop));
    }

    return query.lean().exec().then(resolve).catch(reject);
  });

export const updateUser = (search: object, update: object, options: object) =>
  new Promise((resolve, reject) =>
    USER.findOneAndUpdate(search, update, options).then(resolve).catch(reject),
  );

export const updateUsers = (search: object, update: object, options: object) =>
  new Promise((resolve, reject) =>
    USER.updateMany(search, update, options).then(resolve).catch(reject),
  );
