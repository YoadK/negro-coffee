import { ICategoryModel } from "../3-models/category-model";


class CategoriesService {

   
    
    // get All categories
    public getAllCategories(): Promise<ICategoryModel[]> {
        return ICategoryModel.find().exec();
    }

}

export const categoriesService = new CategoriesService();
