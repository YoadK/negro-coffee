 import { ObjectId } from "mongoose";
// //@ts-ignore
// import { UploadedFile } from "express-fileupload";

export class ProductModel {
    _id: ObjectId;
    name: string;
    description: string;
    product_weight_grams: number;
    price: number;
    image?: File | string;  // Can be a File for new uploads or a string URL for existing images
    imageName?: string;
    imageUrl?: string;    
   
    // //copy constructor
    // constructor(product?: ProductModel) {
    //     if (product) {
    //         this._id = product._id;
    //         this.name = product.name;
    //         this.description = product.description;
    //         this.product_weight_grams = product.product_weight_grams;
    //         this.price = product.price;
            
    //         // Deep copy for the image if it's a File
    //         if (product.image instanceof File) {
    //             this.image = new File([product.image], product.image.name, { type: product.image.type });
    //         } else {
    //             this.image = product.image;  // If it's a string (URL), copy as is
    //         }

    //         this.imageName = product.imageName;
    //         this.imageUrl = product.imageUrl;
    //     }
    // }

}