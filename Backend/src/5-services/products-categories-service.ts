import { IProductWithCategories, IProductWithCategoriesModel } from '../3-models/IProductWithCategories-model';
import { IProductModel } from '../3-models/Iproduct-model';
import { ICategoryModel } from '../3-models/Icategory-model';
import { ValidationError, ResourceNotFoundError } from '../3-models/client-errors';
import mongoose from 'mongoose';

class ProductsCategoriesService {

    async createOrUpdateProduct(productData: Partial<IProductWithCategories>): Promise<IProductWithCategories> {
        try {
            if (!productData.name) {
                throw new ValidationError("Product name is required");
            }

            let product = await IProductWithCategoriesModel.findOne({ name: productData.name });

            if (product) {
                Object.assign(product, productData);
                await product.save();
            } else {
                product = new IProductWithCategoriesModel(productData);
                await product.save();
            }

            return product;
        } catch (error) {
            console.error("Error creating or updating product:", error);
            throw error;
        }
    }

    async findProductById(productId: string): Promise<IProductWithCategories | null> {
        try {
            return await IProductWithCategoriesModel.findById(productId).populate('categories');
        } catch (error) {
            console.error("Error finding product by ID:", error);
            throw error;
        }
    }

    async deleteProduct(productId: string): Promise<boolean> {
        try {
            const result = await IProductWithCategoriesModel.findByIdAndDelete(productId);
            return !!result;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }

    async addCategoryToProduct(productId: string, categoryId: string): Promise<IProductWithCategories | null> {
        try {
            const product = await IProductWithCategoriesModel.findByIdAndUpdate(
                productId,
                { $addToSet: { categories: categoryId } },
                { new: true }
            ).populate('categories');

            if (!product) {
                throw new ResourceNotFoundError(productId);
            }

            return product;
        } catch (error) {
            console.error("Error adding category to product:", error);
            throw error;
        }
    }

    async removeCategoryFromProduct(productId: string, categoryId: string): Promise<IProductWithCategories | null> {
        try {
            const product = await IProductWithCategoriesModel.findByIdAndUpdate(
                productId,
                { $pull: { categories: categoryId } },
                { new: true }
            ).populate('categories');

            if (!product) {
                throw new ResourceNotFoundError(productId);
            }

            return product;
        } catch (error) {
            console.error("Error removing category from product:", error);
            throw error;
        }
    }

    async updateProductCategories(productId: string, categories: string[]): Promise<IProductWithCategories | null> {
        try {
            const product = await IProductWithCategoriesModel.findByIdAndUpdate(
                productId,
                { $set: { categories: categories } },
                { new: true }
            ).populate('categories');

            if (!product) {
                throw new ResourceNotFoundError(productId);
            }

            return product;
        } catch (error) {
            console.error("Error updating product categories:", error);
            throw error;
        }
    }

    async syncProductWithCategories(productId: string): Promise<void> {
        try {
            console.log(`Syncing product with ID: ${productId}`);
    
            // Fetch the product from the products collection
            const product = await IProductModel.findById(productId);
            if (!product) {
                console.log(`Product with ID ${productId} not found`);
                throw new ResourceNotFoundError(productId);
            }
    
            // Fetch the categories associated with this product from the ProductWithCategories collection
            const productWithCategories = await IProductWithCategoriesModel.findById(productId).populate<{ categories: ICategoryModel[] }>('categories');
            const categoryIds = productWithCategories?.categories.map(cat=> cat._id) || [];
    
            // Fetch the full category objects
            //const categories = await ICategoryModel.find({ _id: { $in: categoryIds } });
            const categories = await ICategoryModel.find({ _id: { $in: categoryIds as mongoose.Types.ObjectId[] } });


            console.log(`Found ${categories.length} categories for product`);
    
            // Create or update the entry in the ProductWithCategories collection
            const updatedProduct = await IProductWithCategoriesModel.findOneAndUpdate(
                { _id: productId },
                {
                    name: product.name,
                    description: product.description,
                    product_weight_grams: product.product_weight_grams,
                    price: product.price,
                    imageName: product.imageName,
                    imageUrl: product.imageUrl,
                    categories: categories.map(cat => ({
                        _id: cat._id,
                        name: cat.name,
                        description: cat.description
                    }))
                },
                { upsert: true, new: true }
            );
    
            console.log(`Product with categories synced successfully: ${updatedProduct?._id}`);
        } catch (error) {
            console.error("Error in syncProductWithCategories:", error);
            throw error;
        }
    }

    async removeProductFromProductWithCategories(productId: string): Promise<void> {
        try {
            await IProductWithCategoriesModel.findByIdAndDelete(productId);
        } catch (error) {
            console.error("Error removing product from ProductWithCategories:", error);
            throw error;
        }
    }

    
}

export const productsCategoriesService = new ProductsCategoriesService();