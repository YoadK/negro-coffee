import { isValidObjectId, Types } from 'mongoose';
import { ICategoryModel } from "../3-models/Icategory-model";
import { IProductModel } from "../3-models/Iproduct-model";
import { IProductCategoryModel } from "../3-models/IproductCategory-Model";
import { ProductWithCategories } from "../3-models/IproductsWithCategories";

class CategoriesService {
    // get All categories
    public getAllCategories(): Promise<ICategoryModel[]> {
        return ICategoryModel.find().exec();
    }


    

}//CategoriesService END

export const categoriesService = new CategoriesService();