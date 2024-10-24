import express, { NextFunction, Request, response, Response } from "express";
import { StatusCode } from "../3-models/enums";
import { productsService } from "../5-services/products-service";
import { ValidationError } from "../3-models/client-errors";
import mongoose, { Types } from "mongoose";
import { Product, IProductModel } from "../3-models/Iproduct-model";
import { UploadedFile } from "express-fileupload";
import { Conflict } from 'http-errors';
import { fileSaver } from "uploaded-file-saver";



// Product controller:
class ProductsController {

    // Create a router object for listening to HTTP requests:
    public readonly router = express.Router();

    // Register routes once: 
    public constructor() {
        this.registerRoutes();
    }

    // Register routes:
    private registerRoutes(): void {
        this.router.get("/products", this.getAllProducts);
        this.router.get("/products/:_id([0-9a-fA-F]{24})", this.getOneProductById);
        this.router.get("/products/search/:text", this.searchProducts);
        this.router.post("/products/new", this.addProduct);
        this.router.put("/products/edit/:_id([0-9a-fA-F]{24})", this.updateProduct);
        this.router.delete("/products/:_id([0-9a-fA-F]{24})", this.deleteProduct);
        this.router.get("/products/images/:imageName", this.getImageFile);
        this.router.get("/products/categories/:categoryId([0-9a-fA-F]{24})", this.getProductsByCategoryId);
        this.router.get("/products/category/:categoryId", this.getProductsByCategoryId);

    }
    // GET http://localhost:4000/api//products/category/:categoryId
    private async getProductsByCategoryId(request: Request, response: Response, next: NextFunction) {
        try {
            const categoryId = new Types.ObjectId(request.params.categoryId);
            const products = await productsService.getProductsByCategoryId(categoryId);
            response.json(products);
        }
        catch (err: any) { next(err); }

    }


    // GET http://localhost:4000/api/products
    private async getAllProducts(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const products = await productsService.getAllProducts();
            response.json(products);
        }
        catch (err: any) { next(err); }

    }


    // GET http://localhost:4000/api/products/:_id
    private async getOneProductById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const productId = new Types.ObjectId(request.params._id);
            const productToSearchFor = await productsService.getOneProductById(productId);
            if (!productToSearchFor) {
                response.status(StatusCode.NotFound).json({ message: "Product not found" });
            } else {
                response.json(productToSearchFor);
            }
        }
        catch (err: any) { next(err); }
    }



    // GET http://localhost:4000/api/search/:text
    private async searchProducts(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const text = request.params.text.toLowerCase().trim();
            const products = await productsService.searchProducts(text);
            response.json(products);
        }
        catch (err: any) { next(err); }
    }

    // POST http://localhost:4000/api/products/new
    private async addProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            console.log('Request Body:', request.body);
            console.log('Request Files:', request.files);
            console.log('Request.Files.image:', request.files.image);
            // Initialize categoryIds array
            // Considering the fact that the frontend sends categoryIds as a JSON string in the form data.
            //The backend needs to parse it and convert each ID to Types.ObjectId.
            let categoryIds: Types.ObjectId[] = [];

            if (request.body.categoryIds) {
                if (Array.isArray(request.body.categoryIds)) {
                    categoryIds = request.body.categoryIds;
                } else {
                    categoryIds = [request.body.categoryIds];
                }
            }
            // Prepare product data
            const productData = {
                ...request.body,
                categoryIds: categoryIds,
                image: request.files?.image as UploadedFile, // Include the uploaded image file
            };
            console.log('Product Data:', productData);
            // Pass productData directly to the service
            const addedProduct = await productsService.addProduct(productData);
            console.log('added product image name:', addedProduct.imageName);
            console.log('added Product image url:', addedProduct.imageUrl);
            // Respond with the added product
            response.status(StatusCode.Created).json(addedProduct);
        }
        catch (err: any) {
            if (err instanceof Conflict) {
                response.status(StatusCode.Conflict).json({ message: err.message });
            } else {
                next(err);
            }
        }
    }



    // PUT http://localhost:4000/api/products/edit/:_id
    private async updateProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const productId = request.params._id;
            console.log("product id is: " + productId);

            // Initialize categoryIds array
            let categoryIds: Types.ObjectId[] = [];

            if (request.body.categoryIds) {
                if (Array.isArray(request.body.categoryIds)) {
                    categoryIds = request.body.categoryIds;
                } else {
                    categoryIds = [request.body.categoryIds];
                }
            }

            // Prepare product data
            const productData = {
                ...request.body,
                _id: new mongoose.Types.ObjectId(productId),
                categoryIds: categoryIds,
            };
            const product = new Product(productData);

            // Check if a new image file is provided
            if (request.files && request.files.image) {
                const imageFile = request.files.image as UploadedFile;
                product.image = imageFile; // Pass the image file to the service
                product.imageName = imageFile.name; // Ensure imageName is passed
            }

            // Pass the updated product data to the service
            const updatedProduct = await productsService.updateProduct(product);
            // Respond with the updated product
            response.json(updatedProduct);
        }
        catch (err: any) {
            if (err instanceof ValidationError) {
                response.status(StatusCode.BadRequest).json({ message: err.message });
            } else {
                next(err);
            }
        }
    }





    // DELETE http://localhost:4000/api/Products/:_id
    private async deleteProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const _id = new Types.ObjectId(request.params._id);
            await productsService.deleteProduct(_id);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err: any) { next(err); }
    }


    // GET http://localhost:4000/api/products/images/:imageName
    // Functionality:
    // It retrieves the imageName from the URL parameters.
    // Uses fileSaver.getFilePath to locate the image file on the server's file system.
    // Sends the image file in the HTTP response to the client.
    // Requirement: Without this method, clients would have no way to request and receive image files stored on your server.
    private async getImageFile(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const imageName = request.params.imageName;
            const imagePath = fileSaver.getFilePath(imageName, true);
            response.sendFile(imagePath); //response the actual image file
        }
        catch (err: any) { next(err); }
    }


}

const productsController = new ProductsController();
export const productsRouter = productsController.router;
