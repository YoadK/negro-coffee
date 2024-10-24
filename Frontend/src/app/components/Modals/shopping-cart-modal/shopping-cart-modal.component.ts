import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ToggleCartModal, RemoveFromCart, UpdateCartItemQuantity } from '../../../NgXs/actions/cart.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartState } from '../../../NgXs/state/cart.state';
import { SharedModule } from '../../SharedArea/shared-module';
import { ProductModel } from '../../../models/product.model';
import { QuantitySelectorComponent } from '../../SharedArea/quantity-selector/quantity-selector.component';
import { Router } from '@angular/router';


@Component({
    selector: 'app-shopping-cart-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, SharedModule, QuantitySelectorComponent],
    templateUrl: './shopping-cart-modal.component.html',
    styleUrl: './shopping-cart-modal.component.module.scss'
})
export class ShoppingCartModalComponent implements OnInit {

    //reflects the 'isCartModalOpen' value in the state (boolean value)
    @Select(CartState.isCartModalOpen) isCartModalOpen$: Observable<boolean>;
    // reflects the cartItems: the  list of items in the cart that is being holded in the cart state
    @Select(CartState.cartItems) cartItems$: Observable<Array<ProductModel & { quantity: number }>>;
    
    total = { price: 0, quantity: 0 };

    constructor(private store: Store, private router: Router, // Inject the Router service
    ) {}

    ngOnInit(): void {
        this.isCartModalOpen$.subscribe(isOpen => {
            console.log('isCartModalOpen$ value:', isOpen);
        });
        this.cartItems$.subscribe(items => {
            console.log('cartItems$ value:', items);
            this.calculateTotal(items);
        });
    }

  
    toggleCartModal() {
        console.log('toggleCartModal called');
        this.store.dispatch(new ToggleCartModal());
    }
    

    updateQuantity(item: ProductModel & { quantity: number }, newQuantity: number) {
        this.store.dispatch(new UpdateCartItemQuantity({ productId: item._id, quantity: newQuantity}));
      }

    removeItem(item: ProductModel & { quantity: number }) {
        this.store.dispatch(new RemoveFromCart({ productId: item._id }));
    }

    calculateTotal(items: Array<ProductModel & { quantity: number }>) {
        this.total.price = items.reduce((sum, item) => sum + (item?.price || 0) * item.quantity, 0);
        this.total.quantity = items.reduce((sum, item) => sum + item.quantity, 0);
      }

      continueShopping(){
        this.toggleCartModal();
        this.router.navigateByUrl("/products");

      }
      
}