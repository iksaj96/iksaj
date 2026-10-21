
import Link from "next/link";
import { Marker } from "./ui";

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "arrow" | "message" | "sparkles";
  className?: string;
}) {
  const icons = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
        <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative isolate overflow-hidden border-b border-[#FFD21F]/10 bg-[#14110a] pb-24 pt-28 sm:pb-28 sm:pt-36 lg:pb-32 lg:pt-40"
    >
      {/* Ornamen geometris dekoratif tanpa blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-[#FFD21F]/10 sm:-right-20 sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-[#FFD21F]/[0.07] sm:h-72 sm:w-72"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-28 h-72 w-72 rounded-full border border-[#FFB000]/10 sm:h-96 sm:w-96"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 md:gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-6">
        {/* KONTEN UTAMA */}
        <div className="relative z-10 min-w-0">
          <div className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-[#FFD21F]/25 bg-[#FFD21F]/[0.05] px-3.5 py-2 sm:mb-8 sm:px-4">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#FFD21F] opacity-40 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FFD21F]" />
            </span>

            <span className="text-[9px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[#FFD21F] sm:text-[11px] sm:tracking-[0.18em]">
              Organisasi Daerah
              <span className="mx-1.5 text-[#FBF6E6]/30">·</span>
              PP. Annuqayah Lubangsa
            </span>
          </div>

          <h1
            className="font-[family-name:var(--font-display)] text-[clamp(5.5rem,19vw,9rem)] font-black leading-[0.78] tracking-[-0.085em] sm:text-[clamp(7rem,15vw,10rem)] lg:text-[9.5rem]"
            aria-label="IKSAJ"
          >
            <span className="outline-text">IK</span>
            <span className="text-[#FBF6E6]">SAJ</span>
            <span className="ml-2 align-top text-lg font-bold tracking-normal text-[#FFD21F] sm:ml-3 sm:text-2xl">
              ®
            </span>
          </h1>

          <div className="mt-7 max-w-2xl sm:mt-9">
            <p className="font-[family-name:var(--font-display)] text-[clamp(1.65rem,5vw,2.75rem)] font-bold leading-[1.2] tracking-tight text-[#FBF6E6]">
              Berawal dari <Marker>persaudaraan</Marker>, tumbuh dalam{" "}
              <Marker>perjuangan.</Marker>
            </p>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#FBF6E6]/65 sm:mt-6 sm:text-base sm:leading-8">
            Ikatan Santri Annuqayah Jawa merupakan wadah silaturahmi
            dan pengembangan potensi santri asal Jawa di Pondok
            Pesantren Annuqayah Daerah Lubangsa, Guluk-Guluk,
            Sumenep, Jawa Timur.
          </p>

          {/* TOMBOL AKSI */}
          <div className="mt-7 flex flex-col gap-3 min-[380px]:flex-row sm:mt-9 sm:gap-4">
            <Link
              href="/sejarah"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FFD21F] px-6 py-3.5 text-sm font-extrabold text-[#14110a] shadow-[0_4px_0_0_#b38f00] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#FFE36B] hover:shadow-[0_5px_0_0_#b38f00] active:translate-y-0.5 active:shadow-none sm:px-7"
            >
              <span>Telusuri Sejarah</span>
              <Icon
                name="arrow"
                className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* PENANDA IDENTITAS */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#FBF6E6]/10 pt-5 sm:mt-10 sm:pt-6">
            <div className="flex items-center gap-2 text-xs text-[#FBF6E6]/50">
              <Icon
                name="sparkles"
                className="h-4 w-4 shrink-0 text-[#FFD21F]"
              />
              <span>Semangat kebersamaan</span>
            </div>

            <span
              aria-hidden="true"
              className="hidden h-1 w-1 rounded-full bg-[#FFD21F]/50 min-[400px]:block"
            />

            <p className="text-xs text-[#FBF6E6]/50">
              Keluarga besar IKSAJ
            </p>
          </div>
        </div>

        {/* LENCANA TAHUN BERDIRI */}
        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-5 sm:py-8 lg:max-w-none lg:py-0">
          {/* Bingkai lingkaran statis */}
          <div
            aria-hidden="true"
            className="absolute h-[min(78vw,340px)] w-[min(78vw,340px)] rounded-full border border-dashed border-[#FFD21F]/25 sm:h-[350px] sm:w-[350px] lg:h-[390px] lg:w-[390px]"
          />

          <div
            aria-hidden="true"
            className="absolute h-[min(68vw,300px)] w-[min(68vw,300px)] rounded-full border border-[#FFD21F]/10 sm:h-[310px] sm:w-[310px] lg:h-[350px] lg:w-[350px]"
          />

          {/* Teks melingkar */}
          <svg
            viewBox="0 0 300 300"
            aria-hidden="true"
            className="spin-slow relative z-10 h-[min(82vw,360px)] w-[min(82vw,360px)] overflow-visible sm:h-[370px] sm:w-[370px] lg:h-[410px] lg:w-[410px]"
          >
            <defs>
              <path
                id="iksaj-circle-text"
                d="M150,150 m-126,0 a126,126 0 1,1 252,0 a126,126 0 1,1 -252,0"
              />
            </defs>

            <circle
              cx="150"
              cy="150"
              r="112"
              fill="none"
              stroke="#FFD21F"
              strokeOpacity="0.1"
              strokeWidth="1"
            />

            <text
              fill="#FFD21F"
              fontSize="11.5"
              fontWeight="700"
              letterSpacing="2.3"
            >
              <textPath href="#iksaj-circle-text">
                IKATAN SANTRI ANNUQAYAH JAWA • SEJAK 1996 • LUBANGSA •
              </textPath>
            </text>
          </svg>

          {/* Inti lencana */}
          <div className="absolute z-20 grid h-[min(48vw,190px)] w-[min(48vw,190px)] place-items-center rounded-full border-[5px] border-[#14110a] bg-[#FFD21F] text-center text-[#14110a] shadow-[0_0_0_1px_rgba(255,210,31,0.55),0_18px_45px_rgba(0,0,0,0.25)] sm:h-48 sm:w-48 lg:h-52 lg:w-52">
            <div className="px-3">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] sm:text-xs">
                Berdiri Sejak
              </p>

              <p className="mt-1 font-[family-name:var(--font-display)] text-5xl font-black leading-none tracking-[-0.07em] sm:text-6xl lg:text-7xl">
                1996
              </p>

              <div className="mx-auto my-2.5 h-px w-12 bg-[#14110a]/30 sm:my-3" />

              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] sm:text-xs">
                6 Agustus
              </p>
            </div>
          </div>

          {/* Label kecil */}
          <div className="absolute bottom-0 right-0 z-20 flex items-center gap-2 rounded-2xl border border-[#FFD21F]/20 bg-[#14110a] px-3 py-2.5 shadow-[4px_4px_0_0_rgba(255,210,31,0.12)] sm:bottom-2 sm:right-2 sm:px-4 sm:py-3 lg:bottom-0 lg:right-0">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#FFD21F]/10 text-[#FFD21F]">
              <Icon name="sparkles" className="h-4 w-4" />
            </span>

            <span>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-[#FBF6E6]/45">
                Satu ikatan
              </span>
              <span className="mt-0.5 block text-xs font-extrabold text-[#FBF6E6]">
                Satu persaudaraan
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ORNAMEN TALI PERSAUDARAAN */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full sm:h-16 lg:h-20"
      >
        <path
          d="M0,55 C100,5 180,90 300,48 S500,8 600,52 S820,95 920,48 S1120,15 1200,55"
          fill="none"
          stroke="#FFD21F"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />

        <path
          d="M0,70 C110,28 190,100 310,67 S510,25 610,70 S830,105 930,65 S1130,35 1200,72"
          fill="none"
          stroke="#FFB000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
      </svg>
    </section>
  );
}
