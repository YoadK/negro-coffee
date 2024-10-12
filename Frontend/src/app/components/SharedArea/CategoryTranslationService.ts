
import { Injectable } from '@angular/core';
import { CategoryNames } from '../../models/categoriesNames_enums';

@Injectable({
  providedIn: 'root'
})
export class CategoryTranslationService {
  getTranslatedCategoryName(categoryName: string): string {
    return CategoryNames[categoryName as keyof typeof CategoryNames] || categoryName;
  }
}