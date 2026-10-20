import { body, display } from "./components/fonts";
import { LandingStyles } from "./components/ui";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import BeritaSection from "./components/berita/BeritaSection";
import KaryaSection from "./components/karya/KaryaSection";
import GaleriSection from "./components/galeri/GaleriSection";
import { getLandingData } from "@/lib/landing";

const DAERAH = [
  "Jember", "Bondowoso", "Situbondo", "Banyuwangi",
  "Lubangsa", "Guluk-Guluk", "Sumenep", "Annuqayah",
];

export default async function Home() {
  const { berita, karya, galeri } = await getLandingData();

  return (
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-x-clip bg-[#14110a] font-[family-name:var(--font-body)] text-[#FBF6E6] selection:bg-[#FFD21F] selection:text-[#14110a]`}
    >
      <LandingStyles />
      <Navbar />
      <Hero />

      {/* marquee */}
      <div className="overflow-hidden py-3">
        <div className="-ml-[3%] w-[106%] -rotate-1 border-y-4 border-[#14110a] bg-[#FFD21F] py-4 text-[#14110a]">
          <div className="marquee-track flex w-max whitespace-nowrap">
            {[...DAERAH, ...DAERAH].map((d, i) => (
              <span
                key={i}
                className="mx-6 flex items-center gap-6 font-[family-name:var(--font-display)] text-2xl font-extrabold uppercase tracking-tight md:text-4xl"
              >
                {d}
                <span className="text-xl">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <BeritaSection items={berita} />
      <KaryaSection items={karya} />
      <GaleriSection items={galeri} />
      <Footer />
    </div>
  );
}