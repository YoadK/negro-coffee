import { ObjectId } from "mongoose";
import { ProductModel } from "../../models/product.model";


// You might want to import this type from cart.state.ts if you decide to export it
type CartItem = ProductModel & { quantity: number };


  
  export class AddToCart {
    static readonly type = '[Cart] Add To Cart';
    constructor(public payload: { product: ProductModel, quantity: number }) {}
  }

  

  export class UpdateProductQuantity {
    static readonly type = '[Product] Update Product Quantity';
    constructor(public payload: { productId: ObjectId, quantity: number }) {}
  }

  
  