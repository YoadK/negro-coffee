import express, { NextFunction, Request, Response } from "express";
import { categoriesService } from "../5-services/categories-service";
import { productsCategoriesService } from "../5-services/products-categories-service";


// Product controller:
class ProductsCategoriesController {

    // Create a router object for listening to HTTP requests:
    public readonly router = express.Router();

    // Register routes once: 
    public constructor() {
        this.registerRoutes();
    }

    // Register routes:
    private registerRoutes(): void {
       
        this.router.get("/products/category/:categoryId", this.getProductsByCategory);
        this.router.get("/products-with-categories", this.getAllProductsWithCategories);

    }

    
    // GET http://localhost:4000/api/products/category/:categoryId
    private async getProductsByCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const categoryId = request.params.categoryId;
            console.log("Controller received categoryId:", categoryId);
            const filteredProducts = await productsCategoriesService.getProductsByCategory(categoryId);
            console.log("Controller sending response:", JSON.stringify(filteredProducts, null, 2));
            response.json(filteredProducts);
        }
        catch (err: any) {
            console.error("Controller error:", err);
            next(err);
        }
    }


    private async getAllProductsWithCategories(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const productsWithCategories = await productsCategoriesService.getAllProductsWithCategories();
            response.json(productsWithCategories);
        }
        catch (err: any) { 
            next(err); 
        }
    }
}

const productsCategoriesController = new ProductsCategoriesController();
export const productsCategoriesRouter  = productsCategoriesController.router;
