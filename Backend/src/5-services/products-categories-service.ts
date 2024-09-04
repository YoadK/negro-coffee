import { IProductModel } from '../3-models/Iproduct-model';
import { ICategoryModel } from '../3-models/Icategory-model';
import { IProductWithCategories, IProductWithCategoriesModel } from '../3-models/IProductWithCategories-model';
import { ResourceNotFoundError } from '../3-models/client-errors';
import mongoose, { Types } from 'mongoose';


class ProductsCategoriesService {


    async getAllProductCategoryAssociations(): Promise<IProductWithCategories[]> {
        return IProductWithCategoriesModel.find();
    }

   

   


    async updateProductCategories(productId: string, categoryIds: string[]): Promise<IProductWithCategories> {
        const product = await IProductModel.findById(productId);
        if (!product) {
            throw new ResourceNotFoundError(productId);
        }

             // Convert string IDs to ObjectIds
             // We're converting string IDs to ObjectId types using new Types.ObjectId(id).
             const categoryObjectIds = categoryIds.map(id => new Types.ObjectId(id));

         let productCategories: IProductWithCategories | null = await IProductWithCategoriesModel.findOne({ productId });
        if (!productCategories) {
            productCategories = new IProductWithCategoriesModel({ 
                productId: new Types.ObjectId(productId), 
                categoryIds: categoryObjectIds 
            });
        } else {
            productCategories.categoryIds = categoryObjectIds;
        }

        await productCategories.save();
        return productCategories;
    }

    async syncProductWithCategories(productId: string): Promise<void> {
        const product = await IProductModel.findById(productId);
        if (!product) {
            throw new ResourceNotFoundError(productId);
        }
    
        let productCategories = await IProductWithCategoriesModel.findOne({ productId: new Types.ObjectId(productId) });
        if (!productCategories) {
            // If it's a new product, associate it with all categories
            const allCategoryIds = await ICategoryModel.find().distinct('_id');
            productCategories = new IProductWithCategoriesModel({
                productId: new Types.ObjectId(productId),
                categoryIds: allCategoryIds // This is already an array of ObjectIds
            });
        }
        // If it's an existing product, we keep its current category associations
    
        await productCategories.save();
        console.log(`Product with ID ${productId} synced with categories.`);
    }


    async handleProductDeletion(productId: string): Promise<void> {
        console.log(`Handling deletion of product with ID: ${productId}`);
        
        try {
            // Remove the product's entry from the productCategoryRelations collection
            const result = await IProductWithCategoriesModel.findOneAndDelete({ productId });
            
            if (result) {
                console.log(`Product ${productId} removed from category associations.`);
            } else {
                console.log(`No category associations found for product ${productId}.`);
            }
        } catch (error) {
            console.error(`Error handling product deletion for ID ${productId}:`, error);
            throw error;
        }
    }
}

export const productsCategoriesService = new ProductsCategoriesService();