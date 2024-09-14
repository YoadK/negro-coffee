
import { ICategoryModel } from '../3-models/Icategory-model';
import { IProductWithCategories, IProductWithCategoriesModel } from '../3-models/IProductWithCategories-model';
import { ResourceNotFoundError } from '../3-models/client-errors';
import mongoose, { Types } from 'mongoose';
import { IProductModel } from '../3-models/Iproduct-model';


class ProductsCategoriesService {


    async getAllProductCategoryAssociations(): Promise<IProductWithCategories[]> {
        return IProductWithCategoriesModel.find();
    }

    // New method to get product categories
    async getProductCategories(productId: Types.ObjectId): Promise<IProductWithCategories | null> {
        return IProductWithCategoriesModel.findOne({ productId });
    }

    // New method: Add a product to all categories
    async addProductToCategories(productId: Types.ObjectId, categoryIds: Types.ObjectId[]): Promise<void> {
        const product = await IProductModel.findById(productId);
        if (!product) {
            throw new ResourceNotFoundError(productId.toString());
        }
      

        // Create a new product-category association
        const productCategories = new IProductWithCategoriesModel({
            productId,
            categoryIds
        });
        await productCategories.save();
    }


    async updateProductCategories(productId: Types.ObjectId, categoryIds: Types.ObjectId[]): Promise<IProductWithCategories> {
        const product = await IProductModel.findById(productId);
        if (!product) {
            throw new ResourceNotFoundError(productId.toString());
        }
      
        // We're converting string IDs to ObjectId types using new Types.ObjectId(id).
        
        let productCategories=  await IProductWithCategoriesModel.findOne({ productId });
        if (!productCategories) {
            productCategories = new IProductWithCategoriesModel({
                productId,
                categoryIds
            });
        } else {            
            productCategories.categoryIds = categoryIds;
        }
        await productCategories.save();
        return productCategories;
    }

    // New method: Remove a product from all categories
    async removeProductFromCategories(productId: Types.ObjectId): Promise<void> {
        await IProductWithCategoriesModel.findOneAndDelete({ productId: productId });
    }

    // New method: Remove a category from all products
    async removeCategoryFromProducts(categoryId: Types.ObjectId): Promise<void> {
        await IProductWithCategoriesModel.updateMany(
            { categoryIds: categoryId },
            { $pull: { categoryIds: categoryId} }
        );
    }

    async syncProductWithCategories(productId: Types.ObjectId): Promise<void> {
        const product = await IProductModel.findById(productId);
        if (!product) {
            throw new ResourceNotFoundError(productId.toString());
        }
        let productCategories = await IProductWithCategoriesModel.findOne({ productId:  Types.ObjectId });
        if (!productCategories) {
            // If it's a new product, associate it with all categories
            const allCategoryIds = await ICategoryModel.find().distinct('_id');
            productCategories = new IProductWithCategoriesModel({
                productId,
                categoryIds:allCategoryIds
            });
        }
        // If it's an existing product, we keep its current category associations
        await productCategories.save();
        console.log(`Product with ID ${productId} synced with categories.`);
    }


    async handleProductDeletion(productId: Types.ObjectId): Promise<void> {
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