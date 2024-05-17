 import { ObjectId } from "mongoose";
// //@ts-ignore
// import { UploadedFile } from "express-fileupload";

export class IProductModel {
    _id: ObjectId;
    name: string;
    description: string;
    quantity: number;
    price: number;
    image: File;
    imageUrl: string;



}