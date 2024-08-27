import { ICategoryModel } from "../3-models/Icategory-model";


class CategoriesService {
    // get All categories
    public getAllCategories(): Promise<ICategoryModel[]> {
        return ICategoryModel.find().exec();
    }
}//CategoriesService END

export const categoriesService = new CategoriesService();