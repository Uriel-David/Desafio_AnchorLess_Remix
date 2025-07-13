import type { DocumentTag, VisaDocument } from "~/http/types/VisaDocumentApiResponse";
import { useFetcher } from "react-router";
import { useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { DocumentList } from "./DocumentList";

type Props = {
  category: DocumentTag;
  documents: VisaDocument[];
};

const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];

export function CategoryCard({ category, documents }: Props) {
  const fetcher = useFetcher();
  const shownToast = useRef(false);

  useEffect(() => {
    if (
      fetcher.data?.success !== undefined &&
      fetcher.state === "idle" &&
      !shownToast.current
    ) {
      shownToast.current = true;
      if (fetcher.data.success) {
        toast.success(`${category} upload successful`);
      } else {
        toast.error(`${category} upload failed`);
      }
    }
  }, [fetcher.data, fetcher.state, category]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedExtensions = ["pdf", "png", "jpg", "jpeg"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      toast.error("File extension not allowed. Use PDF, PNG, JPG or JPEG.");
      event.target.value = "";
      return;
    }

    if (file && file.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      event.target.value = "";
    }
  }

  return (
    <div className="mb-6 border p-4 rounded-md bg-black">
      <h2 className="text-xl mb-2 capitalize">{category}</h2>

      <fetcher.Form
        method="post"
        encType="multipart/form-data"
        action="/documents/upload"
        className="flex flex-col gap-2"
      >
        <input type="hidden" name="tag" value={category} />
        <input
          type="file"
          name="file"
          required
          accept={allowedExtensions.join(",")}
          onChange={handleFileChange}
          className="cursor-pointer border rounded p-1 bg-black hover:bg-gray-600"
        />
        <button
          type="submit"
          className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded cursor-pointer"
          disabled={fetcher.state !== "idle"}
        >
          {fetcher.state === "submitting" ? "Uploading..." : "Upload"}
        </button>
      </fetcher.Form>

      <DocumentList documents={documents} />
    </div>
  );
}
