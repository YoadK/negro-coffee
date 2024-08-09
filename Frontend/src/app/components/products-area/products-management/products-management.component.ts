import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ProductModel } from '../../../models/product.model';
import { notify } from '../../../Utils/Notify';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
    selector: 'app-products-management',
    standalone: true,
    imports: [RouterLink, CommonModule, AddProductComponent],
    templateUrl: './products-management.component.html',
    styleUrl: './products-management.component.module.scss'
})
export class ProductsManagementComponent implements OnInit {
    products: ProductModel[] = [];
    showAddForm: boolean = false;

    constructor(private productsService: ProductsService) { }

    async ngOnInit() {
        await this.loadProducts();
    }

    async loadProducts() {
        try {
            this.products = await this.productsService.getAllProducts();
        } catch (err: any) {
            notify.error('Failed to load products');
            console.error('Error loading products:', err);
        }
    }

    toggleAddForm() {
        this.showAddForm = !this.showAddForm;
    }

    async onProductAdded() {
        await this.loadProducts();
        this.showAddForm = false;
        notify.success('Product added successfully');
    }

    async deleteProduct(productId: string) {
        if (confirm('האם אתה בטוח שברצונך למחוק מוצר זה?')) {
            try {
                const productElement = document.querySelector(`[data-product-id="${productId}"]`);
                if (productElement) {
                    productElement.classList.add('deleting');
                    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for animation
                }
                
                await this.productsService.deleteProduct(productId);
                await this.loadProducts();
                notify.success('המוצר נמחק בהצלחה');
            } catch (error) {
                notify.error('הפעולה נכשלה');
                console.error('שגיאה במחיקת המוצר:', error);
            }
        }
    }
}