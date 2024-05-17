import { Document, Schema, model } from "mongoose";
import { ProductModel } from "../3-models/product-model";
import { CategoryModel } from  "../3-models/category-model";

export interface IProductCategoryModel extends Document {
  productId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
}

const ProductCategorySchema = new Schema<IProductCategoryModel>({
  productId: { type: Schema.Types.ObjectId, ref: ProductModel, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: CategoryModel, required: true },
}, {
  versionKey: false,
});

export const productCategoryModel = model<IProductCategoryModel>("ProductCategoryModel", ProductCategorySchema, "productCategories");