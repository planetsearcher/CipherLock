import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Privacy Vault - Enterprise Secure Messaging",
  description: "Enterprise-grade secure messaging platform with FHE encryption",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`zama-bg text-foreground antialiased`}>
        <div className="fixed inset-0 w-full h-full zama-bg z-[-20] min-w-[850px]"></div>
        <main className="flex flex-col min-w-[850px]">
          <Providers>
            <div className="flex-1">
              {children}
            </div>
          </Providers>
        </main>
      </body>
    </html>
  );
}
