


import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductModel } from '../../../models/product.model';
import { ProductsService } from '../../../services/products.service';
import { notify } from '../../../Utils/Notify';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.module.scss'] // Fixed typo here
})
export class EditProductComponent implements OnInit {
  public product = new ProductModel();
  public imagePreview: SafeUrl | null = null;
  public fileName: string = '';

  @ViewChild('myImage')
  public myImage: ElementRef<HTMLInputElement>;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit(): Promise<void> {
    const productId = this.activatedRoute.snapshot.params['id'] as string;
    if (productId) {
      try {
        this.product = await this.productsService.getOneProduct(productId);
        if (this.product.imageUrl) {
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(this.product.imageUrl);
          this.fileName = this.getFileNameFromUrl(this.product.imageUrl);
        }
      } catch (err: any) {
        console.error('Error loading product:', err);
        notify.error('Error loading product');
        this.router.navigate(['product-management']);
      }
    }
  }

  onFileSelected(event: Event): void {
    console.log ('in: edit-product -> <onFileSelected> ');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
  
      // Debug logging
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size + ' bytes'
      });
  
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
          console.log('Image preview created');
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    }
  }

  public async send(): Promise<void> {
    try {
      console.log('Attempting to update product:', {
        id: this.product._id,
        name: this.product.name,
        hasNewImage: !!this.myImage?.nativeElement?.files?.length
      });
  
      if (this.myImage?.nativeElement?.files?.length > 0) {
        this.product.image = this.myImage.nativeElement.files[0];
        console.log('New image file attached:', this.product.image.name);
      }
  
      from(this.productsService.updateProduct(this.product)).subscribe(
        () => {
          console.log('Product updated successfully');
          notify.success('Product updated successfully');
          this.router.navigate(['/products']);
        },
        (error) => {
          console.error('Error updating product:', error);
          if (error instanceof HttpErrorResponse) {
            notify.error(`Backend error: ${error.message}`);
          } else {
            notify.error('An unexpected error occurred. Please try again.');
          }
        }
      );
    } catch (error) {
      console.error('Unexpected error in send method:', error);
      notify.error('An unexpected error occurred. Please try again.');
    }
  }

  private getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || '';
  }
}


