import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const USER = model('user', schema);
