import nodemailer from 'nodemailer';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Configuración de Amazon SES para producción
const sesClient = new SESClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
});

// Configuración de Nodemailer para desarrollo
const devTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
    try {
        console.log('Enviando email de recuperación a:', email);
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        const emailContent = `
            <h1>Recuperación de contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
            <a href="${resetLink}">Restablecer contraseña</a>
            <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `;

        if (process.env.NODE_ENV === 'production') {
            // Usar AWS SES en producción
            const params = {
                Source: process.env.MAIL_FROM_ADDRESS,
                Destination: {
                    ToAddresses: [email],
                },
                Message: {
                    Subject: {
                        Data: "Recuperación de contraseña",
                    },
                    Body: {
                        Html: {
                            Data: emailContent,
                        },
                    },
                },
            };

            await sesClient.send(new SendEmailCommand(params));
            console.log('Email enviado exitosamente via AWS SES');
        } else {
            // Usar Nodemailer en desarrollo
            await devTransporter.sendMail({
                from: process.env.MAIL_FROM_ADDRESS,
                to: email,
                subject: 'Recuperación de contraseña',
                html: emailContent
            });
            console.log('Email enviado exitosamente via Mailtrap');
        }
    } catch (error) {
        console.error('Error al enviar email:', error);
        throw new Error('Error al enviar el email de recuperación');
    }
};