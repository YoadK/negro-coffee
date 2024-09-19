import { ObjectId } from "mongoose";
import { ProductModel } from "../../models/product.model";

type CartItem = ProductModel & { quantity: number };

export class AddToCart {
  static readonly type = '[Cart] Add To Cart';
  constructor(public payload: { product: ProductModel, quantity: number }) {}
}

export class UpdateProductQuantity {
  static readonly type = '[Product] Update Product Quantity';
  constructor(public payload: { productId: string, quantity: number }) {}
}

export class AddProduct {
  static readonly type = '[Product] Add Product';
  constructor(public payload: ProductModel) {}
}

export class UpdateProduct {
  static readonly type = '[Product] Update Product';
  constructor(public payload: ProductModel) {}
}

export class DeleteProduct {
  static readonly type = '[Product] Delete Product';
  constructor(public payload: string) {}
}