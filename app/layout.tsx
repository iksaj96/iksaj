import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Ganti dengan domain asli setelah situs online
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "IKSAJ";
const TITLE = "IKSAJ | Ikatan Santri Annuqayah Jawa, PP. Annuqayah Lubangsa";
const DESCRIPTION =
  "IKSAJ (Ikatan Santri Annuqayah Jawa) adalah organisasi daerah santri asal Jawa di Pondok Pesantren Annuqayah daerah Lubangsa, Guluk-Guluk, Sumenep, Jawa Timur. Berdiri 6 Agustus 1996. Baca sejarah, visi misi, kegiatan, berita, karya tulis, dan galeri IKSAJ.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | IKSAJ",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "IKSAJ",
    "Ikatan Santri Annuqayah Jawa",
    "santri Annuqayah",
    "Annuqayah Lubangsa",
    "PP. Annuqayah Lubangsa",
    "Pondok Pesantren Annuqayah",
    "Lubangsa Guluk-Guluk",
    "pesantren Sumenep",
    "organisasi daerah santri",
    "ORDA Lubangsa",
    "santri Jawa di Madura",
    "santri Jember Bondowoso Situbondo Banyuwangi",
    "sejarah IKSAJ",
    "berita IKSAJ",
    "karya tulis santri",
  ],
  authors: [{ name: "IKSAJ" }],
  creator: "IKSAJ",
  publisher: "IKSAJ",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        alt: "Logo IKSAJ, Ikatan Santri Annuqayah Jawa",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "organization",
};

export const viewport: Viewport = {
  themeColor: "#14110a",
  colorScheme: "dark",
};

// Data terstruktur agar Google memahami identitas organisasi
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ikatan Santri Annuqayah Jawa (IKSAJ)",
  alternateName: "IKSAJ",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  foundingDate: "1996-08-06",
  description: DESCRIPTION,
  parentOrganization: {
    "@type": "Organization",
    name: "Pondok Pesantren Annuqayah Daerah Lubangsa",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Guluk-Guluk, Sumenep",
    addressRegion: "Jawa Timur",
    addressCountry: "ID",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}