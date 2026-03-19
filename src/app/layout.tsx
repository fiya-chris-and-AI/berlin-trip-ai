import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import { C } from "@/lib/colors";

export const metadata: Metadata = {
  title: "Berlin Companion — Müller-Miller Trip",
  description:
    "AI-powered travel companion for Fiya & Chris's Berlin trip, May 19–27, 2026",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Source+Sans+3:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Source Sans 3', sans-serif", background: C.bg, color: C.black, minHeight: "100vh" }}>
        <Header />
        <TabNav />
        <main style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 24px 80px" }}>
          {children}
        </main>
        {/* Footer */}
        <footer
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 24px 24px",
          }}
        >
          <div
            style={{
              marginTop: 48,
              paddingTop: 12,
              borderTop: `1px solid ${C.borderLight}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                height: 2,
                background: C.red,
                width: 32,
                margin: "0 auto 8px",
                borderRadius: 1,
              }}
            />
            <span
              className="font-code"
              style={{ fontSize: 8, color: C.light }}
            >
              Berlin Trip Dashboard · JLY3BV · Lutfiya Miller · Have the most
              incredible time, Fiya
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
