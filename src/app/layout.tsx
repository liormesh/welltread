import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Welltread — every step considered",
  description:
    "Personalized movement programs for the body you have today. Built for seniors regaining balance, men 40+ undoing desk-job posture, and bodies recovering from change.",
  metadataBase: new URL("https://welltread.co"),
  openGraph: {
    title: "Welltread",
    description: "Personalized movement programs, every step considered.",
    url: "https://welltread.co",
    siteName: "Welltread",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
