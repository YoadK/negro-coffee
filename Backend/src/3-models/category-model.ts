import { Document, Schema, model } from "mongoose";

// Interface for CategoryModel
export interface ICategoryModel extends Document {
  name: string;
  description: string;
}

// Schema for CategoryModel
export const CategorySchema = new Schema<ICategoryModel>({
  name: {
    type: String,
    required: [true, "Missing category name"],
    unique: true,
    minlength: [2, "Category name is too short"],
    maxlength: [50, "Category name is too long"],
  },
  description: {
    type: String,
    maxlength: [200, "Category description is too long"],
  },
}, {
  versionKey: false,
});

// Model for CategoryModel
export const CategoryModel = model<ICategoryModel>("CategoryModel", CategorySchema, "categories");