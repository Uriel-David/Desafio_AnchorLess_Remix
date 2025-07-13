import type { Route } from "../documents/+types/upload";
import { uploadFile } from "~/http/api/visaDossier"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload a document" },
  ];
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const tag = formData.get("tag") as string;

  if (!file || !(file instanceof File)) {
    return { success: false, message: "Invalid file" };
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png"].includes(ext || "");
  const type = ext === "pdf" ? "document" : isImage ? "image" : null;

  if (!type) {
    return { success: false, message: "Unsupported file type" };
  }

  try {
    const result = await uploadFile(file, type, tag);
    return { success: true, data: result };
  } catch (e) {
    return { success: false, message: "Upload failed" };
  }
}
