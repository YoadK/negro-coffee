import { Document, ObjectId, Schema, model } from 'mongoose';

export class UserModel {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId:number;
    token:string;


constructor(init?: Partial<UserModel>) {
    Object.assign(this, init);
  }
}