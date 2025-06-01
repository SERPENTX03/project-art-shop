import { ReactNode } from "react";

const CommuRootLayout = ({
  children,
}: {
  children: Readonly<{
    children: ReactNode;
  }>;
}) => {
  return <div>{children}</div>;
};
export default CommuRootLayout;
