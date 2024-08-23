import { Document, Schema, model, Types} from "mongoose";
import { IProductModel } from "./Iproduct-model";
import { ICategoryModel } from  "./Icategory-model";


export interface IProductCategoryModel extends Document {
  productId: Types.ObjectId;// old: Schema.Types.ObjectId;
  categoryIds: Types.ObjectId[];// old: Schema.Types.ObjectId[];
}

const ProductCategorySchema = new Schema<IProductCategoryModel>({
  productId: { type: Schema.Types.ObjectId, ref: IProductModel, required: true },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: ICategoryModel, required: true }],
}, {
  versionKey: false,
});

export const IProductCategoryModel = model<IProductCategoryModel>("ProductCategory", ProductCategorySchema, "productCategoryRelations");