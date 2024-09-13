export interface TSignIn {
  email: string;
  password: string;
}

export interface TChangePassword {
  oldPassword: string;
  newPassword: string;
  email?: string;
}
