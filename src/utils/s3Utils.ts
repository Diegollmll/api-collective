import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from 'sharp';

// Verificar que las variables de entorno existan con los nombres correctos
const region = process.env.REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const bucketName = process.env.BUCKET_AWS;

// Validar que todas las credenciales necesarias estén presentes
if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error('Faltan variables de entorno necesarias para AWS S3');
}

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

export const uploadToS3 = async (
  fileContent: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const bucketName = process.env.BUCKET_AWS;

  if (!bucketName) {
    throw new Error(
      "The AWS bucket name is not defined in the environment variables."
    );
  }

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return `https://${bucketName}.s3.${process.env.REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload the file to S3.");
  }
};

export const processFile = async (file: Express.Multer.File, folder: string): Promise<string> => {
    try {
        let processedBuffer: Buffer;
        let contentType = file.mimetype;

        // Procesar solo si es una imagen
        if (file.mimetype.startsWith('image/')) {
            processedBuffer = await sharp(file.buffer)
                .resize(800, 800, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 80 })
                .toBuffer();
            contentType = 'image/jpeg';
        } else {
            // Para otros tipos de archivos, usar el buffer original
            processedBuffer = file.buffer;
        }

        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        
        console.log('Subiendo archivo:', {
            fileName,
            contentType,
            size: processedBuffer.length
        });

        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_AWS!,
            Key: fileName,
            Body: processedBuffer,
            ContentType: contentType
        });

        await s3Client.send(command);

        return `https://${process.env.BUCKET_AWS}.s3.${process.env.REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error('Error detallado al procesar archivo:', error);
        throw new Error(`Error al procesar el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};
