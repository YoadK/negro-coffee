import { Document, ObjectId, Schema, model } from 'mongoose';

export interface UserModel {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;
}
