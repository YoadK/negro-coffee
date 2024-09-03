import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsCategoriesService } from '../../../services/products-categories.service';
import { CategoriesService } from '../../../services/categories.service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.module.scss']
})
export class CategoryFilterComponent implements OnInit {
  categories: any[] = [];
  @Output() categorySelected = new EventEmitter<string | null>();
  @Input() productCount: number = 0;
  constructor( private categoriesService:CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    try {
      this.categories = await this.categoriesService.getAllCategories();
      console.log('Loaded categories:', this.categories.length);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  onCategoryClick(categoryId: string | null): void {
    console.log('Category clicked:', categoryId);
    this.categorySelected.emit(categoryId);
  }

  
  // This method can be called from the parent component to update the product count
  updateProductCount(count: number): void {
    this.productCount = count;
  }

}