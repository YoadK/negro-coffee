import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HebrewQuantityPipe } from './hebrew-quantity.pipe'; // Make sure the path is correct
import { SpinnerComponent } from './spinner/spinner.component';
import {  TranslateCategoryNamePipe } from './translate-category-name.pipe';




@NgModule({
  declarations: [
    HebrewQuantityPipe,
    TranslateCategoryNamePipe],

  imports: [
    CommonModule // CommonModule if you use *ngFor, *ngIf, etc, in your shared components/pipes
  ],

  exports: [
    HebrewQuantityPipe, // Exporting the pipe so it can be used in other parts of the app,
    //SpinnerComponent,
    TranslateCategoryNamePipe
  ],

  providers: [
    
  ]
})
export class SharedModule {

}
