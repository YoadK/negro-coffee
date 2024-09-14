import { networkInterfaces } from "node:os";
import { ICategoryModel } from "../3-models/Icategory-model";
import { productsCategoriesService } from "./products-categories-service";
import { Types } from "mongoose";


class CategoriesService {

    // get All categories
    public getAllCategories(): Promise<ICategoryModel[]> {
        return ICategoryModel.find().exec();
    }

    public async deleteCategory(categoryId: string): Promise<void> {
        try {
            await ICategoryModel.findByIdAndDelete(categoryId);            
            // New: Remove the category from all products in productCategoryRelations
            await productsCategoriesService.removeCategoryFromProducts(new Types.ObjectId(categoryId));
        } catch (err: any) {
            throw err;
        }
    }

    
    public async getAllCategoryIds(): Promise<Types.ObjectId[]> {
        const categories = await ICategoryModel.find().select('_id');
        // By explicitly casting category._id to Types.ObjectId, we ensure that
        // the return type matches the method's signature.
        return categories.map(category => category._id as Types.ObjectId);
    }

    
}//CategoriesService END




export const categoriesService = new CategoriesService();