export interface ISession {
  _id: string;
  uuid: string;
  _user: string;
  deviceName: string;
  deviceType: string;
  ipAddress: string;
  deviceId: string;
  userAgent: string;
  revoked: boolean;
  revokedAt: Date;
}
