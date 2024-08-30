import { fileSaver } from "uploaded-file-saver";
import { environment } from "../../../Frontend/src/environments/environment";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { IProductModel } from "../3-models/Iproduct-model";
import mongoose, { ObjectId } from "mongoose";
import { UploadedFile } from "express-fileupload";
import { Conflict } from 'http-errors';
import { productsCategoriesService } from '../5-services/products-categories-service';


class ProductsService {

    // get All products
    public async getAllProducts(): Promise<IProductModel[]> {
        try {
            const products = await IProductModel.find().exec();
            return products.map(product => {
                if (!product.imageName || !product.imageUrl) {
                    product.imageName = 'default-image.jpg';
                    product.imageUrl = `${environment.BASE_IMAGE_URL}default-image.jpg`;
                }
                return product;
            });
        }
        catch (err: any) {
            console.error("Error getting all products:", err);
            throw err;
        }
    }

    //get  a product by name
    public async getProductByName(name: string): Promise<IProductModel | null> {
        return IProductModel.findOne({ name }).exec();
    }


    public async getOneProductById(id: string): Promise<IProductModel | null> {
        try {
            const product = await IProductModel.findById(id).exec();
            if (!product) {
                throw new ValidationError("Product not found");
            }
            return product;
        }
        catch (err: any) {
            console.error("Error getting product by ID:", err);
            throw err;
        }
    }


    //Search products
    public searchProducts(text: string): Promise<IProductModel[]> {
        const regex = new RegExp(text, 'i');
        return IProductModel.find({ name: { $regex: regex } }).exec();
    }

    //add product:
    public async addProduct(product: IProductModel): Promise<IProductModel> {
        try {
            const newProduct = new IProductModel(product);//await this.getProductByName(product.name);
            // Check if an image file is providedQ
            if (product.image) {
                // Save the image file
                const imageFile = product.image as UploadedFile;
                const imageName = await fileSaver.add(imageFile);
                newProduct.imageName = imageName;
                newProduct.imageUrl = environment.BASE_IMAGE_URL + imageName;
                // newProduct.image = product.image;
                console.log("image name is: " + newProduct.imageName);
                console.log("image url  is: " + newProduct.imageUrl);

            } else {
                // If no image is provided, assign a default image name
                console.warn("else: image name set to: " + 'default-image.jpg');
                console.log("else: image name is: " + product.imageName);
                console.log("else: image url  is: " + product.imageUrl);
                const defaultImageName = "default-image.jpg";
                newProduct.imageName = defaultImageName;
                newProduct.imageUrl = environment.BASE_IMAGE_URL + defaultImageName;
            }
            // Save the new product to the database
            await newProduct.save();

             // Sync with 'ProductWithCategories' collection (through 'IProductWithCategories-model.ts' model)
             await productsCategoriesService.syncProductWithCategories(newProduct._id.toString());

            // Return the added product
            return newProduct;
        } catch (err: any) {
            throw err;
        }
    }

    //update (edit) coffee product
    public async updateProduct(product: IProductModel): Promise<IProductModel> {
        try {
            console.log("Updating product with ID:", product._id);

            // Fetch the existing product from the database
            const existingProduct = await IProductModel.findById(product._id);

            // If the product doesn't exist, throw a ResourceNotFoundError
            if (!existingProduct) throw new ResourceNotFoundError(product._id.toString());

            console.log("Existing product:", existingProduct);

            // Update basic product fields using Object.assign for cleaner code
            Object.assign(existingProduct, {
                name: product.name,
                description: product.description,
                product_weight_grams: product.product_weight_grams,
                price: product.price
            });

            // Handle image update
            if (product.image && product.image instanceof Object && 'name' in product.image) {
                // If a new image is provided, update the product's image
                await this.updateProductImage(existingProduct, product.image as UploadedFile);
            } else if (!product.image && existingProduct.imageName !== 'default-image.jpg') {
                // If no new image is provided and the current image is not the default, revert to default
                this.revertToDefaultImage(existingProduct);
            }

            // Validate the updated product
            await existingProduct.validate();

            // Save and return the updated product
            const updatedProduct=  await existingProduct.save();

            // Sync with 'ProductWithCategories' collection (through 'IProductWithCategories-model.ts' model)
            await productsCategoriesService.syncProductWithCategories(product._id.toString());

            return updatedProduct;

        } catch (err: any) {
            console.error("Error updating product:", err);
            throw err;
        }
    }

    private async updateProductImage(existingProduct: IProductModel, imageFile: UploadedFile): Promise<void> {
        try {
            let imageName: string;

            if (existingProduct.imageName === 'default-image.jpg') {
                // If the current image is the default, add the new image
                imageName = await fileSaver.add(imageFile);
            } else {
                // If it's not the default, update the existing image
                imageName = await fileSaver.update(existingProduct.imageName, imageFile);
            }

            // Update the product with the new image details
            existingProduct.imageName = imageName;
            existingProduct.imageUrl = `${environment.BASE_IMAGE_URL}${imageName}`;
        } catch (err) {
            console.error(`Failed to update/add image for ${existingProduct.imageName}:`, err);

            // If update fails, try to add the image as a new file
            try {
                const newImageName = await fileSaver.add(imageFile);
                existingProduct.imageName = newImageName;
                existingProduct.imageUrl = `${environment.BASE_IMAGE_URL}${newImageName}`;
            } catch (addErr) {
                console.error(`Failed to add new image:`, addErr);
                // If adding also fails, throw an error
                throw new Error("Failed to update product image. The product will keep its current image.");
            }
        }
    }

    private revertToDefaultImage(existingProduct: IProductModel): void {
        // Set the product's image to the default
        existingProduct.imageName = 'default-image.jpg';
        existingProduct.imageUrl = `${environment.BASE_IMAGE_URL}default-image.jpg`;
    }

    //delete product:
    public async deleteProduct(_id: string): Promise<void> {
        try {
            // Find the product by ID
            const product = await IProductModel.findById(_id);

            if (product) {
                // Only delete the image if it's not the default image
                if (product.imageName !== 'default-image.jpg') {
                    await fileSaver.delete(product.imageName);
                }

                // Delete the product from the database
                await IProductModel.findByIdAndDelete(_id).exec();

                // Sync with 'ProductWithCategories' collection (through 'IProductWithCategories-model.ts' model)
             await productsCategoriesService.syncProductWithCategories(_id.toString());
            }
        }
        catch (err: any) {
            throw err;
        }
    }


    //get image name from db
    private async getImageName(_id: ObjectId): Promise<string> {
        try {
            // Find the product by ID
            const product = await IProductModel.findById(_id).select('imageName').exec();

            // If product doesn't exist, return null
            if (!product) {
                return null;
            }

            // Extract the image name from the product
            const imageName = product.imageName;

            // Return the image name
            return imageName;
        } catch (err: any) {
            throw err;
        }
    }
    //

}
export const productsService = new ProductsService();
