import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://visualsbysamwills.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Visuals by Samwills",
    template: "%s | Visuals by Samwills",
  },
  description:
    "Cinematic videography — music videos, wedding reels, short films & more. Based in Lagos, Nigeria.",
  keywords: [
    "videographer",
    "cinematographer",
    "music video",
    "wedding video",
    "short film",
    "documentary",
    "Lagos",
    "Nigeria",
    "Samwills",
  ],
  authors: [{ name: "Samwills" }],
  creator: "Samwills",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Visuals by Samwills",
    title: "Visuals by Samwills",
    description:
      "Cinematic videography — music videos, wedding reels, short films & more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visuals by Samwills",
    description:
      "Cinematic videography — music videos, wedding reels, short films & more.",
    creator: "@samwills",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Visuals by Samwills",
              description:
                "Cinematic videography — music videos, wedding reels, short films & more.",
              url: siteUrl,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lagos",
                addressCountry: "NG",
              },
              areaServed: ["Lagos", "Abuja", "Nigeria"],
              serviceType: [
                "Music Video Production",
                "Wedding Videography",
                "Documentary Filmmaking",
                "Commercial Video Production",
                "Short Reels",
              ],
            }),
          }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
