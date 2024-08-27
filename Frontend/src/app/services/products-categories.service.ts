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
export class ProductsCategoriesService {

    constructor(private http: HttpClient, private store: Store) { }


    async getProductsByCategory(categoryId: string): Promise<ProductModel[]> {
        return await lastValueFrom(this.http.get<ProductModel[]>(`${appConfig.productsUrl}category/${categoryId}`));
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