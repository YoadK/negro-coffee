import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CategoryNames } from '../../../models/categoriesNames_enums';


@Component({
    selector: 'app-products-filter',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './products-filter.component.html',
    styleUrls: ['./products-filter.component.module.scss']
})
export class ProductsFilterComponent {
    @Input() categories: any[] = [];
    @Output() categorySelected = new EventEmitter<string | null>();
    @Input() productCount: number = 0;
    selectedCategory: string | null = null;

    onCategoryClick(categoryId: string | null ): void {
        this.selectedCategory = categoryId;
        this.categorySelected.emit(categoryId);
        console.log('Category clicked:', categoryId); // debugging
    }

    getIconClass(categoryName: string): string {
        return 'icon-' + this.sanitizeClassName(categoryName);
    }

    private sanitizeClassName(categoryName: string): string {
        return categoryName.replace(/\s+/g, '-').toLowerCase();
    }

    getTranslatedCategoryName(categoryName: string): string {
        // cast categoryName as keyof typeof CategoryNames (which refers to the keys of the enum) 
        return CategoryNames[categoryName as keyof typeof CategoryNames] || categoryName; // Map English to Hebrew, fallback to original if not found
    }

}
