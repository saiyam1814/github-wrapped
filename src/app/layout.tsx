import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Wrapped 2025 - Your Year in Code",
  description: "Discover your coding journey with GitHub Wrapped 2025. See your contributions, streaks, top languages, and developer personality in a beautiful, shareable story.",
  openGraph: {
    title: "GitHub Wrapped 2025 - Your Year in Code",
    description: "Discover your coding journey with GitHub Wrapped 2025",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Wrapped 2025",
    description: "Your year in code, beautifully wrapped",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
