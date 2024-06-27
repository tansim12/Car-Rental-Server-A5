// import { RequestHandler } from "express";
// import { userService } from "./User.service";
// import { successResponse } from "../../Re-Useable/CustomResponse";

// const createUser:RequestHandler = async(req, res, next)=>{
// try {
//     const result = await userService.createUserDB(req.body)
//     res.status(201).send(successResponse(result,"User registered successfully"))
// } catch (error) {
//     next(error)
// }
// }


// export const userController = {
//     createUser
// }