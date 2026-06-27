import { RequireAuth } from "@/components/layout/RequireAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/** Chrome shared by every authenticated timesheet page. */
export default function TimesheetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col bg-canvas">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
          <Footer />
        </main>
      </div>
    </RequireAuth>
  );
}
