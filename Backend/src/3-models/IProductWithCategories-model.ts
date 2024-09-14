import { Document, Schema, model, Types } from 'mongoose';


export interface IProductWithCategories extends Document {
    productId: Types.ObjectId;
    categoryIds: Types.ObjectId[];
}

const ProductWithCategoriesSchema = new Schema<IProductWithCategories>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
}, {
    versionKey: false
});

export const IProductWithCategoriesModel = model<IProductWithCategories>('ProductWithCategories', ProductWithCategoriesSchema, 'productCategoryRelations');
// IProductWithCategories: This is an interface that defines the structure of a product with categories. provides type checking and autocompletion in your TypeScript code.
// IProductWithCategoriesModel: This is the Mongoose model created from the schema. used for database operations.