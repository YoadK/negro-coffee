import express, { NextFunction, Request, Response } from "express";
import { categoriesService } from "../5-services/categories-service";


// Product controller:
class CategoriesController {

    // Create a router object for listening to HTTP requests:
    public readonly router = express.Router();

    // Register routes once: 
    public constructor() {
        this.registerRoutes();
    }

    // Register routes:
    private registerRoutes(): void {
        this.router.get("/categories", this.getAllCategories);       
        
    }

    // GET http://localhost:4000/api/categories
    private async getAllCategories(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await categoriesService.getAllCategories();
            console.log(categories);

            response.json(categories);
        }
        catch (err: any) { next(err); }
    }


    


}

const categoriesController = new CategoriesController();
export const categoriesRouter =  categoriesController.router;
