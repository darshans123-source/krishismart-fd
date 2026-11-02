/**
 * Client-side image preparation for AI vision uploads and farm photos.
 * - Accepts JPG, JPEG, PNG and WEBP only, max 10 MB before resizing.
 * - Downscales to max 1024px wide as JPEG (quality 0.82) so the server
 *   payload stays small. The original file is never sent.
 * - Returns a preview data URL and the base64 payload for /api/ai/vision.
 */
export interface PreparedImage {
  previewUrl: string;
  mimeType: string;
  base64: string;
  fileName: string;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Only JPG, JPEG, PNG and WEBP images are supported.';
  if (file.size > MAX_UPLOAD_BYTES) return 'Image must be under 10 MB.';
  return null;
}

export function prepareImageFile(file: File): Promise<PreparedImage> {
  return new Promise((resolve, reject) => {
    const err = validateImageFile(file);
    if (err) { reject(new Error(err)); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1024;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Could not process this image.')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        const base64 = dataUrl.split(',')[1] || '';
        resolve({ previewUrl: dataUrl, mimeType: 'image/jpeg', base64, fileName: file.name });
      };
      img.onerror = () => reject(new Error('Could not read this image file.'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Could not read this image file.'));
    reader.readAsDataURL(file);
  });
}

export async function callVisionApi(body: Record<string, unknown>): Promise<any> {
  const res = await fetch('/api/ai/vision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success) {
    throw new Error(typeof data?.message === 'string' && data.message ? data.message : `AI vision failed (status ${res.status}).`);
  }
  return data.data;
}
