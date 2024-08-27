import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsCategoriesService } from '../../../services/products-categories.service';
import { CategoriesService } from '../../../services/categories.service';

interface Category {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-products-filtering',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-filtering.component.html',
  styleUrls: ['./products-filtering.component.module.scss']
})
export class ProductsFilteringComponent implements OnInit {
  categories: Category[] = [];
  @Output() categorySelected = new EventEmitter<string>();
  selectedCategory: string = 'all';

  constructor(
    private productsCategoriesService: ProductsCategoriesService, 
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    try {
      this.categories = await this.categoriesService.getAllCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  onCategoryClick(categoryId: string, event: Event): void {
    event.preventDefault();
    this.selectedCategory = categoryId;
    this.categorySelected.emit(categoryId);
  }
}