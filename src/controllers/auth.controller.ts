import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Datos de registro recibidos:', req.body);
    
    // Validar que roleId sea un número
    const userData = {
      ...req.body,
      roleId: Number(req.body.roleId)
    };
    
    console.log('Datos procesados:', userData);
    
    const result = await AuthService.registerUser(userData);
    
    console.log('Resultado del registro:', result);
    
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(201).json(result);
  } catch (error) {
    console.error('Error en registro:', error);
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
    const result = await AuthService.loginUser(email, password, res);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully." });
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