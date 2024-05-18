import { Document, Schema, model } from "mongoose";
import { IProductModel } from "../3-models/product-model";
import { ICategoryModel } from  "../3-models/category-model";
import { Interface } from "readline";

export interface IProductCategoryModel extends Document {
  productId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
}

const ProductCategorySchema = new Schema<IProductCategoryModel>({
  productId: { type: Schema.Types.ObjectId, ref: IProductModel, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: ICategoryModel, required: true },
}, {
  versionKey: false,
});

export const IProductCategoryModel = model<IProductCategoryModel>("ProductCategory", ProductCategorySchema, "productCategories");