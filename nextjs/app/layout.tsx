import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { JasmineRootShell } from "@/components/jasmine/JasmineRootShell";
import "./globals.css";

const mg = localFont({
  variable: "--font-mg",
  src: [
    {
      path: "../public/jasmine/fonts/MG-B.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/jasmine/fonts/MG-BL.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/jasmine/fonts/MG-EB.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Jasmine Gunarto",
  description:
    "Jasmine Gunarto is a motion designer specializing in 2D animation, motion graphics, and visual storytelling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mg.variable} ${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <body>
        <Script
          id="jasmine-preloader-state"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('jasmine-preloader-played')==='true'){document.documentElement.dataset.jasminePreloader='played'}}catch(e){}",
          }}
        />
        <JasmineRootShell>{children}</JasmineRootShell>
      </body>
    </html>
  );
}
