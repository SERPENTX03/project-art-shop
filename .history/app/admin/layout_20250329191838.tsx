// app/admin/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Admin Layout",
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
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
