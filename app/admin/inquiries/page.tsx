import { prisma } from "@/lib/prisma";
import InquiryManager from "./InquiryManager";

export default async function InquiriesPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-off-white">
          Inquiries
        </h1>
        <p className="text-silver text-sm mt-0.5 font-[family-name:var(--font-body)]">
          {submissions.length} total · {submissions.filter((s) => s.status === "NEW").length} new
        </p>
      </div>

      <InquiryManager initialSubmissions={submissions} />
    </div>
  );
}
