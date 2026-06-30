import AdminNav from "@/components/AdminNav";
import ReactQueryProvider from "@/components/ReactQueryProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <div className="min-h-screen bg-cin-black">
        <AdminNav />
        <main className="pt-16">{children}</main>
      </div>
    </ReactQueryProvider>
  );
}
