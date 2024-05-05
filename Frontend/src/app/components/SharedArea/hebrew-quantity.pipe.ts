import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hebrewQuantity'
})
export class HebrewQuantityPipe implements PipeTransform {
  transform(value: any): any {
     return `${value} גרם`; // Appends 'גרם' to the quantity

  }
}
