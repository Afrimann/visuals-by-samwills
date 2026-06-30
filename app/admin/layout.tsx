import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cin-black">
      <AdminNav />
      <main className="pt-16">{children}</main>
    </div>
  );
}
