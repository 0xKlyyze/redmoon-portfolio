export const runtime = 'edge';
import type { Metadata } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Section 3.1: Typography Setup
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Redmoon Digital Holding | Immersive Portfolio",
  description: "A diegetic 3D portfolio experience exploring the Redmoon software ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${inter.variable} ${jetbrains.variable} font-inter bg-deep-void antialiased`}>
        {children}
      </body>
    </html>
  );
}