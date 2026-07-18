import { createClient } from "./supabase/client";

export async function uploadFile(file: File, folder: string) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("files").upload(path, file);
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from("files").getPublicUrl(path);
  return publicUrl;
}
