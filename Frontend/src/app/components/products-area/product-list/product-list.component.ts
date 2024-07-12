import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductModel } from '../../../models/product.model';
import { SpinnerComponent } from '../../SharedArea/spinner/spinner.component';
import { Store, Select } from '@ngxs/store';
import { AuthState } from '../../../NgXs/state/auth.state';
import { Observable } from 'rxjs';
import { SpinnerLoadingService } from '../../../services/spinner.loading.service';


@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductCardComponent, SpinnerComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.module.scss'
})
export class ProductListComponent implements OnInit {

    public products: ProductModel[];


    //DI- Dependency injection
    public constructor(private title: Title, private productsService: ProductsService, private spinnerLoadingService: SpinnerLoadingService
    ) {
    }

    public async ngOnInit(): Promise<void> {
        try {
            this.title.setTitle("Negro's espresso shop | Products");
            console.log('Calling getAllProducts()');
            
            // Start the spinner
            this.spinnerLoadingService.setLoading(true);
            
            this.products = await this.productsService.getAllProducts();
        }
        catch(err: any) {
            alert(err.message);
        }
        finally {
            // Stop the spinner
            this.spinnerLoadingService.setLoading(false);
        }
    }


    ngOnDestroy(): void {
        console.log("'product-list'  component is about to be destroyed");
    }

}
