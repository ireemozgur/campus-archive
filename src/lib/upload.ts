import { createClient } from "./supabase/client";

export async function uploadFile(file: File, folder: string) {
  const supabase = createClient();

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Dosya 5MB'dan büyük. Lütfen daha küçük bir dosya seçin.");
  }

  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("files").upload(path, file);
  if (error) throw new Error(error.message || "Dosya yüklenemedi");

  const { data: { publicUrl } } = supabase.storage.from("files").getPublicUrl(path);
  return publicUrl;
}
