import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse, TerrorSources } from "../Interface/error";

const handleZodError = (err: ZodError):TGenericErrorResponse => {
    const errorSources: TerrorSources = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue?.path.length - 1],
        message: issue?.message,
      };
    });

    const statusCode = 400;
    return {
      statusCode,
      message: "zod error",
      errorSources,
    };
  };
  export default handleZodError