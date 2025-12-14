export interface IUser {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  picture?: string;
  dob?: {
    year: number;
    month: number;
    day: number;
  };
  gender?: string;
}

export interface ITokenPayload {
  issuer: string;
  sub: string;
  name: string;
  email: string;
  uuid: string;
}

export interface ILocation {
  city: string;
  region: string;
  country_name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  country_code_iso3: string;
  timezone: string;
  currency: string;
  languages: string;
}
