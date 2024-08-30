import mongoose, { Document, Schema, Model } from 'mongoose';
import { ICategoryModel } from "./Icategory-model"; // Assuming you have this model defined

export interface IProductWithCategories extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    product_weight_grams: number;
    price: number;
    imageName: string;
    imageUrl: string;
    categories: ICategoryModel['_id'][]; // Ensuring type safety for category IDs
}

const ProductWithCategoriesSchema = new Schema<IProductWithCategories>({
    name: { type: String, required: true },
    description: { type: String },
    product_weight_grams: { type: Number, required: true },
    price: { type: Number, required: true },
    imageName: { type: String },
    imageUrl: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
}, {
    versionKey: false
});

export const IProductWithCategoriesModel = mongoose.model<IProductWithCategories>('ProductWithCategories', ProductWithCategoriesSchema);
// IProductWithCategories: This is an interface that defines the structure of a product with categories. provides type checking and autocompletion in your TypeScript code.
// IProductWithCategoriesModel: This is the Mongoose model created from the schema. used for database operations.