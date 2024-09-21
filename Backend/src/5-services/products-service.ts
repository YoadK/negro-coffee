import { fileSaver } from "uploaded-file-saver";
import { environment } from "../../../Frontend/src/environments/environment";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { IProductModel, Product } from "../3-models/Iproduct-model";
import mongoose, { Types } from "mongoose";
import { UploadedFile } from "express-fileupload";
import { Conflict } from 'http-errors';



class ProductsService {

    // get All products
    public async getAllProducts(): Promise<IProductModel[]> {
        try {

            const products = await Product.find().populate('categories').exec();
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
        return Product.findOne({ name }).exec();
    }


    public async getOneProductById(id: Types.ObjectId): Promise<IProductModel | null> {
        try {
            const product = await Product.findById(id).populate('categories').exec();
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
    public async searchProducts(text: string): Promise<IProductModel[]> {
        const regex = new RegExp(text, 'i'); // Case-insensitive search
        return await Product.find({
            $or: [
                { name: regex },
                { description: regex },
                // Include category names if necessary
            ]
        }).populate('categories').exec();
    }


    //add product:
    public async addProduct(productData: any): Promise<IProductModel> {
        try {
            //Extracting the image file first, then creating the Product instance.
            //this removes the image from productData before creating the Mongoose model, 
            // which aligns perfectly with the goal of preventing Mongoose from stripping off the image (this
            //  way, no unexpected data is passed to Mongoose.

            // Extract the image file
            const imageFile = productData.image as UploadedFile;
            delete productData.image; // Remove 'image' from productData to avoid Mongoose stripping it off

            // Create a new Mongoose model instance with the remaining product data
            const newProduct = new Product(productData);


            // Check if an image file is provided
            if (imageFile) {
                // Save the image file
                // const imageFile = product.image as UploadedFile;
                const imageName = await fileSaver.add(imageFile);
                newProduct.imageName = imageName;
                newProduct.imageUrl = environment.BASE_IMAGE_URL + imageName;
            } else {
                // Assign a default image if none is provided
                console.warn("No image provided. Using default image.");
                const defaultImageName = "default-image.jpg";
                newProduct.imageName = defaultImageName;
                newProduct.imageUrl = environment.BASE_IMAGE_URL + defaultImageName;
            }
            // Save the new product to the database
            await newProduct.save();


            // Log the image name and URL (to match controller expectations)
            console.log("<product service> Added product image name:", newProduct.imageName);
            console.log("<product service> Added product image URL:", newProduct.imageUrl);

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
            const existingProduct = await Product.findById(product._id);

            // If the product doesn't exist, throw a ResourceNotFoundError
            if (!existingProduct) throw new ResourceNotFoundError(product._id.toString());

            console.log("Existing product:", existingProduct);

            // Update basic product fields using Object.assign for cleaner code
            Object.assign(existingProduct, {
                name: product.name,
                description: product.description,
                product_weight_grams: product.product_weight_grams,
                price: product.price,
                categoryIds: product.categoryIds
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
            const updatedProduct = await existingProduct.save();



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
    public async deleteProduct(_id: Types.ObjectId): Promise<void> {
        try {
            // Find the product by ID
            const product = await Product.findById(_id);

            if (product) {
                // Only delete the image if it's not the default image
                if (product.imageName !== 'default-image.jpg') {
                    await fileSaver.delete(product.imageName);
                }

                // Delete the product from the database
                await Product.findByIdAndDelete(_id).exec();
            }
        }
        catch (err: any) {
            throw err;
        }
    }

    //  TODO: find out why no method is using this functionality...
    //get image name from db
    private async getImageName(_id: Types.ObjectId): Promise<string> {
        try {
            // Find the product by ID
            const product = await Product.findById(_id).select('imageName').exec();

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

    public async getProductsByCategoryId(categoryId: Types.ObjectId): Promise<IProductModel[]> {
        try {

            const products = await Product.find({ categoryIds: categoryId })
            .populate('categories')
            .exec();

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

}
export const productsService = new ProductsService();
