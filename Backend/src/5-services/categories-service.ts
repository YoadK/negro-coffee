import { ResourceNotFoundError } from "../3-models/client-errors";

import { Category, ICategoryModel } from "../3-models/Icategory-model";
import { Product } from "../3-models/Iproduct-model";


import { Types } from "mongoose";


class CategoriesService {

    // get All categories
    public getAllCategories(): Promise<ICategoryModel[]> {
        return Category.find().exec();
    }

    public async deleteCategory(categoryId: string): Promise<void> {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new ResourceNotFoundError(`Category with ID ${categoryId} not found`);
            }
    
            // Delete the category
            await Category.findByIdAndDelete(categoryId);
    
            // Remove the category reference from all products
            await Product.updateMany(
                {},
                { $pull: { categoryIds: new Types.ObjectId(categoryId) } }).exec();
        } catch (err: any) {
            throw err;
        }
    }

    
    public async getAllCategoryIds(): Promise<Types.ObjectId[]> {
        const categories = await Category.find().select('_id');
        // By explicitly casting category._id to Types.ObjectId, we ensure that
        // the return type matches the method's signature.
        return categories.map(category => category._id as Types.ObjectId);
    }

    
}//CategoriesService END




export const categoriesService = new CategoriesService();