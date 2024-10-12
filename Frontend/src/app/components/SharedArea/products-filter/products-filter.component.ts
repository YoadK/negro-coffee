import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SharedModule } from '../shared-module';



@Component({
    selector: 'app-products-filter',
    standalone: true,
    imports: [CommonModule, RouterModule,SharedModule],
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

    

}
