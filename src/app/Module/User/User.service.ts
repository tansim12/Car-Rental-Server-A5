import { TUser } from "./User.interface";
import { UserModel } from "./User.model";

const createUserDB = async (payload:Partial<TUser>)=>{
const  result = await UserModel.create(payload)
return result
}

export const userService = {
    createUserDB
}