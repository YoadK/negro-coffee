import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { appConfig } from '../Utils/app.config';
import { lastValueFrom } from 'rxjs';
import { ProductCategoryModel } from '../models/product.category.Model';
import { ProductModel } from '../models/product.model';
import { notify } from '../Utils/Notify';

@Injectable({
    providedIn: 'root'
})
export class ProductsCategoriesService {

    constructor(private http: HttpClient) { }

    
  



    // Purpose: Fetch all product-category associations
    // Use case: When you need to know which products belong to which categories for all products
    async getAllProductCategoryAssociations(): Promise<ProductCategoryModel[]> {
        try {
            alert ("getAllProductCategoryAssociations");
            const associations = await lastValueFrom(this.http.get<ProductCategoryModel[]>(`${appConfig.productsUrl}categories`));
            console.log('Fetched all product-category associations:', associations.length);
            return associations;
        } catch (error) {
            console.error('Error fetching product-category associations:', error);
            throw error;
        }
    }
    
    

   

    
}