import express, { Request, Response, NextFunction } from 'express';
import { productsCategoriesService } from '../5-services/products-categories-service';
import { StatusCode } from '../3-models/enums';
import { Types } from 'mongoose';

class ProductsCategoriesController {
    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
       
        this.router.get("/products/categories", this.getAllProductCategoryAssociations);

        // TODO:  the 'updateProductCategories' method is meant for later Usage.
        // New route: Update a product's categories
        this.router.put("/products/:productId/categories", this.updateProductCategories);

         // New route: Add a product to categories
         this.router.post("/products/categories/:productId", this.addProductToCategories);

          // New route: Remove a product from all categories
        this.router.delete("/products/categories/:productId", this.removeProductFromCategories);
        // New route: Remove a category from all products
        this.router.delete("/categories/:categoryId/products", this.removeCategoryFromProducts);
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
            console.info("updateProductCategories is being called")
            const productId = new Types.ObjectId(req.params.productId);
            const categoryIds = req.body.categoryIds.map((id: string) => new Types.ObjectId(id));
            const updatedRelation = await productsCategoriesService.updateProductCategories(productId, categoryIds);
            res.json(updatedRelation);
        } catch (error) {
            next(error);
        }
    }
    

    private async addProductToCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = new Types.ObjectId(req.params.productId);
            await productsCategoriesService.addProductToCategories(productId);
            res.sendStatus(StatusCode.Created);
        } catch (error) {
            next(error);
        }
    }

    private async removeProductFromCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = new Types.ObjectId(req.params.productId);
            await productsCategoriesService.removeProductFromCategories(productId);
            res.sendStatus(StatusCode.NoContent);
        } catch (error) {
            next(error);
        }
    }

    private async removeCategoryFromProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId = new Types.ObjectId(req.params.categoryId);
            await productsCategoriesService.removeCategoryFromProducts(categoryId);
            res.sendStatus(StatusCode.NoContent);
        } catch (error) {
            next(error);
        }
    }
    
}

export const productsCategoriesController = new ProductsCategoriesController();
export const productsCategoriesRouter = productsCategoriesController.router;