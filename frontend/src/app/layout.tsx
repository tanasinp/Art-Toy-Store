import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "ArtToy Store",
  description: "Art toy preorder platform built with Next.js + Shadcn UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ReactQueryProvider>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ReactQueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
