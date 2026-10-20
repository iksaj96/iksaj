import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { body, display } from "../components/fonts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LandingStyles } from "../components/ui";
import { BUCKET, publicUrl } from "@/lib/landing";
import { getPublishedKarya } from "@/lib/public-konten";

export const metadata: Metadata = {
  title: "Karya Tulis",
  description: "Esai, puisi, opini, dan cerpen karya anggota IKSAJ.",
  alternates: { canonical: "/karya" },
};

export default function KaryaPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#14110a] font-[family-name:var(--font-body)] text-[#FBF6E6] selection:bg-[#FFD21F] selection:text-[#14110a]`}
    >
      <LandingStyles />
      <Navbar />

      <main className="mx-auto min-h-[70vh] max-w-5xl px-5 pb-24 pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD21F]">
          Publikasi IKSAJ
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Karya tulis
        </h1>
        <p className="mt-4 max-w-2xl text-[#FBF6E6]/65">
          Esai, puisi, opini, dan cerpen karya anggota IKSAJ.
        </p>
        <Suspense fallback={<KaryaLoading />}>
          <PublishedKaryaList />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function PublishedKaryaList() {
  const karya = await getPublishedKarya();

  if (karya.length === 0) {
    return (
      <p className="mt-12 rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60">
        Belum ada karya tulis yang dipublikasikan.
      </p>
    );
  }

  return (
    <>
      <p className="mt-10 text-sm text-[#FBF6E6]/50">{karya.length} karya</p>
      <ul className="mt-5 divide-y divide-[#FFD21F]/20 border-y border-[#FFD21F]/20">
        {karya.map((item, index) => {
          const cover = publicUrl(BUCKET.karya, item.cover_path);

          return (
            <li key={item.id}>
              <Link
                href={`/karya/${item.id}`}
                className="group flex flex-wrap items-center gap-x-6 gap-y-3 py-6 transition-colors hover:bg-[#FFD21F]/5 sm:flex-nowrap"
              >
                <span className="w-14 shrink-0 font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#FFD21F] md:text-4xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {cover && (
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#FBF6E6]/5 sm:h-24 sm:w-36">
                    <Image
                      src={cover}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold leading-snug md:text-xl">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#FBF6E6]/60">
                    Oleh {item.author || "Anonim"}
                  </p>
                </div>
                <span className="rounded-full border border-[#FFD21F]/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#FFD21F]">
                  {item.category}
                </span>
                <span
                  aria-hidden
                  className="text-xl text-[#FFD21F] transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function KaryaLoading() {
  return (
    <p className="mt-12 rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60">
      Memuat karya...
    </p>
  );
}
