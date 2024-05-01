import { ObjectId } from "mongoose";
// //@ts-ignore
// import { UploadedFile } from "express-fileupload";

export class ProductModel {
    _id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    image: File;
    imageUrl: string;



}