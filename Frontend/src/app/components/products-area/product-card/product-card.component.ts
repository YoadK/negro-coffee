import { Component, Input } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { Store } from '@ngxs/store';
import { AddToCart } from '../../../NgXs/actions/cart.actions';
import { QuantitySelectorComponent } from '../../SharedArea/quantity-selector/quantity-selector.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../SharedArea/shared-module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule, SharedModule, QuantitySelectorComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.module.scss']
})
export class ProductCardComponent {
  @Input() product: ProductModel;
  quantity: number = 1;

  constructor(private store: Store) {}

  addToCart() {
    if (this.quantity > 0) {
      this.store.dispatch(new AddToCart({ product: this.product, quantity: this.quantity }));
      this.quantity = 1;
    }
  }

  setDefaultImage(event: any): void {
    event.target.src = "http://localhost:4000/api/products/images/default-Image.jpg";
  }
}