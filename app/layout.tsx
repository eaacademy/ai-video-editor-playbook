import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build Your Own AI Video Editor",
  description: "Hana Marigmen's step-by-step beginner playbook. Members only.",
  robots: { index: false, follow: false },
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#5B1A2E",
    colorText: "#2A1418",
    colorTextSecondary: "#6B5458",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#2A1418",
    fontFamily: "Manrope, system-ui, -apple-system, 'Segoe UI', sans-serif",
    borderRadius: "12px",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;600;700;800&display=swap"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
