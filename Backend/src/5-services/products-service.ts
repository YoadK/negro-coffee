import { fileSaver } from "uploaded-file-saver";
import { appConfig } from "../2-utils/app-config";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { IProductModel, ProductModel } from "../3-models/product-model";
import mongoose, { ObjectId } from "mongoose";
import { UploadedFile } from "express-fileupload";
import { Conflict } from 'http-errors';

class ProductsService {

    // get All products
    public getAllProducts(): Promise<IProductModel[]> {
        return ProductModel.find().exec();
    }

    //get  a product by name
    public async getProductByName(name: string): Promise<IProductModel | null> {
        return ProductModel.findOne({ name }).exec();
    }

    public async getOneProductById(id: string): Promise<IProductModel | null> {
        const product = await ProductModel.findById(id).exec();
        if (!product) {
            throw new ValidationError("Product not found");
        }
        return product;
    }


    //Search products
    public searchProducts(text: string): Promise<IProductModel[]> {
        const regex = new RegExp(text, 'i');
        return ProductModel.find({ name: { $regex: regex } }).exec();
    }

    //add product:
    public async addProduct(product: IProductModel): Promise<IProductModel> {
        try {
            const newProduct = new ProductModel(product);//await this.getProductByName(product.name);


            // Check if an image file is provided
            if (product.image) {
                // Save the image file
               
                const imageFile = product.image as UploadedFile;
                const imageName = await fileSaver.add(imageFile);
                newProduct.imageName = imageName;
                newProduct.imageUrl = appConfig.baseImageUrl + imageName;
                newProduct.image=product.image;
                console.log("image name is: " +   newProduct.imageName);
                console.log("image url  is: " + newProduct.imageUrl);

            } else {
                // If no image is provided, assign a default image name
                console.warn("else: image name set to: " + 'default-image.jpg');
                console.log("else: image name is: " + product.imageName);
                console.log("else: image url  is: " + product.imageUrl);
                const defaultImageName = "default-image.jpg";
                newProduct.imageName = defaultImageName;
                newProduct.imageUrl = appConfig.baseImageUrl +  newProduct.imageName;
            }


            // Save the new product to the database
            await newProduct.save();

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

            // Find the product by ID
            const existingProduct = await ProductModel.findById(product._id);
            console.log("Existing product:", existingProduct);


            if (!existingProduct) {
                throw new ResourceNotFoundError(product._id.toString());
            }

            // Update the product fields
            existingProduct.name = product.name;;
            existingProduct.description = product.description;
            existingProduct.quantity = product.quantity;
            existingProduct.price = product.price;


            if (product.image) {
                // Update the image file
                const imageFile = product.image as UploadedFile;
                const updatedImageName = await fileSaver.update(existingProduct.imageName, product.image);
                existingProduct.imageName = updatedImageName;
                existingProduct.imageUrl = appConfig.baseImageUrl + updatedImageName;
            } else if (!existingProduct.imageName) {
                // If no image is provided and the existing product doesn't have an image name,
                // set a default image name
                const defaultImageName = "default-image.avif";
                const defaultImagePath = fileSaver.getFilePath(defaultImageName, true);
                existingProduct.imageName = defaultImageName;
                existingProduct.imageUrl = appConfig.baseImageUrl + defaultImageName;
            }

            // Manually trigger validation
            await existingProduct.validate();

            // Save the updated product
            await existingProduct.save();

            // Return the updated product
            return existingProduct;
        }
        catch (err: any) {
            throw err;
        }
    }


    //delete product:
    public async deleteProduct(_id: string): Promise<void> {
        try {
            // Find the product by ID
            const product = await ProductModel.findById(_id);

            if (product) {
                // Delete the image file
                await fileSaver.delete(product.imageName);

                // Delete the product from the database
                await ProductModel.findByIdAndDelete(_id).exec();
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
            const product = await ProductModel.findById(_id).select('imageName').exec();

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
