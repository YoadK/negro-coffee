
// //@ts-ignore
// import { UploadedFile } from "express-fileupload";

import { CategoryModel } from "./category.model";

export class ProductModel {
    _id: string;
    name: string;
    description: string;
    product_weight_grams: number;
    price: number;
    image?: File | string;  // File for new uploads or string URL for existing images
    imageName?: string;
    imageUrl?: string;
    categoryIds?: string[];  // Array of category IDs
    categories?: CategoryModel[];  // Array of category objects (if populated)
  }
  