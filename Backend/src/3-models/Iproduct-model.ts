import { UploadedFile } from "express-fileupload";
import mongoose, { Document, Schema, model, Types } from "mongoose";
import { ICategoryModel } from "./Icategory-model"; // Adjust the path as necessary

// Interface for IProductModel
export interface IProductModel extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  product_weight_grams: number;
  price: number;
  image?: UploadedFile;
  imageName?: string;
  imageUrl?: string;
  categoryIds?: Types.ObjectId[]; // me: should be filled up using 'populate' method (mongoose)
  categories?: ICategoryModel[]; // Added for virtual field
}

// Schema for IProductModel
export const ProductSchema = new Schema<IProductModel>(
  {
    name: {
      type: String,
      required: [true, "Missing product name"],
      minlength: [2, "Product name is too short"],
      maxlength: [100, "Product name is too long"],
    },
    description: {
      type: String,
      maxlength: [500, "Product description is too long"],
    },
    product_weight_grams: {
      type: Number,
      required: [true, "Missing product weight in grams"],
      min: [0, "Product weight in grams can't be negative"],
      max: [2000, "Product weight in grams can't exceed 2000 grams"],
    },
    price: {
      type: Number,
      required: [true, "Missing product price"],
      min: [1, "Price can't be negative"],
      max: [1000, "Price can't exceed 1000"],
    },
    imageName: {
      type: String,
      maxlength: [100, "Image name is too long"],
    },
    imageUrl: {
      type: String,
      maxlength: [500, "Image URL is too long"],
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    versionKey: false,
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true },
    id: false,
  }
);

// Add virtual field for categories
ProductSchema.virtual('categories', {
  ref: 'Category',
  localField: 'categoryIds',
  foreignField: '_id',
  justOne: false,
});

// Model for IProductModel
export const Product = model<IProductModel>("Product", ProductSchema, "products");
