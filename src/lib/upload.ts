import { createClient } from "./supabase/client";

export async function uploadFile(file: File, folder: string) {
  const supabase = createClient();

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Dosya 5MB'dan büyük. Lütfen daha küçük bir dosya seçin.");
  }

  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Oturum bulunamadı");

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/files/${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Dosya yüklenemedi");
  }

  const { data: { publicUrl } } = supabase.storage.from("files").getPublicUrl(path);
  return publicUrl;
}
