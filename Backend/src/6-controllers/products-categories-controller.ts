import express, { Request, Response, NextFunction } from 'express';
import { productsCategoriesService } from '../5-services/products-categories-service';
import { StatusCode } from '../3-models/enums';

class ProductsCategoriesController {
    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get("/categories/:categoryId/products", this.getProductsByCategoryId); 
        this.router.get("/products/categories", this.getAllProductCategoryAssociations);

        // TODO:  the 'updateProductCategories' method is meant for later Usage.
        this.router.put("/products/:productId/categories", this.updateProductCategories);
    }


    //GET http://localhost:4000/api/products/category/:categoryId
    private async getProductsByCategoryId(req: Request, res: Response, next: NextFunction) {
        try {
            console.info ("getProductsByCategoryId is being called")
            const categoryId = req.params.categoryId;
            const products = await productsCategoriesService.getProductsByCategoryId(categoryId);
            res.json(products);
        } catch (error) {
            next(error);
        }
    }



     //GET "http://localhost:4000/api/categories/:categoryId/products" 
     private async getAllProductCategoryAssociations(req: Request, res: Response, next: NextFunction) {
        try {
           console.info ("getAllProductCategoryAssociations is being called")
            const associations = await productsCategoriesService.getAllProductCategoryAssociations();
            res.json(associations);
        } catch (error) {
            next(error);
        }
    }


    
    // TODO:  the 'updateProductCategories' method is meant for later Usage.
    // PUT "http://localhost:4000/api/products/:productId/categories"
    private async updateProductCategories(req: Request, res: Response, next: NextFunction) {
        try {
            console.info ("updateProductCategories is being called")
            const productId = req.params.productId;
            const { categoryIds } = req.body;
            const updatedRelation = await productsCategoriesService.updateProductCategories(productId, categoryIds);
            res.json(updatedRelation);
        } catch (error) {
            next(error);
        }
    }
    
    
}

export const productsCategoriesController = new ProductsCategoriesController();
export const productsCategoriesRouter = productsCategoriesController.router;