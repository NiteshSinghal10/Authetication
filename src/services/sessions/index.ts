import { IPopulate } from '../../interfaces';
import { SESSION } from '../../models';

export const createSession = (data: object) =>
  new Promise((resolve, reject) =>
    SESSION.create(data).then(resolve).catch(reject),
  );

export const getSession = (
  search: object,
  projection?: object,
  options?: object,
  populate?: IPopulate[],
) =>
  new Promise((resolve, reject) => {
    const query = SESSION.findOne(search, projection, options);

    if (populate && populate.length) {
      populate.forEach((pop) => query.populate(pop));
    }

    return query.lean().exec().then(resolve).catch(reject);
  });

export const getSessions = (
  search: object,
  projection: object,
  options: object,
  populate: IPopulate[],
) =>
  new Promise((resolve, reject) => {
    const query = SESSION.find(search, projection, options);

    if (populate.length) {
      populate.forEach((pop) => query.populate(pop));
    }

    return query.lean().exec().then(resolve).catch(reject);
  });

export const updateSession = (
  search: object,
  update: object,
  options: object,
) =>
  new Promise((resolve, reject) =>
    SESSION.findOneAndUpdate(search, update, options)
      .then(resolve)
      .catch(reject),
  );

export const updateSessions = (
  search: object,
  update: object,
  options: object,
) =>
  new Promise((resolve, reject) =>
    SESSION.updateMany(search, update, options).then(resolve).catch(reject),
  );

export const deleteSession = (search: object) =>
  new Promise((resolve, reject) =>
    SESSION.findOneAndDelete(search).then(resolve).catch(reject),
  );
