import { ObjectId } from 'mongodb'; // If you're using MongoDB types
import { ICategoryModel } from "./Icategory-model";

// This data structure supports category-based operations on products, including filtering.

/**
 * Represents a product with its associated categories.
 * This interface combines product information with an array of its categories,
 * typically used for the result of the getAllProductsWithCategories method.
 * It facilitates the filtering of products by their categories in the application.
 */
export interface ProductWithCategories {
    _id: ObjectId | string;
    name: string;
    description: string;
    product_weight_grams: number;
    price: number;
    imageName: string;
    imageUrl: string;
    categories: ICategoryModel[];
}

