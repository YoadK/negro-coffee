// migrateProductCategories.ts

import mongoose, { Schema, Document, model } from 'mongoose';

// Import your existing Product model
import { Product } from '../src/3-models/Iproduct-model'; // Adjust the path as necessary
import { environment } from '../../Frontend/src/environments/environment';

// Define the interface for the relation
interface IProductCategoryRelation extends Document {
  productId: mongoose.Types.ObjectId;
  categoryIds: mongoose.Types.ObjectId[]; // Array of ObjectIds
}

// Define the ProductCategoryRelation schema
const ProductCategoryRelationSchema = new Schema<IProductCategoryRelation>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
      },
    ],
  },
  { collection: 'productCategoryRelations' }
);

// Create the model
const ProductCategoryRelation = model<IProductCategoryRelation>(
  'ProductCategoryRelation',
  ProductCategoryRelationSchema
);

// Connect to MongoDB
const dbUri = environment.MONGODB_CONNECTION_STRING; // Replace with your actual DB URI

mongoose
  .connect(dbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    migrateProductCategories();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Migration Logic
async function migrateProductCategories() {
  try {
    // Step 1: Fetch all product-category relations
    const relations = await ProductCategoryRelation.find();

    if (relations.length === 0) {
      console.warn('No relations found in productCategoryRelations collection.');
      return;
    }

    console.log(`Fetched ${relations.length} relations from productCategoryRelations.`);

    // Step 2: Group categoryIds by productId
    const productCategoriesMap: { [key: string]: mongoose.Types.ObjectId[] } = {};

    relations.forEach((relation) => {
      const productId = relation.productId;
      const productIdStr = productId.toHexString();
      const categoryIds = relation.categoryIds;

      if (!productId || !categoryIds || categoryIds.length === 0) {
        console.warn('Skipping relation due to missing productId or categoryIds:', relation);
        return; // Skip this relation
      }

      if (!productCategoriesMap[productIdStr]) {
        productCategoriesMap[productIdStr] = [];
      }

      // Combine the categoryIds arrays
      productCategoriesMap[productIdStr] = productCategoriesMap[productIdStr].concat(categoryIds);
    });

    // Step 3: Deduplicate category IDs for each product
    for (const productIdStr in productCategoriesMap) {
      const uniqueCategoryIds = [
        ...new Set(productCategoriesMap[productIdStr].map((id) => id.toHexString())),
      ].map((id) => new mongoose.Types.ObjectId(id));

      productCategoriesMap[productIdStr] = uniqueCategoryIds;
    }

    // Step 4: Update each Product with its categoryIds
    const productIdsStr = Object.keys(productCategoriesMap);

    if (productIdsStr.length === 0) {
      console.warn('No products to update.');
      return;
    }

    for (const productIdStr of productIdsStr) {
      const categoryIds = productCategoriesMap[productIdStr];
      const productId = new mongoose.Types.ObjectId(productIdStr);

      // Log the product ID before updating
      console.log(`Updating product with ID: ${productIdStr}`);

      // Attempt to update the product
      try {
        const updateResult = await Product.updateOne(
          { _id: productId }, // Use productId as ObjectId
          { $set: { categoryIds: categoryIds } }
        );

        if (updateResult.matchedCount > 0) {
          console.log(`Updated product ${productIdStr} with categories:`, categoryIds);
        } else {
          console.warn(`No product found with ID ${productIdStr}.`);
        }
      } catch (updateErr) {
        console.error(`Error updating product ${productIdStr}:`, updateErr);
      }
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    mongoose.disconnect();
  }
}
