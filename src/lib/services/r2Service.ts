import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export class R2Service {
  private static getClient(): S3Client {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('R2 credentials are not set');
    }

    return new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  private static getBucket(): string {
    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) {
      throw new Error('R2_BUCKET_NAME is not set');
    }
    return bucket;
  }

  private static getPublicDomain(): string {
    const domain = process.env.R2_PUBLIC_DOMAIN;
    if (!domain) {
      throw new Error('R2_PUBLIC_DOMAIN is not set');
    }
    return domain;
  }

  static async uploadImage(
    fileName: string,
    file: Buffer | Blob,
    contentType: string
  ): Promise<string> {
    try {
      const bucket = this.getBucket();
      const publicDomain = this.getPublicDomain();
      const client = this.getClient();

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ContentType: contentType,
      });

      await client.send(command);

      // Construct the public URL using the public domain
      return `https://${publicDomain}/${fileName}`;
    } catch (error) {
      console.error('R2 upload error:', error);
      throw error;
    }
  }

  static async deleteImage(fileName: string): Promise<void> {
    try {
      const bucket = this.getBucket();
      const client = this.getClient();

      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: fileName,
      });

      await client.send(command);
    } catch (error) {
      console.error('R2 delete error:', error);
      throw error;
    }
  }
} 