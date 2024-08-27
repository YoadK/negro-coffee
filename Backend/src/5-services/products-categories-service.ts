import { IProductWithCategoriesModel } from '../3-models/IProductWithCategories-model';
import mongoose from 'mongoose';

class ProductsCategoriesService {
    async createOrUpdateProduct(productData: Partial<mongoose.Document & IProductWithCategoriesModel>): Promise<mongoose.Document & IProductWithCategoriesModel> {
        try {
            if (!productData.name) {
                throw new Error("Product name is required");
            }

            let product = await IProductWithCategoriesModel.findOne({ name: productData.name });

            if (product) {
                // Update existing product
                Object.assign(product, productData);
                await product.save();
            } else {
                // Create new product
                product = new IProductWithCategoriesModel(productData);
                await product.save();
            }

            return product;
        } catch (error) {
            console.error("Error creating or updating product:", error);
            throw error;
        }
    }

    async findProductById(productId: string): Promise<mongoose.Document & IProductWithCategoriesModel | null> {
        try {
            const product = await IProductWithCategoriesModel.findById(productId).populate('categories');
            return product;
        } catch (error) {
            console.error("Error finding product by ID:", error);
            throw error;
        }
    }

    async deleteProduct(productId: string): Promise<boolean> {
        try {
            const result = await IProductWithCategoriesModel.findByIdAndDelete(productId);
            return result !== null;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }

    async addCategoryToProduct(productId: string, categoryId: string): Promise<mongoose.Document & IProductWithCategoriesModel | null> {
        try {
            const updatedProduct = await IProductWithCategoriesModel.findByIdAndUpdate(
                productId,
                { $addToSet: { categories: categoryId } },
                { new: true, runValidators: true }
            ).populate('categories');
            return updatedProduct;
        } catch (error) {
            console.error("Error adding category to product:", error);
            throw error;
        }
    }

    async removeCategoryFromProduct(productId: string, categoryId: string): Promise<mongoose.Document & IProductWithCategoriesModel | null> {
        try {
            const updatedProduct = await IProductWithCategoriesModel.findByIdAndUpdate(
                productId,
                { $pull: { categories: categoryId } },
                { new: true }
            ).populate('categories');
            return updatedProduct;
        } catch (error) {
            console.error("Error removing category from product:", error);
            throw error;
        }
    }
}

export const productsCategoriesService = new ProductsCategoriesService();