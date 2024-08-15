import express, { NextFunction, Request, Response } from "express";
import { StatusCode } from "../3-models/enums";
import { productsService } from "../5-services/products-service";
import { ValidationError } from "../3-models/client-errors";
import mongoose from "mongoose";
import { IProductModel } from "../3-models/product-model";
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
        this.router.put("/products/:_id([0-9a-fA-F]{24})", this.updateProduct);
        this.router.delete("/products/:_id([0-9a-fA-F]{24})", this.deleteProduct);
        this.router.get("/products/images/:imageName", this.getImageFile);

    }

    // GET http://localhost:4000/api/products
    private async getAllProducts(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const Products = await productsService.getAllProducts();
            response.json(Products);
        }
        catch (err: any) { next(err); }

    }


    // GET http://localhost:4000/api/products/:_id
    private async getOneProductById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const productToSearchFor = await productsService.getOneProductById(request.params._id);
            //if 'productToSearchFor' was not found by its respective id...
            if (!productToSearchFor) {
                response.status(StatusCode.NotFound).json({ message: "Product not found" });

            }
            response.json(productToSearchFor);
        }
        catch (err: any) { next(err); }

    }



    // GET http://localhost:4000/api/search/:text
    private async searchProducts(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const text = request.params.text.toLowerCase().trim();
            const Products = await productsService.searchProducts(text);
            response.json(Products);
        }
        catch (err: any) { next(err); }
    }

    // POST http://localhost:4000/api/Products/new
    private async addProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            console.log('Request Body:', request.body);
            console.log('Request Files:', request.files);

            const productData = {
                ...request.body,
                image: request.files?.image as UploadedFile // Include the uploaded image file
            };

            const product = new IProductModel(productData);
            const addedProduct = await productsService.addProduct(product);
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
            const productData = {
                ...request.body,
                _id: new mongoose.Types.ObjectId(productId)
            };
            const product = new IProductModel(productData);

            // Check if a new image file is provided
            if (request.files && request.files.image) {
                const imageFile = request.files.image as UploadedFile;
                product.image = imageFile;// Pass the image file to the service
                product.imageName = imageFile.name;// Ensure imageName is passed
            }
            // Pass the updated product data to the service
            const updatedProduct = await productsService.updateProduct(product);
            // Respond with the updated product
            response.json(updatedProduct);
        }
        catch (err: any) {
            if (err instanceof ValidationError) {
                // Handle the ValidationError
                response.status(StatusCode.BadRequest).json({ message: err.message });
            } else {
                // Pass other errors to the error handling middleware
                next(err);
            }
        }
    }



    // DELETE http://localhost:4000/api/Products/:_id
    private async deleteProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const _id = request.params._id;
            const deletedProduct = await productsService.deleteProduct(_id);
            response.sendStatus(StatusCode.NoContent)
        }
        catch (err: any) { next(err); }
    }


    // GET http://localhost:4000/api/products/images/:imageName
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
