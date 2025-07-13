import type { Route } from "./+types/home";
import {
  useLoaderData,
  useFetcher,
} from "react-router";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  fetchFiles,
} from "~/http/api/visaDossier";
import type { DocumentTag, VisaDocument, VisaDocumentApiResponseGrouped } from "~/http/types/VisaDocumentApiResponse";

export const loader = async () => {
  const documentList: VisaDocumentApiResponseGrouped = await fetchFiles();
  return documentList.data;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Visa Dossier - Documents" },
    {
      name: "Page to realize documents upload",
      content: "Forms and Screen to upload and delete documents",
    },
  ];
}

export default function Home() {
  const documents = useLoaderData<typeof loader>();
  const deleteFetcher = useFetcher();
  const passportFetcher = useFetcher();
  const visaFetcher = useFetcher();
  const photoFetcher = useFetcher();
  const shownToasts = useRef<Record<string, boolean>>({});

  const fetchers = [
    { key: "passport", fetcher: passportFetcher },
    { key: "visa", fetcher: visaFetcher },
    { key: "photo", fetcher: photoFetcher },
  ];
  const categories: DocumentTag[] = ['passport', 'visa', 'photo'];

  const showToast = (success: boolean | undefined, messages: { success: string, error: string }) => {
    if (success === true) toast.success(messages.success);
    else if (success === false) toast.error(messages.error);
  };

  useEffect(() => {
    fetchers.forEach(({ fetcher, key }) => {
      const success = fetcher.data?.success;
      const toastKey = `${key}-upload`;

      if (success !== undefined && fetcher.state === "idle" && !shownToasts.current[toastKey]) {
        shownToasts.current[toastKey] = true;
        showToast(success, {
          success: `${key} upload successful`,
          error: `${key} upload failed`,
        });
      }
    });

    const deleteSuccess = deleteFetcher.data?.success;
    if (deleteSuccess !== undefined && deleteFetcher.state === "idle" && !shownToasts.current["delete"]) {
      shownToasts.current["delete"] = true;
      showToast(deleteSuccess, {
        success: "File deleted successfully!",
        error: "Failed to delete file.",
      });
    }
  }, [
    passportFetcher.data,
    visaFetcher.data,
    photoFetcher.data,
    deleteFetcher.data,
    passportFetcher.state,
    visaFetcher.state,
    photoFetcher.state,
    deleteFetcher.state,
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Upload Documents</h1>

      {categories.map((category) => {
        const fetcher =
          category === "passport"
            ? passportFetcher
            : category === "visa"
              ? visaFetcher
              : photoFetcher;

        return (
          <div key={category} className="mb-6 border p-4 rounded-md bg-black">
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
                accept=".pdf,.png,.jpg,.jpeg"
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

            <ul className="mt-4 space-y-2">
              {documents[category]?.map((doc: VisaDocument) => (
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
          </div>
        );
      })}
    </div>
  );
}
