import { ReactNode } from "react";
import { LayoutClient } from "./LayoutClient";

export function LayoutContent({ children }: { children: ReactNode }) {
  return <LayoutClient>{children}</LayoutClient>;
}
