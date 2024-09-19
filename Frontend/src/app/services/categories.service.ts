import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductModel } from '../models/product.model';
import { appConfig } from '../Utils/app.config';
import { lastValueFrom } from 'rxjs';
import { Store } from '@ngxs/store';
import { DeleteProduct, UpdateProductQuantity } from '../NgXs/actions/product.actions';
import { notify } from '../Utils/Notify';
import { CategoryModel } from '../models/category.model';



@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    constructor(
        private http: HttpClient, 
        private store: Store,
       ) { }


    async getAllCategories(): Promise<CategoryModel[]> {
        try {
          const categories = await lastValueFrom(this.http.get<CategoryModel[]>(`${appConfig.categoriesUrl}`));
          console.log('Fetched categories:', categories.length);
          return categories;
        } catch (error) {
            console.log('An error occurred while fetching categories data');
          this.handleError(error);
          throw error;
        }
      }

      
    async deleteCategory(categoryId: string): Promise<void> {
        try {
            await lastValueFrom(this.http.delete<void>(`${appConfig.categoriesUrl}${categoryId}`));
            console.log('Deleted category:', categoryId);
            
           
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    private handleError(error: any) {
        let errorMessage = 'An unknown error occurred!';
        if (error instanceof HttpErrorResponse) {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        } else if (error instanceof Error) {
            errorMessage = `Error: ${error.message}`;
        }
        console.error(errorMessage);
        notify.error(errorMessage);
    }
}