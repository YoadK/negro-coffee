import express, { Request, Response, NextFunction } from 'express';
import { productsCategoriesService } from '../5-services/products-categories-service';
import { ValidationError, ResourceNotFoundError } from '../3-models/client-errors';
import { StatusCode } from '../3-models/enums';

class ProductsCategoriesController {
    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.post("/products", this.createOrUpdateProduct);
        this.router.get("/products/:id", this.findProductById);
        this.router.delete("/products/:id", this.deleteProduct);
        this.router.post("/products/:id/categories", this.addCategoryToProduct);
        this.router.delete("/products/:id/categories/:categoryId", this.removeCategoryFromProduct);
        this.router.put("/products/:id/categories", this.updateProductCategories);
        this.router.post("/products/:id/sync", this.syncProductWithCategories);
    }

    private async createOrUpdateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body.name) {
                throw new ValidationError("Product name is required");
            }
            const product = await productsCategoriesService.createOrUpdateProduct(req.body);
            await productsCategoriesService.syncProductWithCategories(product._id.toString());
            res.status(StatusCode.OK).json(product);
        } catch (error) {
            console.error('Controller error in createOrUpdateProduct:', error);
            next(error);
        }
    }

    private async findProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productsCategoriesService.findProductById(req.params.id);
            if (product) {
                res.status(StatusCode.OK).json(product);
            } else {
                throw new ResourceNotFoundError(req.params.id);
            }
        } catch (error) {
            console.error('Controller error in findProductById:', error);
            next(error);
        }
    }

    private async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const deleted = await productsCategoriesService.deleteProduct(req.params.id);
            if (deleted) {
                await productsCategoriesService.removeProductFromProductWithCategories(req.params.id);
                res.status(StatusCode.NoContent).send();
            } else {
                throw new ResourceNotFoundError(req.params.id);
            }
        } catch (error) {
            console.error('Controller error in deleteProduct:', error);
            next(error);
        }
    }

    private async addCategoryToProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { categoryId } = req.body;
            if (!id || !categoryId) {
                throw new ValidationError("Both productId and categoryId are required");
            }
            const updatedProduct = await productsCategoriesService.addCategoryToProduct(id, categoryId);
            await productsCategoriesService.syncProductWithCategories(id);
            res.status(StatusCode.OK).json(updatedProduct);
        } catch (error) {
            console.error('Controller error in addCategoryToProduct:', error);
            next(error);
        }
    }

    private async removeCategoryFromProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, categoryId } = req.params;
            if (!id || !categoryId) {
                throw new ValidationError("Both productId and categoryId are required");
            }
            const updatedProduct = await productsCategoriesService.removeCategoryFromProduct(id, categoryId);
            await productsCategoriesService.syncProductWithCategories(id);
            res.status(StatusCode.OK).json(updatedProduct);
        } catch (error) {
            console.error('Controller error in removeCategoryFromProduct:', error);
            next(error);
        }
    }

    private async updateProductCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { categories } = req.body;
            if (!id || !categories) {
                throw new ValidationError("Product ID and categories are required");
            }
            const updatedProduct = await productsCategoriesService.updateProductCategories(id, categories);
            await productsCategoriesService.syncProductWithCategories(id);
            res.status(StatusCode.OK).json(updatedProduct);
        } catch (error) {
            console.error('Controller error in updateProductCategories:', error);
            next(error);
        }
    }

    private async syncProductWithCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            console.log(`Received request to sync product with ID: ${productId}`);

            await productsCategoriesService.syncProductWithCategories(productId);
            
            console.log(`Sync completed for product ID: ${productId}`);
            res.status(StatusCode.OK).json({ message: "Product synchronized successfully" });
        } catch (error) {
            console.error("Controller error in syncProductWithCategories:", error);
            next(error);
        }
    }
}


export const productsCategoriesController = new ProductsCategoriesController();
export const productsCategoriesRouter = productsCategoriesController.router;