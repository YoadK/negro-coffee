
// //@ts-ignore
// import { UploadedFile } from "express-fileupload";

export class ProductModel {
    _id: string;
    name: string;
    description: string;
    product_weight_grams: number;
    price: number;
    image?: File | string;  // Can be a File for new uploads or a string URL for existing images
    imageName?: string;
    imageUrl?: string;    
   
   

}