import { Document } from "mongoose";

export interface IPost extends Document {
    author: string,
    username: string,
    content: string,
    date: string,
    timestamp: number,
    likes: string[],
    dislikes: string[], 
}