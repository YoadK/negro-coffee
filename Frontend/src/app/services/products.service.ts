import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductModel } from '../models/product.model';
import { appConfig } from '../Utils/app.config';
import { lastValueFrom } from 'rxjs';
import { Store } from '@ngxs/store';
import { DeleteProduct, UpdateProductQuantity } from '../NgXs/actions/product.actions';
import { notify } from '../Utils/Notify';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient, private store: Store) {}

  async getAllProducts(): Promise<ProductModel[]> {
    try {
      const products = await lastValueFrom(this.http.get<ProductModel[]>(appConfig.productsUrl));
      // Instead of dispatching SetAllProducts, we'll update quantities for each product
      products.forEach(product => {
        this.store.dispatch(new UpdateProductQuantity({ productId: product._id, quantity: product.product_weight_grams }));
      });
      return products;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getOneProduct(id: string): Promise<ProductModel> {
    try {
      return await lastValueFrom(this.http.get<ProductModel>(`${appConfig.productsUrl}${id}`));
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async addProduct(product: ProductModel): Promise<ProductModel> {
    const formData = new FormData();
    this.appendProductData(formData, product);

    try {
      const newProduct = await lastValueFrom(this.http.post<ProductModel>(appConfig.productAddUrl, formData));
      // Update the store with the new product's quantity
      this.store.dispatch(new UpdateProductQuantity({ productId: newProduct._id, quantity: newProduct.product_weight_grams }));
      return newProduct;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProduct(product: ProductModel): Promise<ProductModel> {
    const formData = new FormData();
    this.appendProductData(formData, product);

    try {
      const updatedProduct = await lastValueFrom(this.http.put<ProductModel>(`${appConfig.productsUrl}${product._id}`, formData));
      // Update the store with the updated product's quantity
      this.store.dispatch(new UpdateProductQuantity({ productId: updatedProduct._id, quantity: updatedProduct.product_weight_grams }));
      return updatedProduct;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await lastValueFrom(this.http.delete<void>(`${appConfig.productsUrl}${id}`));
      this.store.dispatch(new DeleteProduct(id));
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async searchProducts(text: string): Promise<ProductModel[]> {
    try {
      return await lastValueFrom(this.http.get<ProductModel[]>(`${appConfig.searchUrl}${text}`));
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private appendProductData(formData: FormData, product: ProductModel): void {
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('product_weight_grams', product.product_weight_grams.toString());
    
    if (product.image instanceof File) {
      formData.append('image', product.image, product.image.name);
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