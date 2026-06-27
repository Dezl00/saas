import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصتك - أنشئ متجرك الإلكتروني في دقائق",
  description:
    "منصة SaaS متكاملة لإنشاء متاجر إلكترونية للمطاعم والماركت والصيدليات. أنشئ متجرك واستقبل الطلبات برابط خاص بك.",
};

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-cairo)]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
