export default function CommuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="max-w-[1600px] mx-auto px-10">{children}</main>;
}
