export const successResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message,
});

export const errorResponse = (error: string) => ({
  success: false,
  error,
});
