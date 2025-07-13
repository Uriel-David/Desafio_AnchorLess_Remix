import type { DocumentTag, VisaDocumentApiResponseGrouped } from "~/http/types/VisaDocumentApiResponse";
import { useLoaderData } from "react-router";
import { fetchFiles } from "~/http/api/VisaDossierApi";
import { CategoryCard } from "~/components/VisaDocuments/CategoryCard";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Visa Dossier - Documents" },
    {
      name: "Page to realize documents upload",
      content: "Forms and Screen to upload and delete documents",
    },
  ];
}

export const loader = async () => {
  try {
    const documentList: VisaDocumentApiResponseGrouped = await fetchFiles();
    return { success: true, data: documentList.data };
  } catch (error) {
    console.error("Error when searching for documents:", error);
    return {
      success: false,
      data: {
        passport: [],
        visa: [],
        photo: [],
      },
    };
  }
}

const categories: DocumentTag[] = ["passport", "visa", "photo"];

export default function Home() {
  const { success, data } = useLoaderData<typeof loader>();

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Upload Documents</h1>

      {!success && (
        <div className="mb-4 text-red-500">
          ⚠️ Failed to upload documents. Try again later.
        </div>
      )}

      {categories.map((category) => (
        <CategoryCard
          key={category}
          category={category}
          documents={data[category] ?? []}
        />
      ))}
    </div>
  );
}
