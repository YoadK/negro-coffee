import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../../app/services/products.service';
import { ProductModel } from '../../../../app/models/product.model';
import { notify } from '../../../Utils/Notify';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngxs/store';
import { UpdateProductQuantity } from '../../../NgXs/actions/product.actions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryModel } from '../../../models/category.model';
import { CategoriesService } from '../../../services/categories.service';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.module.scss']
})
export class EditProductComponent implements OnInit {
  product: ProductModel = new ProductModel();
  imagePreview: SafeUrl | null = null;
  categories: CategoryModel[] = [];

  @ViewChild('imageInput') imageInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private sanitizer: DomSanitizer,
    private store: Store
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadProduct(id);
    }

    await this.loadCategories();
  }


  async loadCategories() {
    try {
      this.categories = await this.categoriesService.getAllCategories();
      console.log('<edit/update> Categories loaded: ', this.categories.length);
    } catch (error) {
      console.error('Error loading categories:', error);
      notify.error('Failed to load categories');
    }
  }

  //loading the product data from the backend and initializing the product state in the component.
  async loadProduct(id: string) {
    try {
      this.product = await this.productsService.getOneProduct(id);
     
     // Convert categoryIds to strings
     //converting the categoryIds to strings immediately after loading, 
     // which maintains consistent data types throughout the component
     if (this.product.categoryIds && this.product.categoryIds.length > 0) {
        this.product.categoryIds = this.product.categoryIds.map(id => id.toString());
    }
     
     
      this.updateImagePreview();
    } catch (error) {
      console.error('Error loading product', error);
      notify.error('Failed to load product');
      this.router.navigate(['/products']);
    }
  }

  async send() {
    try {
      if (this.imageInput?.nativeElement?.files?.length > 0) {
        this.product.image = this.imageInput.nativeElement.files[0];
      }

      const updatedProduct = await this.productsService.updateProduct(this.product);
      this.product = updatedProduct;
      this.updateImagePreview();
      
      // Update the store with the new quantity
      this.store.dispatch(new UpdateProductQuantity({ 
        productId: updatedProduct._id, 
        quantity: updatedProduct.product_weight_grams 
      }));

      notify.success('Product updated successfully');
      this.router.navigate(['/products']);
    } catch (error) {
      console.error('Error updating product', error);
      notify.error('Failed to update product');
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.product.image = file;
      this.updateImagePreview();
    }
  }

  onCategoryChange(event: Event, categoryId: string) {
    const checkbox = event.target as HTMLInputElement;
    if (!this.product.categoryIds) {
      this.product.categoryIds = [];
    }
    if (checkbox.checked) {
      this.product.categoryIds.push(categoryId.toString());
      
    } else {
      this.product.categoryIds = this.product.categoryIds.filter(id => id !== categoryId.toString());
    }
  }
  

  private updateImagePreview() {
    if (this.product.image instanceof File) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
      };
      reader.readAsDataURL(this.product.image);
    } else if (this.product.imageUrl) {
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(this.product.imageUrl);
    } else {
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(`${environment.BASE_IMAGE_URL}default-image.jpg`);
    }
  }
}