import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Container from "./_components/Container";
import NavBar from "./_components/NavBar/NavBar";
import Footer from "./_components/Footer";

const inter = Inter({
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "MotoSklejka",
  description: "Planuj wspólne wyjazdy motocyklowe — mapa, zespoły, konto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">
        <NavBar />
        <Container>{children}</Container>
        <Footer />
      </body>
    </html>
  );
}
