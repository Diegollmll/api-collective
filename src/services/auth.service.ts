import { userSchema } from "../schemas/auth.schema";
import { ZodError, ZodIssue } from "zod";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendResetPasswordEmail } from "../utils/email";
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

interface UserWithRole extends User {
    role: {
        id: number;
        name: string;
    };
}

const generateToken = (user: UserWithRole): string => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role.name 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { 
            expiresIn: '24h'
        }
    );
};

export const AuthService = {
  // Registro de usuario
  async registerUser(data: typeof userSchema._input): Promise<ApiResponse<{ [key: string]: unknown }>> {
    try {
      console.log('Validando datos:', data);
      const validatedData = userSchema.parse(data);
      console.log('Datos validados:', validatedData);

      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return { success: false, error: "El correo electrónico ya está registrado." };
      }

      const roleExists = await prisma.role.findUnique({
        where: { id: validatedData.roleId },
      });

      if (!roleExists) {
        return { success: false, error: "El rol proporcionado no es válido." };
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      const userCreated = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          roleId: validatedData.roleId
        },
        include: {
          role: true
        }
      });

      const { password: _, ...userWithoutPassword } = userCreated;

      return { 
        success: true, 
        data: userWithoutPassword, 
        message: "Usuario creado exitosamente." 
      };
    } catch (error) {
      console.error('Error detallado:', error);
      if (error instanceof ZodError) {
        return {
          success: false,
          error: "Error de validación: " + error.errors.map(err => err.message).join(", ")
        };
      }
      if (error instanceof Error) {
        return { success: false, error: "Error al crear usuario: " + error.message };
      }
      return { success: false, error: "Error desconocido." };
    }
  },

  // Inicio de sesión
  async loginUser(email: string, password: string, res: Response): Promise<ApiResponse<{ user: Omit<UserWithRole, 'password'> }>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
      });

      if (!user) {
        return { success: false, error: "Usuario no encontrado" };
      }

      if (!user.password) {
        return { success: false, error: "Contraseña de usuario inválida" };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { success: false, error: "Contraseña incorrecta" };
      }

      const token = generateToken(user as UserWithRole);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const { password: _password, ...userWithoutPassword } = user;
      
      return { 
        success: true, 
        data: { user: userWithoutPassword as Omit<UserWithRole, 'password'> }, 
        message: "Login exitoso" 
      };
    } catch (error) {
      return { 
        success: false, 
        error: "Error al iniciar sesión: " + (error instanceof Error ? error.message : "Error desconocido") 
      };
    }
  },

  // Solicitud de restablecimiento de contraseña
  async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      const resetToken = uuidv4(); // Genera un token único
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

      await prisma.passwordResetToken.create({
        data: {
          token: resetToken,
          expiresAt,
          user: {
            connect: { id: user.id },
          },
        },
      });

      await sendResetPasswordEmail(user.email, resetToken); // Envía el correo

      return { success: true, message: "Password reset email sent." };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: "Error requesting password reset: " + error.message };
      }
      return { success: false, error: "Unknown error occurred." };
    }
  },

  // Restablecimiento de contraseña
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      const resetToken = await prisma.passwordResetToken.findFirst({
        where: {
          token,
          expiresAt: { gte: new Date() }, // Verifica que el token no haya expirado
        },
        include: { user: true },
      });

      if (!resetToken) {
        return { success: false, error: "Invalid or expired token" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const user = resetToken.user;

      if (!user) {
        return { success: false, error: "User not found" };
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      return { success: true, message: "Password reset successful." };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: "Error resetting password: " + error.message };
      }
      return { success: false, error: "Unknown error occurred." };
    }
  },
};