import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductModel } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';
import { notify } from '../../../Utils/Notify';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../services/categories.service';
import { OnInit } from '@angular/core';
import { CategoryModel } from '../../../models/category.model';
import { SharedModule } from '../../SharedArea/shared-module';


@Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [FormsModule, CommonModule, SharedModule],
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.module.scss']
})
export class AddProductComponent implements OnInit {
    @Output() productAdded = new EventEmitter<void>();

    public product = new ProductModel();
    public imagePreview: string | ArrayBuffer | null = null;
    public isSubmitting = false;
    public categories: CategoryModel[] = [];

    @ViewChild("myImage")
    public myImage: ElementRef<HTMLInputElement>;

    @ViewChild("myForm")
    public myForm: NgForm;

    constructor(
        private productsService: ProductsService,
        private router: Router,
        private categoriesService: CategoriesService
    ) {
        this.product = new ProductModel();
        this.product.categoryIds = []; // Initialize the array
    }




    public async ngOnInit(): Promise<void> {
        try {

            await this.loadCategories();
        } catch (error) {
            console.error('Error fetching categories:', error);
            notify.error('Error fetching categories');
        }
    }



    async loadCategories() {
        try {
            this.categories = await this.categoriesService.getAllCategories();
            console.log('<add> Categories loaded: ', this.categories.length);
        } catch (error) {
            console.error('Error loading categories:', error);
            notify.error('Failed to load categories');
        }
    }



    onCategoryChange(event: Event, categoryId: string): void {
        const input = event.target as HTMLInputElement;

        if (!this.product.categoryIds) {
            this.product.categoryIds = [];
        }

        if (input.checked) {
            // Add the category ID to the product's categoryIds array          
            this.product.categoryIds.push(categoryId);
        } else {
            // Remove the category ID from the product's categoryIds array           
            const index = this.product.categoryIds.indexOf(categoryId);
            if (index > -1) {
                this.product.categoryIds.splice(index, 1);
            }

        }
        console.log('Updated categories:', this.product.categoryIds);
    }




    public async send(): Promise<void> {
        if (this.isSubmitting) return;
        this.isSubmitting = true;
        try {
            if (this.myForm.form.invalid) {
                Object.values(this.myForm.controls).forEach(control => {
                    control.markAsTouched();
                });
                notify.error('Please fill all required fields correctly');
                return;
            }
            if (this.myImage?.nativeElement?.files?.length > 0) {
                this.product.image = this.myImage.nativeElement.files[0];
            } else {
                notify.error('Please select an image');
                return;
            }
            // Validate product data before sending to service
            if (!this.validateProduct(this.product)) {
                return;
            }
            console.log('Sending product with categories:', this.product.categoryIds); // Add this line
             // Ensure categoryIds are strings
             this.product.categoryIds = this.product.categoryIds.map(id => id.toString());
            
             const addedProduct = await this.productsService.addProduct(this.product);
             console.log('Product added successfully:', addedProduct);
            this.productAdded.emit();
            notify.success('Product added successfully');
          
            this.resetForm();
        }
        catch (err: any) {
            console.error('Error adding product:', err);
            notify.error(err.message || 'Error adding product');
        }
        finally {
            this.isSubmitting = false;
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.product.image = file;
            this.previewImage(file);
        }
    }

    previewImage(file: File): void {
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    private resetForm(): void {
        this.product = new ProductModel();
        this.product.categoryIds = []; // Reset categories
        this.imagePreview = null;

        if (this.myImage && this.myImage.nativeElement) {
            this.myImage.nativeElement.value = '';
        }
        this.myForm.resetForm();
    }

    private validateProduct(product: ProductModel): boolean {
        if (!product.name || product.name.length < 2 || product.name.length > 100) {
            notify.error('Product name must be between 2 and 100 characters');
            return false;
        }
        if (!product.description || product.description.length > 500) {
            notify.error('Product description must not exceed 500 characters');
            return false;
        }
        if (product.price === undefined || product.price < 0 || product.price > 1000) {
            notify.error('Product price must be between 0 and 1000');
            return false;
        }
        if (product.product_weight_grams === undefined || product.product_weight_grams < 0 || product.product_weight_grams > 1000) {
            notify.error('Product weight must be between 0 and 1000 grams');
            return false;
        }
        if (!product.categoryIds || product.categoryIds.length === 0) {
            notify.error('Please select at least one category');
            return false;
        }
        if (!product.categoryIds || product.categoryIds.length === 0) {
            notify.error('Please select at least one category');
            return false;
        }


        return true;
    }


}