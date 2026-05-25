import type { Metadata } from "next";
import "@uploadthing/react/styles.css";
import "@/app/globals.css";

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
    <html lang="en" className="h-full scroll-smooth font-sans">
      <body className="min-h-full bg-slate-50/30 text-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}
