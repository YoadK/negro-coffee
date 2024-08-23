import { isValidObjectId, Types } from 'mongoose';
import { ICategoryModel } from "../3-models/Icategory-model";
import { IProductModel } from "../3-models/Iproduct-model";
import { IProductCategoryModel } from "../3-models/IproductCategory-Model";
import { ProductWithCategories } from "../3-models/IproductsWithCategories";

class ProductsCategoriesService {


    // New method to get products by category
    public async getProductsByCategory(categoryId: string): Promise<IProductModel[]> {
        try {

            // Validate that the categoryId is a valid ObjectId
            if (!isValidObjectId(categoryId)) {
                throw new Error("Invalid categoryId format");
            }

            // logging '' before using it    
            console.log("Received categoryId:", categoryId);


            // 1. Retrieves all product-category relations where the specified 'categoryId' is present in the 'categoryIds' array of each document.
            const objectId = new Types.ObjectId(categoryId);
            console.log("Converted ObjectId:", objectId);  // Debugging: Log the ObjectId


            // Find relations for the given category
            const relations = await IProductCategoryModel.find({ categoryIds: objectId }).lean();

            console.log("Query explanation: Finding all product-category relationships where the specified category ID is associated with products.");
            console.log("Query results:");
            console.log(JSON.stringify(relations, null, 2));



            if (relations.length === 0) {
                console.log("No relations found for this category");
                return [];
            }

            // 2. This line extracts just the productId from each relation document - It creates a new array (productIds) containing only the product IDs
            const productIds = relations.map(relation => relation.productId);
            console.log("Product IDs:", productIds);  // Debugging: Log the extracted product IDs

            // 3. Find the products using the extracted product IDs

            // Fetch products using the extracted product IDs
            const products = await IProductModel.find({ _id: { $in: productIds } }).lean(); //Tells Mongoose to return plain JavaScript objects instead of full Mongoose documents. This can improve performance
            // Debugging: Log the final products array
            console.log("Products:", JSON.stringify(products, null, 2));

            return products;
        } catch (error) {
            console.error("Error fetching products by category:", error);
            throw error;
        }
    }


    // New method to get all products with their categories- find all products associated with a given category.
    public async getAllProductsWithCategories(): Promise<ProductWithCategories[]> {
        try {
            // 1. Fetch all products
            const products = await IProductModel.find();

            // 2. Fetch all product-category relations
            const relations = await IProductCategoryModel.find();

            // 3. Fetch all categories
            const categories = await ICategoryModel.find();

            // 4. Combine products with their categories
            const productsWithCategories = products.map(product => {
                // a. Find categories for this product
                const productRelation = relations.find(rel =>
                    rel.productId.toString() === product._id.toString()
                );
                const productCategories = productRelation
                    ? categories.filter(category =>
                        productRelation.categoryIds.some(id => id.toString() === category._id.toString())
                    )
                    : [];

                // b. Combine product data with its categories
                return {
                    _id: product._id.toString(),
                    name: product.name,
                    description: product.description,
                    product_weight_grams: product.product_weight_grams,
                    price: product.price,
                    imageName: product.imageName,
                    imageUrl: product.imageUrl,
                    categories: productCategories // This is already ICategoryModel[]. this line is not a type declaration, but an actual assignment of data.
                } as ProductWithCategories; //tell TypeScript that this entire object should conform to the ProductWithCategories interface, which includes the categories: ICategoryModel[] type declaration.
            });

            return productsWithCategories;
        } catch (error) {
            console.error("Error fetching products with categories:", error);
            throw error;
        }
    }

}//ProductsCategoriesService END

export const productsCategoriesService = new ProductsCategoriesService();