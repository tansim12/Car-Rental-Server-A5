import { USER_ROLE } from "./User.const";

export interface TUser {
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  phone: string;
  address: string;
}
export type TUserRole = keyof typeof USER_ROLE;
