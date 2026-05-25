import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HireFlow - AI-Powered Applicant Tracking System",
  description: "Screen candidates, schedule interviews, and organize hiring with AI insights.",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-full bg-slate-50/40 text-slate-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}
