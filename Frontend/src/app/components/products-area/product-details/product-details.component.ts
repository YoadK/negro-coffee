import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ProductModel } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.module.scss'
})
export class ProductDetailsComponent implements OnInit {

    public product: ProductModel;


    public constructor(
        private title: Title,
        private productsService: ProductsService,
        private router: Router, // Inject the Router service
        private activatedRoute: ActivatedRoute) { }

    // activatedRoute --> service for getting route parameters (and more....) on the current route
    // activatedRoute.snapshot --> current route format.
    // activatedRoute.snapshot.params --> current route parameters.
    public async ngOnInit(): Promise<void> {
        try {
            const id = this.activatedRoute.snapshot.params["id"];
            this.product = await this.productsService.getOneProduct(id);
            this.title.setTitle("Coffee shop | " + this.product.name);
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    public async deleteMe(id: string) {
        try {
            // ask the user to confirm...
            const sure = window.confirm("Are you sure?");
            if (!sure) return;

            await this.productsService.deleteProduct(id);

            console.log("Product has been deleted.");

            // Navigate to 'products' page after deleting the product
            this.router.navigateByUrl("/products");

        }
        catch (err: any) {
            console.log(err.message);
        }
    }

}
