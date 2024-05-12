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
        const observable = this.http.get<ProductModel>(appConfig.productsUrl + _id); // returns an observable object object
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
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price.toString());
        formData.append('quantity', product.quantity.toString());
        formData.append('image', product.image);

        console.log("added product name is: "+product.name);
        console.log("added product description is: "+product.description);
        console.log("added product price is: "+product.price);
        console.log("added product quantity is: "+product.quantity);
        console.log("added product image name is: "+product.image.name);


        const observable = this.http.post<ProductModel>(appConfig.productAddUrl, formData);// returns an observable object 
        const addedProduct = await firstValueFrom(observable);

        console.log("added product is: "+addedProduct);
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




