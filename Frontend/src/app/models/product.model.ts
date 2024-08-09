 import { ObjectId } from "mongoose";
// //@ts-ignore
// import { UploadedFile } from "express-fileupload";

export class ProductModel {
    _id: ObjectId;
    name: string;
    description: string;
    product_weight_grams: number;
    price: number;
    image?: File; 
    imageUrl?: string;
    
    imageName?: string;

}