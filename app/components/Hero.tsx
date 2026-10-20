import Link from "next/link";
import { Marker } from "./ui";

export default function Hero() {
  return (
    <section id="beranda" className="relative overflow-hidden pb-24 pt-36 md:pt-44">
      <div className="pointer-events-none absolute -right-40 -top-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,210,31,0.22)_0%,rgba(255,210,31,0)_65%)]" />
      <div className="pointer-events-none absolute -bottom-20 -left-48 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(255,176,0,0.14)_0%,rgba(255,176,0,0)_65%)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFD21F]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#FFD21F]">
            <span className="h-2 w-2 rounded-full bg-[#FFD21F]" />
            Organisasi Daerah · PP. Annuqayah Lubangsa
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-[22vw] font-extrabold leading-[0.85] tracking-tighter md:text-[9.5rem]">
            <span className="outline-text">IK</span>SAJ
          </h1>

          <p className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug md:text-3xl">
            Berawal dari <Marker>persaudaraan</Marker>, tumbuh dalam{" "}
            <Marker>perjuangan</Marker>.
          </p>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#FBF6E6]/70">
            Ikatan Santri Annuqayah Jawa, wadah santri asal Jawa di Pondok
            Pesantren Annuqayah daerah Lubangsa, Guluk-Guluk, Sumenep, Jawa
            Timur.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sejarah"
              className="group inline-flex items-center gap-2 rounded-full bg-[#FFD21F] px-7 py-3.5 font-bold text-[#14110a] transition-transform hover:-translate-y-0.5"
            >
              Telusuri Sejarah
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center rounded-full border border-[#FBF6E6]/30 px-7 py-3.5 font-semibold transition-colors hover:border-[#FFD21F] hover:text-[#FFD21F]"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>

        {/* lencana berputar */}
        <div className="relative mx-auto grid h-72 w-72 place-items-center md:h-80 md:w-80">
          <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0">
            <defs>
              <path
                id="lingkar"
                d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0"
              />
            </defs>
            <text className="fill-[#FFD21F]" fontSize="13.5" fontWeight="700" letterSpacing="3.2">
              <textPath href="#lingkar">
                IKATAN SANTRI ANNUQAYAH JAWA • SEJAK 1996 • LUBANGSA •
              </textPath>
            </text>
          </svg>
          <div className="floaty grid h-44 w-44 place-items-center rounded-full bg-[#FFD21F] text-center text-[#14110a] md:h-48 md:w-48">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em]">Sejak</p>
              <p className="font-[family-name:var(--font-display)] text-6xl font-extrabold leading-none">
                1996
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest">6 Agustus</p>
            </div>
          </div>
        </div>
      </div>

      {/* tali ikatan */}
      <svg
        aria-hidden
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-20 w-full md:h-28"
      >
        <path
          className="rope"
          d="M0,70 C100,10 180,110 300,60 S500,10 600,65 S820,115 920,60 S1120,20 1200,70"
          fill="none"
          stroke="#FFD21F"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          className="rope"
          d="M0,85 C110,30 190,120 310,78 S510,28 610,82 S830,125 930,76 S1130,40 1200,86"
          fill="none"
          stroke="#FFB000"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </section>
  );
}