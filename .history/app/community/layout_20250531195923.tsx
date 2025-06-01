const CommuRootLayout = ({
  children,
}: {
  children: Readonly<{
    children: React.ReactNode;
  }>;
}) => {
  return <div>{children}</div>;
};
export default CommuRootLayout;
