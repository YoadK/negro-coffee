import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsCategoriesService } from '../../../services/products-categories.service';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.module.scss']
})
export class CategoryFilterComponent implements OnInit {
  categories: any[] = [];
  @Output() categorySelected = new EventEmitter<string>();

  constructor(private productsCategoriesService: ProductsCategoriesService, private categoriesService:CategoriesService) {}

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

  onCategoryClick(categoryId: string): void {
    this.categorySelected.emit(categoryId);
  }
}