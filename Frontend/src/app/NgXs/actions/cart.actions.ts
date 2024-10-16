
import { ProductModel } from "../../models/product.model";


// You might want to import this type from cart.state.ts if you decide to export it
type CartItem = ProductModel & { quantity: number };

// Define the types of actions related to the cart.
export class ToggleCartModal {
    static readonly type = '[Cart] Toggle Cart Modal';
  }
  
  export class AddToCart {
    static readonly type = '[Cart] Add To Cart';
    constructor(public payload: { product: ProductModel, quantity: number }) {}
  }

  export class RemoveFromCart {
    static readonly type = '[Cart] Remove From Cart';
    constructor(public payload: { productId: string }) {}
  }

  export class UpdateCartItemQuantity {
    static readonly type = '[Cart] Update Cart Item Quantity';
    constructor(public payload: { productId: string, quantity: number }) {}
  }

  // If you want to add a new action to update the entire cart item at once
export class UpdateCartItem {
    static readonly type = '[Cart] Update Cart Item';
    constructor(public payload: { item: CartItem }) {}
}

export class ClearCart {
    static readonly type = '[Cart] Clear Cart';
  }
  
  export class LoadUserCart {
    static readonly type = '[Cart] Load User Cart';
    constructor(public userId: string) {}
  }

  
  