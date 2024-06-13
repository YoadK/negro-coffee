import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HebrewQuantityPipe } from './hebrew-quantity.pipe'; // Make sure the path is correct

@NgModule({
  declarations: [
    HebrewQuantityPipe 
  ],
  imports: [
    CommonModule // CommonModule if you use *ngFor, *ngIf, etc, in your shared components/pipes
  ],
  exports: [
    HebrewQuantityPipe // Exporting the pipe so it can be used in other parts of the app
  ]
})
export class SharedModule {}
