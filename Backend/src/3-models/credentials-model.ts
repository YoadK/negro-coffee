import { Schema } from "mongoose";

export interface ICredentialsModel {
    email: string;
    password: string;
  }

  // Schema for ICategoryModel
export const CredentialsSchema = new Schema<ICredentialsModel>({
    email: {
      type: String,
      required: [true, "Missing email"],
      unique: true,
      minlength: [2, "email name is too short"],
      maxlength: [50, "email name is too long"],
    },
    password: {
      type: String,
      required: [true, "Missing password"],
      minlength: [4, "password  is too short"],
      maxlength: [50, "password  is too long"],
    },
  }, {
    versionKey: false,
  });
  