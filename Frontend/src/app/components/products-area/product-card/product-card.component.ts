import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductModel } from '../../../models/product.model';


//ng g c components/products-area/product-card

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.module.scss'
})
export class ProductCardComponent {

    @Input() //Props
    public product: ProductModel;

}
