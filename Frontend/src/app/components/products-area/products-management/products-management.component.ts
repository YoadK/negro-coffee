import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ProductModel } from '../../../models/product.model';
import { notify } from '../../../Utils/Notify';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-products-management',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './products-management.component.html',
    styleUrl: './products-management.component.module.scss'
})
export class ProductsManagementComponent implements OnInit {
    products: ProductModel[] = [];

    constructor(private productsService: ProductsService) { }

    async ngOnInit() {
        try {
            this.products = await this.productsService.getAllProducts();
        }
        catch (err: any) {
            notify.error('Failed to load products');
            console.error('Error loading products:', err);
        }
    }

    async deleteProduct(productId: string) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const productElement = document.querySelector(`[data-product-id="${productId}"]`);
                if (productElement) {
                    productElement.classList.add('deleting');
                    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
                }
                
                await this.productsService.deleteProduct(productId);
                this.products = this.products.filter(p => p._id.toString() !== productId);
                notify.success('Product deleted successfully');
            } catch (error) {
                notify.error('Failed to delete product');
                console.error('Error deleting product:', error);
            }
        }
    }
}