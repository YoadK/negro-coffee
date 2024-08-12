// updateExistingProducts.ts

import mongoose from 'mongoose';
import { IProductModel } from '../../Backend/src/3-models/product-model';
import { environment } from '../../Frontend/src/environments/environment';

async function updateExistingProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(environment.MONGODB_CONNECTION_STRING);
    console.log('Connected to MongoDB');

    // Fetch all products
    const products = await IProductModel.find();
    console.log(`Found ${products.length} products`);

    // Update products
    for (const product of products) {
      if (!product.imageName || !product.imageUrl) {
        product.imageName = 'default-image.jpg';
        product.imageUrl = `${environment.BASE_IMAGE_URL}default-image.jpg`;
        await product.save();
        console.log(`Updated product: ${product._id}`);
      }
    }

    console.log('All products have been updated');
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update function
updateExistingProducts();
