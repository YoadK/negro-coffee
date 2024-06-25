import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductModel} from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../SharedArea/shared-module';
import { Store } from '@ngxs/store';

import { AddToCart } from '../../../NgXs/actions/cart.actions';



//ng g c components/products-area/product-card

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink,CommonModule, SharedModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.module.scss']
})
export class ProductCardComponent {

    @Input() //Props
    public product: ProductModel;

    constructor(private store: Store) {}

    addToCart() {
      const quantityInput = document.getElementById(`item-${this.product._id}`) as HTMLInputElement;
      const quantity = parseInt(quantityInput.value, 10) || 1;
      this.store.dispatch(new AddToCart({ product: this.product, quantity: 1 }));
    }
  
    setDefaultImage(event: any): void {
        event.target.src = "http://localhost:4000/api/products/images/default-Image.jpg";
    }
    

}
