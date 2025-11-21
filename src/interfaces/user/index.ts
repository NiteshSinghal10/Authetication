export interface IUser {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface ITokenPayload {
  issuer: string;
  sub: string;
  name: string;
  email: string;
  uuid: string;
}
