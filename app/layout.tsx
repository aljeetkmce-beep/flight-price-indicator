import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flight Price Indicator",
  description: "Premium flight price tracking and comparison",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-premium-bg text-white antialiased">
        {children}
      </body>
    </html>
  );
}
