import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function CommuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <main className="max-w-[1600px] mx-auto px-10">{children}</main>;
    </NuqsAdapter>
  );
}
