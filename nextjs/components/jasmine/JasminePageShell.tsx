import type { ReactNode } from "react";
import { JasmineFooter } from "./JasmineFooter";
import { JasmineHeader } from "./JasmineHeader";
import { JasminePreloader } from "./JasminePreloader";
import { JasmineTransitions } from "./JasmineTransitions";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

type JasminePageShellProps = {
  children: ReactNode;
  footer?: boolean;
};

export function JasminePageShell({ children, footer = true }: JasminePageShellProps) {
  return (
    <SmoothScrollProvider>
      <JasminePreloader />
      <JasmineTransitions />
      <JasmineHeader />
      <main>{children}</main>
      {footer ? <JasmineFooter /> : null}
    </SmoothScrollProvider>
  );
}
