import type { Route } from "../documents/+types/delete";
import { deleteFile } from "~/http/api/VisaDossierApi"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Delete a document" },
  ];
}

export const action = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));

  try {
    await deleteFile(id);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Delete file failed" };
  }
};
