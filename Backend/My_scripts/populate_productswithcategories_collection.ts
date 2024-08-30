import mongoose from 'mongoose';
import { IProductModel } from '../src/3-models/Iproduct-model';
import { ICategoryModel } from '../src/3-models/Icategory-model';
import { IProductWithCategoriesModel } from '../src/3-models/IProductWithCategories-model';
import { environment } from '../../Frontend/src/environments/environment';

async function populateProductWithCategories() {
    try {
        // Ensure database connection
        await mongoose.connect(environment.MONGODB_CONNECTION_STRING);
        console.log('Connected to MongoDB');

        // Fetch all products
        const products = await IProductModel.find();
        console.log(`Found ${products.length} products to process.`);

        for (const product of products) {
            try {
               
                // Fetch full category details
                const categories = await ICategoryModel.find({ _id: { $in: product.categories } });

                // Create or update document in ProductWithCategories collection
                const updatedProduct = await IProductWithCategoriesModel.findOneAndUpdate(
                    { _id: product._id },
                    {
                        name: product.name,
                        description: product.description,
                        product_weight_grams: product.product_weight_grams,
                        price: product.price,
                        imageName: product.imageName,
                        imageUrl: product.imageUrl,
                        categories: categories.map(cat => cat._id) // Store only category IDs
                    },
                    { upsert: true, new: true }
                );

                console.log(`Processed product: ${product.name}`);
            } catch (error) {
                console.error(`Error processing product ${product.name}:`, error);
                // Continue with the next product even if this one fails
            }
        }

        console.log('Finished populating ProductWithCategories collection.');
    } catch (error) {
        console.error('Error in populateProductWithCategories:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
    }
}

// Run the population script
populateProductWithCategories();