// import { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import dotenv from "dotenv";
// import AppError from "../Error-Handle/AppError";
// import httpStatus from "http-status";
// import { TUserRole } from "../module/User/User.interface";
// import UserModel from "../module/User/User.model";
// dotenv.config();

// // ...requiredRoles this is an array  using Rest operator
// export const authMiddleWare = (...requiredRoles: TUserRole[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1];
//       //   console.log({ token });
//       if (!token) {
//         throw new AppError(
//           httpStatus.UNAUTHORIZED,
//           "You are not authorized !!!"
//         );
//       }

//       jwt.verify(
//         token as string,
//         process.env.SECRET_ACCESS_TOKEN as string,
//         async function (err, decoded) {
//           if (err) {
//             throw new AppError(
//               httpStatus.UNAUTHORIZED,
//               "You are not authorized !!!"
//             );
//           }
//           // validation is exists
//           const { role, id } = (decoded as JwtPayload).data;
//           const { iat } = decoded as JwtPayload;

//           const user = await UserModel.findOne({ id }).select("+password");
//           if (!user) {
//             throw new AppError(httpStatus.NOT_FOUND, "This User Not Found !");
//           }

//           // validate isExistsUserDeleted
//           const isExistsUserDeleted = user?.isDeleted;
//           if (isExistsUserDeleted) {
//             throw new AppError(
//               httpStatus.NOT_FOUND,
//               "This User Already Deleted !"
//             );
//           }

//           // status validate  0---> in-progress , 1---> blocked
//           const isExistsUserStatus = user?.status;
//           if (isExistsUserStatus === 1) {
//             throw new AppError(httpStatus.NOT_FOUND, "This User Blocked !");
//           }

//           const passwordChangeConvertMilliSecond =
//             new Date(user?.passwordChangeAt as Date).getTime() / 1000;
//           const jwtIssueTime = iat as number;

//           if (passwordChangeConvertMilliSecond > jwtIssueTime) {
//             throw new AppError(
//               httpStatus.UNAUTHORIZED,
//               "You are not authorized !"
//             );
//           }
//           // check who access this section
//           if (requiredRoles && !requiredRoles.includes(role)) {
//             throw new AppError(
//               httpStatus.UNAUTHORIZED,
//               "You are not authorized !"
//             );
//           }
//           req.user = (decoded as JwtPayload).data;
//           next();
//         }
//       );
//     } catch (error) {
//       next(error);
//     }
//   };
// };
