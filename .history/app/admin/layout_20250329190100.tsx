import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Admin Layout",
  description: "Layout for admin pages without navbar",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <main className="max-w-[1600px] mx-auto px-10">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
