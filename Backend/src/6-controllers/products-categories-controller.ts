import { Request, Response } from 'express';
import { productsCategoriesService } from '../5-services/products-categories-service';

class ProductsCategoriesController {
    async handleCreateOrUpdateProduct(req: Request, res: Response) {
        try {
            const product = await productsCategoriesService.createOrUpdateProduct(req.body);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async handleFindProductById(req: Request, res: Response) {
        try {
            const product = await productsCategoriesService.findProductById(req.params.id);
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async handleDeleteProduct(req: Request, res: Response) {
        try {
            const deleted = await productsCategoriesService.deleteProduct(req.params.id);
            if (deleted) {
                res.status(200).json({ message: "Product deleted successfully" });
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async handleAddCategoryToProduct(req: Request, res: Response) {
        try {
            const { productId, categoryId } = req.body;
            const updatedProduct = await productsCategoriesService.addCategoryToProduct(productId, categoryId);
            if (updatedProduct) {
                res.status(200).json(updatedProduct);
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async handleRemoveCategoryFromProduct(req: Request, res: Response) {
        try {
            const { productId, categoryId } = req.body;
            const updatedProduct = await productsCategoriesService.removeCategoryFromProduct(productId, categoryId);
            if (updatedProduct) {
                res.status(200).json(updatedProduct);
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const productsCategoriesController = new ProductsCategoriesController();