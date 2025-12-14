import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="overflow-hidden">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
