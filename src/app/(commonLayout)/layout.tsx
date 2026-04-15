import { getSessionAction } from "@/actions/session.action";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionResult = await getSessionAction();
  const user = sessionResult?.data?.data ?? null;
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <Navbar user={user} />
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}