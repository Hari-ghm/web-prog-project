import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EnerGrid - Smart Energy Management",
  description: "Advanced energy monitoring and analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We remove className="dark" from html so next-themes can control it
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
