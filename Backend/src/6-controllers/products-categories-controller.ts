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
        this.router.put("/products/:productId/categories", this.updateProductCategories);
        this.router.get("/products/categories", this.getAllProductCategoryAssociations);
    }

    private async getProductsByCategoryId(req: Request, res: Response, next: NextFunction) {
        try {
            const categoryId = req.params.categoryId;
            const products = await productsCategoriesService.getProductsByCategoryId(categoryId);
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    private async updateProductCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.productId;
            const { categoryIds } = req.body;
            const updatedRelation = await productsCategoriesService.updateProductCategories(productId, categoryIds);
            res.json(updatedRelation);
        } catch (error) {
            next(error);
        }
    }
     // Add this new method
     private async getAllProductCategoryAssociations(req: Request, res: Response, next: NextFunction) {
        try {
            const associations = await productsCategoriesService.getAllProductCategoryAssociations();
            res.json(associations);
        } catch (error) {
            next(error);
        }
    }
}

export const productsCategoriesController = new ProductsCategoriesController();
export const productsCategoriesRouter = productsCategoriesController.router;