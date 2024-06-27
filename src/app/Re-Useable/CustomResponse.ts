export const successResponse = (result: any, message: string): object => {
    return {
      success: true,
      message: message,
      data: result,
    };
  };