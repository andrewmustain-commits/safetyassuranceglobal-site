import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://safetyassuranceglobal.com"),
  title: { default: "Safety Assurance Global | Institute of Assurance", template: "%s | SAG Institute of Assurance" },
  description: "Evidence-backed learning and workforce assurance for organizations where safety, quality, resilience and leadership matter.",
  openGraph: { title: "Safety Assurance Global | Institute of Assurance", description: "Governed workforce learning, assurance and enterprise cohort delivery.", type: "website", url: "/" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
