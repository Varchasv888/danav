import { api } from "./client-api";

/**
 * Shrinks a photo in the browser before upload, so a phone picture of several MB is stored as a small
 * JPEG: the full view at most 1600 px on its longer side, the thumbnail at most 360 px.
 */
async function shrink(file: Blob, maxSide: number, quality: number) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#ffffff"; // transparent PNGs become white, not black, as JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/jpeg", quality));
  const base64 = await new Promise<string>((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.readAsDataURL(blob);
  });
  return base64;
}

/** Uploads a photo as a full view and a thumbnail; returns both file ids. */
export async function uploadPhoto(file: File) {
  const name = file.name.replace(/\.[^.]+$/, "") || "photo";
  const [full, thumb] = await Promise.all([shrink(file, 1600, 0.82), shrink(file, 360, 0.75)]);
  const up = (base64: string, suffix: string) => api<{ id: string }>("/files", { body: { name: `${name}${suffix}.jpg`, contentType: "image/jpeg", base64 } });
  const [a, b] = await Promise.all([up(full, ""), up(thumb, "-thumb")]);
  return { fileId: a.id, thumbFileId: b.id };
}

/** The address of a stored file for an <img> (same-origin /api rewrite, so the session cookie goes with it). */
export const fileUrl = (id: string) => `/api/files/${id}`;
