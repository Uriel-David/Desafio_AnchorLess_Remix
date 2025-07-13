import type { VisaDocument } from "~/http/types/VisaDocumentApiResponse";
import { useFetcher } from "react-router";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

type Props = {
  documents: VisaDocument[];
};

export function DocumentList({ documents }: Props) {
  const deleteFetcher = useFetcher();
  const shownToasts = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const success = deleteFetcher.data?.success;
    if (
      success !== undefined &&
      deleteFetcher.state === "idle" &&
      !shownToasts.current["delete"]
    ) {
      shownToasts.current["delete"] = true;
      if (success) toast.success("File deleted successfully!");
      else toast.error("Failed to delete file.");
    }
  }, [deleteFetcher.data, deleteFetcher.state]);

  return (
    <ul className="mt-4 space-y-2">
      {documents.map((doc) => (
        <li key={doc.id} className="flex justify-between items-center">
          <a
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            📄 {doc.name}.{doc.ext}
          </a>
          <deleteFetcher.Form method="post" action={`/documents/delete?id=${doc.id}`}>
            <button className="text-red-500 hover:underline cursor-pointer">Delete</button>
          </deleteFetcher.Form>
        </li>
      ))}
    </ul>
  );
}
