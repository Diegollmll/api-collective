import { userSchema } from "../schemas/auth.schema";
import { ZodError, ZodIssue } from "zod";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../config/passportConfig";
import { v4 as uuidv4 } from "uuid"; // Importa uuidv4
import { sendResetPasswordEmail } from "../utils/email"; // Importa la función de envío de correos

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export const AuthService = {
  // Registro de usuario
  async registerUser(data: typeof userSchema._input): Promise<ApiResponse<{ [key: string]: unknown }>> {
    try {
      const validatedData = userSchema.parse(data);

      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return { success: false, error: "The email address is already registered." };
      }

      const roleExists = await prisma.role.findUnique({
        where: { id: validatedData.roleId },
      });

      if (!roleExists) {
        return { success: false, error: "The provided role ID is not valid." };
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      const userCreated = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          role: {
            connect: { id: validatedData.roleId },
          },
        },
      });

      const { ...user } = userCreated; // Excluye la contraseña del objeto de respuesta
      
      return { success: true, data: user, message: "User created successfully." };
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return {
          success: false,
          error: "Validation error: " + error.errors.map((err: ZodIssue) => err.message).join(", "),
        };
      }
      if (error instanceof Error) {
        return { success: false, error: "Error creating user: " + error.message };
      }
      return { success: false, error: "Unknown error occurred." };
    }
  },

  // Inicio de sesión
  async loginUser(email: string, password: string): Promise<ApiResponse<{ token: string; user: { [key: string]: unknown } }>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      if (!user.password) {
        return { success: false, error: "Password not set" };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { success: false, error: "Incorrect password" };
      }

      const token = generateToken(user);

      return { success: true, data: { token, user }, message: "Login successful." };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: "Error logging in: " + error.message };
      }
      return { success: false, error: "Unknown error occurred." };
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