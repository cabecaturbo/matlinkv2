import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

// Client-side compress + center-crop to square, then upload to Supabase Storage.
// Returns the stored object path. Caller decides public URL vs signed URL.
async function compress(file: File, square: boolean) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.6,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: "image/webp",
  });
  if (!square) return compressed;

  // center-crop to square via canvas
  const bitmap = await createImageBitmap(compressed);
  const size = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    bitmap,
    (bitmap.width - size) / 2,
    (bitmap.height - size) / 2,
    size,
    size,
    0,
    0,
    size,
    size,
  );
  const blob: Blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b!), "image/webp", 0.85),
  );
  return new File([blob], "image.webp", { type: "image/webp" });
}

export async function uploadAvatar(
  file: File,
  userId: string,
  kind: "photo" | "cover",
): Promise<string> {
  const processed = await compress(file, kind === "photo");
  const path = `${userId}/${kind}-${Date.now()}.webp`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, processed, { upsert: true, contentType: "image/webp" });
  if (error) throw error;
  return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
}

export async function uploadVerificationDoc(
  file: File,
  userId: string,
): Promise<string> {
  // Docs may be images or PDFs; only compress images.
  const isImage = file.type.startsWith("image/");
  const payload = isImage ? await compress(file, false) : file;
  const ext = isImage ? "webp" : file.name.split(".").pop() || "pdf";
  const path = `${userId}/doc-${Date.now()}.${ext}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("verification-docs")
    .upload(path, payload, { upsert: true });
  if (error) throw error;
  return path; // private — viewed via signed URL by owner/admin
}
