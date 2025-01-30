import { ZodError } from "zod";
import logger from "../config/logger";

export const handleControllerError = (error: ZodError | { code: string; message: string }): { success: false; error: string } => {
  if (error instanceof ZodError) {
    const errorMessage = error.errors.map((err) => err.message).join(", ");
    logger.warn(`Validation failed: ${errorMessage}`);
    return { success: false, error: "Invalid data: " + errorMessage };
  }

  if (error.code === "P2025") {
    logger.warn("Resource not found");
    return { success: false, error: "Resource not found" };
  }

  logger.error(`Unexpected error: ${error.message}`);
  return { success: false, error: "Unexpected error: " + error.message };
};
