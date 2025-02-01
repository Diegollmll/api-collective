import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Validar que las variables de entorno estén definidas
if (!process.env.REGION || !process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials or region are not defined in .env");
}

// Configuración de Amazon SES
const sesClient = new SESClient({
  region: process.env.REGION, // Región configurada en tu .env
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string, // Credenciales de acceso
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

export const sendResetPasswordEmail = async (email: string, resetToken: string): Promise<{ success: boolean; message: string }> => {
  if (!process.env.MAIL_FROM_ADDRESS) {
    throw new Error("MAIL_FROM_ADDRESS is not defined in .env");
  }

  const params = {
    Source: process.env.MAIL_FROM_ADDRESS, // Correo remitente
    Destination: {
      ToAddresses: [email], // Destinatario
    },
    Message: {
      Subject: {
        Data: "Password Reset Request", // Asunto del correo
      },
      Body: {
        Html: {
          Data: `
            <p>Hi,</p>
            <p>You have requested to reset your password. Please click on the link below to reset it:</p>
            <a href="https://collectiveactiongroup.com/auth/resetpassword/${resetToken}">
              Reset Password
            </a>
            <p>If you did not request this, please ignore this email.</p>
          `, // Cuerpo del correo en HTML
        },
      },
    },
  };

  try {
    // Enviar el correo
    await sesClient.send(new SendEmailCommand(params));
    return { success: true, message: "Reset email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send reset email.");
  }
};