import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SpinnerComponent } from '../../SharedArea/spinner/spinner.component';
import { SpinnerLoadingService } from '../../../services/spinner.loading.service';
import { BehaviorSubject, Observable } from 'rxjs';
// import { CategoryFilterComponent } from "../../SharedArea/products-filter/products-filter.component";
import { ProductsCategoriesService } from '../../../services/products-categories.service';
import { ProductModel } from '../../../models/product.model';
import { ProductCategoryModel } from '../../../models/product.category.Model';
import { ActivatedRoute } from '@angular/router';
import { ProductsFilterComponent } from '../../SharedArea/products-filter/products-filter.component';
import { CategoriesService } from '../../../services/categories.service';

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
    private allProductAssociations: ProductCategoryModel[] = [];
    categoryId: string | null = null;
    productCount: number = 0;
    categories: any[] = [];

     @ViewChild(ProductsFilterComponent) filterComponent: ProductsFilterComponent;    

    constructor(
        private title: Title,
        private productsCategoriesService: ProductsCategoriesService,
        private categoriesService: CategoriesService, // Inject CategoriesService here
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

            // Fetch all product-category associations
            this.allProductAssociations = await this.productsCategoriesService.getAllProductCategoryAssociations();
            console.log('All product-category associations loaded:', this.allProductAssociations.length);

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
            let relevantAssociations: ProductCategoryModel[];

            if (categoryId === null) {
                console.log('Showing all products');
                relevantAssociations = this.allProductAssociations;
            } else {
                console.log('Filtering products for category:', categoryId);
                relevantAssociations = this.allProductAssociations.filter(
                    assoc => assoc.categoryIds.includes(categoryId)
                );
            }

            console.log('Relevant associations found:', relevantAssociations.length);

            // Fetch product details for each relevant association
            const productPromises = relevantAssociations.map(assoc =>
                this.productsCategoriesService.getProductDetails(assoc.productId)
            );

            const products = await Promise.all(productPromises);
            console.log('Fetched product details:', products.length);

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