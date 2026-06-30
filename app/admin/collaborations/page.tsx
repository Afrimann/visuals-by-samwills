import { prisma } from "@/lib/prisma";
import CollaborationManager from "./CollaborationManager";

export default async function AdminCollaborationsPage() {
  const collabs = await prisma.collaboration.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-off-white">
          Collaborations
        </h1>
        <p className="text-silver text-sm mt-0.5 font-[family-name:var(--font-body)]">
          Artists and brands you&apos;ve worked with
        </p>
      </div>
      <CollaborationManager initialCollabs={collabs} />
    </div>
  );
}
