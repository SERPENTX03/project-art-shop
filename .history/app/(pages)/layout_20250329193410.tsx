import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="max-w-[1600px] mx-auto px-10">
        <Navbar />
        {children}
      </main>
    </>
  );
}
