import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';

@Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './add-product.component.html',
    styleUrl: './add-product.component.module.scss'
})
export class AddProductComponent {
    @Output() productAdded = new EventEmitter<void>();
    
    public product = new ProductModel();
    public quantity: number = 1;

    @ViewChild("myImage")
    public myImage: ElementRef<HTMLInputElement>;

    constructor(private productsService: ProductsService, private router: Router) { }

    public async send(): Promise<void> {
        try {
            console.log(this.product);
           
            this.product.image = this.myImage.nativeElement.files[0];           

            await this.productsService.addProduct(this.product);

            this.productAdded.emit(); // Emit event when product is added
            this.resetForm();
        }
        catch (err: any) { 
            console.error('Error adding product:', err);
            alert(err.message); 
        }
    }

    private resetForm(): void {
        this.product = new ProductModel();
        this.quantity = 1;
        if (this.myImage && this.myImage.nativeElement) {
            this.myImage.nativeElement.value = '';
        }
    }
}