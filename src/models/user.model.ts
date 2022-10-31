import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "interfaces";


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    friendlist: {
        type: [String],
        required: true
    },
    followers: {
        type: [String],
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
});

UserSchema.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(2);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const UserModel = model<IUser>("user", UserSchema);

export {UserModel, UserSchema };
