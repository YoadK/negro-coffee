import { Document, Schema, model } from 'mongoose';

export interface IUserModel extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

const UserSchema = new Schema<IUserModel>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: { type: Number, required: true }
});

export const UserModel = model<IUserModel>('UserModel', UserSchema, 'users');