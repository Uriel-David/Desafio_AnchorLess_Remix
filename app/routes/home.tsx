import type { DocumentTag, VisaDocumentApiResponseGrouped } from "~/http/types/VisaDocumentApiResponse";
import { useLoaderData } from "react-router";
import { fetchFiles } from "~/http/api/visaDossier";
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
  const documentList: VisaDocumentApiResponseGrouped = await fetchFiles();
  return documentList.data;
};

const categories: DocumentTag[] = ["passport", "visa", "photo"];

export default function Home() {
  const documents = useLoaderData<typeof loader>();

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Upload Documents</h1>

      {categories.map((category) => (
        <CategoryCard
          key={category}
          category={category}
          documents={documents![category] ?? []}
        />
      ))}
    </div>
  );
}
