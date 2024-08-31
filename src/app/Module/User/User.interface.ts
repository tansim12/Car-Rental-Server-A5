import { USER_ROLE, USER_STATUS } from "./User.const";

export interface TUser {
  name: string;
  email: string;
  role?: "user" | "admin";
  password: string;
  phone: string;
  address?: string;
  image?: string;
  status?: "active" | "block";
  passwordChangeAt?:Date
  isDelete?: boolean;
}
export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;
