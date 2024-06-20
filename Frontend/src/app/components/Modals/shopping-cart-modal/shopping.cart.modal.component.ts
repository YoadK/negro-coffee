import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ToggleCartModal } from '../../../NgXs/actions/cart.actions';
import { CommonModule } from '@angular/common';
import { CartState } from '../../../NgXs/state/cart.state';


@Component({
    selector: 'app-shopping-cart-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './shopping.cart.modal.component.html',
    styleUrl: './shopping.cart.modal.component.module.scss'
})
export class ShoppingCartModalComponent {


    @Select(CartState.isCartModalOpen) isCartModalOpen$: Observable<boolean>;

    constructor(private store: Store) {
       
    }

    ngOnInit(): void {
        this.isCartModalOpen$.subscribe(isOpen => {
          console.log('isCartModalOpen$ value:', isOpen); // Add log
        });
      }
    

    toggleCartModal() {
        console.log('toggleCartModal called'); // Add log
        this.store.dispatch(new ToggleCartModal());
    }
}
