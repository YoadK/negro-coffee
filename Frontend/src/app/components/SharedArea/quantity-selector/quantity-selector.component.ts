import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quantity-selector.component.html',
  styleUrl: './quantity-selector.component.module.scss'
})
export class QuantitySelectorComponent {
  @Input() quantity: number = 0;
  @Output() quantityChange = new EventEmitter<number>();

  increase() {
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }

  decrease() {
    if (this.quantity > 0) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }
}