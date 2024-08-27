import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SpinnerComponent } from '../../SharedArea/spinner/spinner.component';
import { SpinnerLoadingService } from '../../../services/spinner.loading.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryFilterComponent } from "../../SharedArea/products-filter/products-filter.component";
import { ProductsCategoriesService } from '../../../services/products-categories.service';
import { ProductWithCategories } from '../../../models/productsWithCategories';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductCardComponent, SpinnerComponent, CategoryFilterComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.module.scss'
})
export class ProductListComponent implements OnInit {    
    private productsSubject = new BehaviorSubject<ProductWithCategories[]>([]);
    products$: Observable<ProductWithCategories[]> = this.productsSubject.asObservable();
    private allProducts: ProductWithCategories[] = [];

    constructor(
        private title: Title,
        private productsCategoriesService: ProductsCategoriesService,
        private spinnerLoadingService: SpinnerLoadingService
    ) {}

    public async ngOnInit(): Promise<void> {
        try {
            this.title.setTitle("Negro's espresso shop | Products");
            console.log('Calling getAllProductsWithCategories()');
            
            this.spinnerLoadingService.setLoading(true);
            
            this.allProducts = await this.productsCategoriesService.getAllProductsWithCategories();
            this.productsSubject.next(this.allProducts);
        }
        catch(err: any) {
            alert(err.message);
        }
        finally {
            this.spinnerLoadingService.setLoading(false);
        }
    }

    onCategorySelected(categoryId: string | null): void {
        if (categoryId === null) {
            this.productsSubject.next(this.allProducts);
        } else {
            const filteredProducts = this.allProducts.filter(product => 
                product.categories.some(category => category._id.toString() === categoryId)
            );
            this.productsSubject.next(filteredProducts);
        }
    }
}