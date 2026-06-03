import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: "Kindrasa",
  description: "Real estate CRM built for relationships, not transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F0E8] text-[#1A1A1A]">{children}</body>
    </html>
  );
}
