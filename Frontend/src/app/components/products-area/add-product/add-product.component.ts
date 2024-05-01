import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';

@Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [FormsModule,CommonModule],
    templateUrl: './add-product.component.html',
    styleUrl: './add-product.component.module.scss'
})
export class AddProductComponent {

    public product = new ProductModel();

    public constructor(private productsService: ProductsService, private router: Router) {    }

    @ViewChild("myImage") //get #myImage element into myImage variable:
    public myImage: ElementRef<HTMLInputElement>;//container for myImage



    public async send(): Promise<void> {
        try {
            console.log(this.product);
            //console.log(this.product);
            this.product.image=this.myImage.nativeElement.files[0];           

            //a. add product to backend
            await this.productsService.addProduct(this.product);

            alert("product has been added!");

            //b/ redirect to "/products"
            this.router.navigateByUrl("/products");
        }
        catch (err: any) { alert(err.message); }
    }

}
