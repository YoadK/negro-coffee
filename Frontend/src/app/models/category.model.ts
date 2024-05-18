import { ObjectId } from "mongoose"

export interface CategoryModel {
  _id: ObjectId
 name: string
 description: string
}