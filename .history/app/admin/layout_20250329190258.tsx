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
  return <>{children}</>;
}
