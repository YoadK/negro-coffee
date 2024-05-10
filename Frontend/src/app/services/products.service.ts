import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CategoryModel } from '../models/category.model';
import { appConfig } from '../app.config';
import { firstValueFrom } from 'rxjs';
import { ProductModel } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {


    constructor(private http: HttpClient) { } // DI for an 'axios' like object.

    // get All Products
    public async getAllProducts(): Promise<ProductModel[]> {
        const observable = this.http.get<ProductModel[]>(appConfig.productsUrl);
        const Products = await firstValueFrom(observable);
        return Products;
    }

    //get one product
    public async getOneProduct(_id: string): Promise<ProductModel> {
        const observable = this.http.get<ProductModel>(appConfig.productsUrl + _id);
        const product = await firstValueFrom(observable);
        return product;
    }


    //get All Categories
    public async getAllCategories(): Promise<CategoryModel[]> {
        const observable = this.http.get<CategoryModel[]>(appConfig.categoriesUrl);
        const Categories = await firstValueFrom(observable);
        return Categories;
    }


    //search products
    public async searchProducts(text: string): Promise<ProductModel[]> {
        const observable = this.http.get<ProductModel[]>(appConfig.searchUrl + text);
        const products = await firstValueFrom(observable);
        return products;
    }

    //add product:
    public async addProduct(product: ProductModel): Promise<void> {
        const observable = this.http.post<ProductModel>(appConfig.productAddUrl, product);
        const addedProduct = await firstValueFrom(observable);
        console.log(addedProduct);
    }

    //update product
    public async updateProduct(product: ProductModel): Promise<void> {
        const observable = this.http.put<ProductModel>(appConfig.productsUrl + product._id, product);
        const updatedProduct = await firstValueFrom(observable);
        console.log(updatedProduct);
    }


    //delete product:
    public async deleteProduct(_id: string): Promise<void> {
        const observable = this.http.delete<ProductModel>(appConfig.productsUrl + _id);
        await firstValueFrom(observable);
    }
}




