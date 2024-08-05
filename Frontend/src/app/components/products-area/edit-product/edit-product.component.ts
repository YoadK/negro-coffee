import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductModel } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';
import { notify } from '../../../Utils/Notify';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-product',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './edit-product.component.html',
    styleUrl: './edit-product.component.module.scss'
})
export class EditProductComponent implements OnInit {
    public product = new ProductModel();
    public imagePreview: SafeUrl | null = null;
    public fileName: string = '';

    @ViewChild("myImage") 
    public myImage: ElementRef<HTMLInputElement>;

    constructor(
        private productsService: ProductsService, 
        private router: Router, 
        private activatedRoute: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { }

    async ngOnInit(): Promise<void> {
        const productId = this.activatedRoute.snapshot.params["id"] as string;
        if (productId) {
            try {
                this.product = await this.productsService.getOneProduct(productId);
                if (this.product.imageUrl) {
                    // Changed: Directly set imagePreview to product.imageUrl without using sanitizer
                    this.imagePreview = this.product.imageUrl;
                    this.fileName = this.getFileNameFromUrl(this.product.imageUrl);
                }
            } catch (err: any) {
                console.error('Error loading product:', err);
                notify.error('Error loading product');
                this.router.navigate(['product-management']);
            }
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.fileName = file.name;
            
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    public async send(): Promise<void> {
        try {
            if (this.myImage?.nativeElement?.files?.length > 0) {
                this.product.image = this.myImage.nativeElement.files[0];
            }
            await this.productsService.updateProduct(this.product);
            notify.success("Product has been updated!");
            this.router.navigateByUrl("/products");
        } catch (error) {
            console.error("Error updating product:", error);
            if (error instanceof HttpErrorResponse) {
                notify.error(`Backend error: ${error.message}`);
            } else {
                notify.error("An unexpected error occurred. Please try again.");
            }
        }
    }

    private getFileNameFromUrl(url: string): string {
        return url.split('/').pop() || '';
    }
}