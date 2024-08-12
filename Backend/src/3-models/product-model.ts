import { UploadedFile } from "express-fileupload";

import mongoose, { Document, ObjectId, Schema, model, Types } from "mongoose";


// Interface for IProductModel
export interface IProductModel extends Document {
    _id: ObjectId;
    name: string;
    description: string;
   product_weight_grams: number; // quantity in 'Grams'
    price: number; //price per one bag of coffee beans
    image: UploadedFile;//the image file itself
    imageName: string; // image name only, i.e: "13a41d43-14c8-4e6f-93dc-c652647991ef.jpg"
    imageUrl: string; // full url of the image
}

// Schema for IProductModel
export const ProductSchema = new Schema<IProductModel>({
    _id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        auto: true,
    },
    name: {
        type: String,
        required: [true, "Missing product name"],
        minlength: [2, "Product name is too short"],
        maxlength: [100, "Product name is too long"],
    },
    description: {
        type: String,
        maxlength: [500, "Product description is too long"],
    },
    product_weight_grams: {
        type: Number,
        required: [true, "Missing product weight in grams"],
        min: [0, "product weight in grams can't be negative"],
        max: [2000, "product weight in grams can't exceed 2000 (grams)"],
    },
    price: {
        type: Number,
        required: [true, "Missing product price"],
        min: [0, "Price can't be negative"],
        max: [1000, "Price can't exceed 1000"],
    },
    image: {
        type: Object,
        required: false,
    },

    imageName: {
        type: String,
        required: [false, "Missing product image name"],
        maxlength: [100, "Image name is too long"],
    },
    imageUrl: {
        type: String,
        maxlength: [500, "Image URL is too long"],
    },
}, {

    versionKey: false,
    toJSON: { virtuals: true }, // enable us to return virtual fields as JSON
    toObject: { virtuals: true },
    id: false,  // Don't duplicate _id to id. 
});



// Model for IProductModel
export const IProductModel = model<IProductModel>("Product", ProductSchema, "products");