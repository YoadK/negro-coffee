
import { Pipe, PipeTransform } from '@angular/core';
import { CategoryTranslationService } from './CategoryTranslationService';

@Pipe({
  name: 'translateCategoryName'
})
export class TranslateCategoryNamePipe  implements PipeTransform {

  constructor(private categoryTranslationService: CategoryTranslationService) {}

  transform(categoryName: string): string {
    return this.categoryTranslationService.getTranslatedCategoryName(categoryName);
  }

}
