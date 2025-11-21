import { Schema, model } from 'mongoose';

const dobSchema = new Schema(
  {
    year: {
      type: Number,
    },
    month: {
      type: Number,
    },
    day: {
      type: Number,
    },
  },
  { _id: false },
);

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    picture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    dob: {
      type: dobSchema,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true },
);

export const USER = model('user', schema);
