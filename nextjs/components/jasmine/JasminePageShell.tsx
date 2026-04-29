import type { ReactNode } from "react";

type JasminePageShellProps = {
  children: ReactNode;
  footer?: boolean;
};

export function JasminePageShell({ children }: JasminePageShellProps) {
  return <>{children}</>;
}
