import express, { NextFunction, Request, Response } from "express";
import { StatusCode } from "../3-models/enums";
import { productsService } from "../5-services/products-service";
import { ValidationError } from "../3-models/client-errors";
import mongoose from "mongoose";
import { ProductModel } from "../3-models/product-model";
import { UploadedFile } from "express-fileupload";

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
            //if 'productToSearchFor' was not found by its repspective id...
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
            const product = new ProductModel(request.body);

            const error = product.validateSync();
            if (error) throw new ValidationError(error.message);

            const imageFile = request.files?.image as UploadedFile;

            if (imageFile) {
                product.imageName = imageFile.name;
                // Save the image file separately (e.g., using a file storage service)
                // and set the imageUrl field accordingly
                // product.imageUrl = "path/to/saved/image";
            }


            // Check if the product already exists in the database
            const existingProduct = await productsService.getProductByName(product.name.toLowerCase().trim());
            if (existingProduct) {
                // If the product already exists, return a response indicating that
                response.status(StatusCode.Conflict).json({ message: "Product already exists" });
            }

            const addedProduct = await productsService.addProduct(product);
            response.status(StatusCode.Created).json(addedProduct);

        }
        catch (err: any) { next(err); }
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

            const product = new ProductModel(productData);


            // Check if a new image file is provided
            if (request.files && request.files.image) {
                const imageFile = request.files.image as UploadedFile;
                product.imageName = imageFile.name;

            }

            const updatedProduct = await productsService.updateProduct(product);
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


}

const productsController = new ProductsController();
export const productsRouter = productsController.router;
