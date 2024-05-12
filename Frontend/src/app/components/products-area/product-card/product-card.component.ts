import { Component, Input, NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductModel } from '../../../models/product.model';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../SharedArea/shared-module';
import { appConfig } from '../../../app.config';


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

  
    setDefaultImage(event: any): void {
        event.target.src = "http://localhost:4000/api/products/images/default-Image.jpg";
    }
    

}
