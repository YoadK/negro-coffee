import { CategoryModel, ICategoryModel } from "../3-models/category-model";


class CategoriesService {

   
    
    // get All categories
    public getAllCategories(): Promise<ICategoryModel[]> {
        return CategoryModel.find().exec();
    }

}

export const categoriesService = new CategoriesService();
