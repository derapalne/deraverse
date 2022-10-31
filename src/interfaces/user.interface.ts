import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    encryptPassword(password: string): Promise<string>; 
    validatePassword(password: string): Promise<boolean>;
    friendlist: string[];
    followers: string[];
    avatar: string;
}