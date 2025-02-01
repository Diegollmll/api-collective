import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AuthService.registerUser(req.body);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await AuthService.requestPasswordReset(email);
      if (!result.success) {
        res.status(400).json(result);
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  
  export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      if (!result.success) {
        res.status(400).json(result);
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };