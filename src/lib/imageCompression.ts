/**
 * Client-side image compression utility
 * Compresses images before upload to reduce bandwidth and storage
 */

interface CompressionOptions {
  maxSizeKB: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compresses an image file to the specified size limit
 * Preserves aspect ratio and converts to WebP when possible
 */
export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<File> {
  const { maxSizeKB, maxWidth = 1920, maxHeight = 1080, quality = 0.85 } = options;
  const maxSizeBytes = maxSizeKB * 1024;

  // If file is already small enough and is a web format, return as-is
  if (file.size <= maxSizeBytes && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = async () => {
      // Calculate new dimensions while preserving aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image with high-quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first, fall back to JPEG
      const formats = ['image/webp', 'image/jpeg'];
      let currentQuality = quality;
      let blob: Blob | null = null;

      for (const format of formats) {
        currentQuality = quality;
        
        // Try progressively lower quality until size is acceptable
        while (currentQuality >= 0.3) {
          blob = await new Promise<Blob | null>(res => 
            canvas.toBlob(res, format, currentQuality)
          );

          if (blob && blob.size <= maxSizeBytes) {
            const extension = format === 'image/webp' ? 'webp' : 'jpg';
            const fileName = file.name.replace(/\.[^/.]+$/, `.${extension}`);
            resolve(new File([blob], fileName, { type: format }));
            return;
          }

          currentQuality -= 0.1;
        }
      }

      // If still too large, reduce dimensions further
      let scale = 0.8;
      while (scale >= 0.3) {
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        blob = await new Promise<Blob | null>(res => 
          canvas.toBlob(res, 'image/jpeg', 0.7)
        );

        if (blob && blob.size <= maxSizeBytes) {
          const fileName = file.name.replace(/\.[^/.]+$/, '.jpg');
          resolve(new File([blob], fileName, { type: 'image/jpeg' }));
          return;
        }

        scale -= 0.1;
      }

      // Return the smallest we could make
      if (blob) {
        const fileName = file.name.replace(/\.[^/.]+$/, '.jpg');
        resolve(new File([blob], fileName, { type: 'image/jpeg' }));
      } else {
        reject(new Error('Could not compress image'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Profile image compression (max 150KB)
 */
export async function compressProfileImage(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeKB: 150,
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.85,
  });
}

/**
 * Article cover image compression (max 300KB)
 */
export async function compressArticleImage(file: File): Promise<File> {
  return compressImage(file, {
    maxSizeKB: 300,
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.85,
  });
}
