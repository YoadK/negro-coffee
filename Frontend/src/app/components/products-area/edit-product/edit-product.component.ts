import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IProductModel } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';

@Component({
    selector: 'app-edit-product',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './edit-product.component.html',
    styleUrl: './edit-product.component.module.scss'
})
export class EditProductComponent implements OnInit {

    public product = new IProductModel();

    public constructor(private productsService: ProductsService, private router: Router,private activatedRoute: ActivatedRoute) { }


    @ViewChild("myImage") //get #myImage element into myImage variable:
    public myImage: ElementRef<HTMLInputElement>;//container for myImage

 

    async ngOnInit(): Promise<void> {
        const productId = this.activatedRoute.snapshot.params["id"]; // Use ActivatedRoute to get the product ID from the route parameters
        this.product = await this.productsService.getOneProduct(productId); // Fetch the product details to display for editing
       
    }

    public async send(): Promise<void> {

        try {
            
            if (!this.myImage || !this.myImage.nativeElement || !this.myImage.nativeElement.files) {
                // Handle case where myImage or its properties are not available
                console.error("Image element or its properties are not available.");
                return;
            }
    
            this.product.image = this.myImage.nativeElement.files[0];
    
            //a. add product to backend
            await this.productsService.updateProduct(this.product);
    
            alert("product has been updated!");
            
            //b/ redirect to "/products"
            this.router.navigateByUrl("/products");
        }
    
        catch (error) {
            if (error instanceof HttpErrorResponse) {
                console.error("Backend error:", error);
                alert("Failed to update product! Please try again.");
            } else {
                console.error("Unexpected error:", error);
                alert("An error occurred. Please try again.");
            }
        }
    }
    

    


}
