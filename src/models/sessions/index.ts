import { Schema, model } from 'mongoose';
import { DEVICE_TYPE, REFRESH_TOKEN_EXPIRED_IN } from '../../lib';

const schema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    _user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      enum: DEVICE_TYPE,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    encryptedRefreshToken: {
      type: String,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * REFRESH_TOKEN_EXPIRED_IN
    }
  },
  { timestamps: true },
);

export const SESSION = model('session', schema);
