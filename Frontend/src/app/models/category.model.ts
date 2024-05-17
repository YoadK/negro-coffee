import { ObjectId } from "mongoose"

export interface ICategoryModel {
  _id: ObjectId
 name: string
 description: string
}