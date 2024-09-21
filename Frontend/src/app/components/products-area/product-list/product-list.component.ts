import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SpinnerComponent } from '../../SharedArea/spinner/spinner.component';
import { SpinnerLoadingService } from '../../../services/spinner.loading.service';
import { BehaviorSubject, Observable } from 'rxjs';

import { ProductModel } from '../../../models/product.model';

import { ActivatedRoute } from '@angular/router';
import { ProductsFilterComponent } from '../../SharedArea/products-filter/products-filter.component';
import { CategoriesService } from '../../../services/categories.service';
import { ProductsService } from '../../../services/products.service';


@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductCardComponent, SpinnerComponent, ProductsFilterComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.module.scss'
})
export class ProductListComponent implements OnInit {
    private productsSubject = new BehaviorSubject<ProductModel[]>([]);
    products$: Observable<ProductModel[]> = this.productsSubject.asObservable();
  
    categoryId: string | null = null;
    productCount: number = 0;
    categories: any[] = [];

     @ViewChild(ProductsFilterComponent) filterComponent: ProductsFilterComponent;    

    constructor(
        private title: Title,      
        private categoriesService: CategoriesService, 
        private productsService: ProductsService,  
        private spinnerLoadingService: SpinnerLoadingService,
        private route: ActivatedRoute
    ) { }

    public async ngOnInit(): Promise<void> {
        try {
            this.title.setTitle("Negro's espresso shop | Products");
            console.log('Initializing ProductListComponent');

            this.spinnerLoadingService.setLoading(true);

            // Get category ID from route parameter
            this.categoryId = this.route.snapshot.paramMap.get('categoryId');
            console.log('Category ID from route:', this.categoryId);

           
            // Fetch categories and pass them to ProductsFilterComponent
            this.categories = await this.categoriesService.getAllCategories();
            console.log('Categories loaded:', this.categories.length);

            // Filter and fetch products based on the initial category (if any)
            await this.filterAndFetchProducts(this.categoryId);
        }
        catch (err: any) {
            console.error('Error initializing ProductListComponent:', err);
            alert(err.message);
        }
        finally {
            this.spinnerLoadingService.setLoading(false);
        }
    }

    async onCategorySelected(categoryId: string | null): Promise<void> {
        console.log('Category selected:', categoryId);
        this.categoryId = categoryId;
        await this.filterAndFetchProducts(categoryId);
    }

    //filterAndFetchProducts-
    /* It first filters the allProductAssociations based on the selected category 
    (or uses all associations if no category is selected).
    Then, it fetches the full product details for each relevant product ID.
    Finally, it updates the productsSubject with the fetched products */
    private async filterAndFetchProducts(categoryId: string | null): Promise<void> {
        this.spinnerLoadingService.setLoading(true);
        
        try {
            let products: ProductModel[];

            if (categoryId === null) {
                console.log('Showing all products');
                products = await this.productsService.getAllProducts();
            } else {
                console.log('Filtering products for category:', categoryId);
                products = await this.productsService.getProductsByCategoryId(categoryId);
            }

            console.log('Fetched products:', products.length);

            // Update the BehaviorSubject with the new products
            this.productsSubject.next(products);

            // Update the product count
            this.productCount = products.length;
            
        } catch (error) {
            console.error('Error filtering and fetching products:', error);
            alert('An error occurred while loading products. Please try again.');
        } finally {
            this.spinnerLoadingService.setLoading(false);
        }
    }


    updateProductCount(count: number) {
        this.productCount = count;
    }
    
}