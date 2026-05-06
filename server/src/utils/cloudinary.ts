import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function getCreds(): { cloudName?: string; apiKey?: string; apiSecret?: string } {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    apiKey: process.env.CLOUDINARY_API_KEY?.trim(),
    apiSecret: process.env.CLOUDINARY_API_SECRET?.trim(),
  };
}

export function isCloudinaryEnabled(): boolean {
  const { cloudName, apiKey, apiSecret } = getCreds();
  return Boolean(cloudName && apiKey && apiSecret);
}

function ensureCloudinaryConfigured(): void {
  if (configured) return;

  const { cloudName, apiKey, apiSecret } = getCreds();
  if (!cloudName || !apiKey || !apiSecret) return;

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
}

export async function uploadToCloudinary(
  filePath: string,
  folder: string,
  resourceType: 'image' | 'raw' | 'auto'
): Promise<string> {
  ensureCloudinaryConfigured();

  const uploaded = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  return uploaded.secure_url;
}
