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
    
}//CategoriesService END




export const categoriesService = new CategoriesService();