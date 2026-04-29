"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { JasmineFooter } from "./JasmineFooter";
import { JasmineHeader } from "./JasmineHeader";
import { JasminePreloader } from "./JasminePreloader";
import { JasmineTransitions } from "./JasmineTransitions";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

export function JasmineRootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname === "/works" || pathname === "/break";

  return (
    <SmoothScrollProvider>
      <JasminePreloader />
      <JasmineTransitions />
      <JasmineHeader />
      <main>{children}</main>
      {hideFooter ? null : <JasmineFooter />}
    </SmoothScrollProvider>
  );
}
