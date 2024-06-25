import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductModel } from '../../../models/product.model';





@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductCardComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.module.scss'
})
export class ProductListComponent implements OnInit {

    public products: ProductModel[];


    //DI- Dependency injection
    public constructor(private title: Title, private productsService: ProductsService) {
    }

    public async ngOnInit(): Promise<void> {
        try{
        this.title.setTitle("Negro's espresso shop | Products");
        console.log('Calling getAllProducts()');
        this.products = await this.productsService.getAllProducts();
        // console.log(this.products);
        // console.log("'product-list' component ready for use");
        }
        catch(err:any){ alert(err.message); }
    }


    ngOnDestroy(): void {
        console.log("'product-list'  component is about to be destroyed");
    }

}
