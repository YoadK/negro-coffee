import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductModel } from '../models/product.model';
import { appConfig } from '../Utils/app.config';
import { lastValueFrom } from 'rxjs';
import { Store } from '@ngxs/store';
import { DeleteProduct, UpdateProductQuantity } from '../NgXs/actions/product.actions';
import { notify } from '../Utils/Notify';
import { ProductsCategoriesService } from './products-categories.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(
    private http: HttpClient, 
    private store: Store,
    private productsCategoriesService: ProductsCategoriesService
) {}

  async getAllProducts(): Promise<ProductModel[]> {
    try {
      const products = await lastValueFrom(this.http.get<ProductModel[]>(appConfig.productsUrl));
      console.log('Fetched all products:', products.length);
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

  async getOneProduct(productId: string): Promise<ProductModel> {
    try {
      const product = await lastValueFrom(this.http.get<ProductModel>(`${appConfig.productsUrl}${productId}`));
      console.log('Fetched product details for:', productId);
      console.log('Fetched product:', product);
      return product;
    } catch (error) {
        console.error('Error fetching product details:', error);
      this.handleError(error);
      throw error;
    }
  }

  

  async addProduct(product: ProductModel): Promise<ProductModel> {
    const formData = new FormData();
    this.appendProductData(formData, product);

    try {
      const newProduct = await lastValueFrom(this.http.post<ProductModel>(appConfig.productAddUrl, formData));
      console.log('Added new product:', newProduct);
      // Update the store with the new product's quantity
      this.store.dispatch(new UpdateProductQuantity({ productId: newProduct._id, quantity: newProduct.product_weight_grams }));
      
         // Add the new product to productCategoryRelations
         await this.productsCategoriesService.addProductToCategories(newProduct._id);
      
      return newProduct;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProduct(product: ProductModel,categoryIds: string[]): Promise<ProductModel> {
    const formData = new FormData();
    this.appendProductData(formData, product);

    try {
      const updatedProduct = await lastValueFrom(this.http.put<ProductModel>(`${appConfig.productsUrl}${product._id}`, formData));
      console.log('Updated product:', updatedProduct);
      // Update the store with the updated product's quantity
      this.store.dispatch(new UpdateProductQuantity({ productId: updatedProduct._id, quantity: updatedProduct.product_weight_grams }));
      
      // Update the product in productCategoryRelations
      await this.productsCategoriesService.updateProductCategories(updatedProduct._id, categoryIds);

      
      return updatedProduct;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await lastValueFrom(this.http.delete<void>(`${appConfig.productsUrl}${id}`));
      console.log('Deleted product:', id);
      this.store.dispatch(new DeleteProduct(id));

       // Remove the product from productCategoryRelations
       await this.productsCategoriesService.removeProductFromCategories(id);

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async searchProducts(text: string): Promise<ProductModel[]> {
    try {
      const products = await lastValueFrom(this.http.get<ProductModel[]>(`${appConfig.searchUrl}${text}`));
      console.log('Search results:', products.length);
      return products;
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