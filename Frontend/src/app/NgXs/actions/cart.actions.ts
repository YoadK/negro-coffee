export class ToggleCartModal {
    static readonly type = '[Cart] Toggle Cart Modal';
  }
  
  export class AddToCart {
    static readonly type = '[Cart] Add To Cart';
    constructor(public payload: { productId: string, quantity: number }) {}
  }
  