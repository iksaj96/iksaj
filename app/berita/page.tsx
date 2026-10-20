import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { body, display } from "../components/fonts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LandingStyles } from "../components/ui";
import { BUCKET, publicUrl } from "@/lib/landing";
import { formatBeritaDate, getPublishedBerita } from "@/lib/public-berita";

export const metadata: Metadata = {
  title: "Berita",
  description: "Kabar terbaru, pengumuman, dan cerita dari IKSAJ.",
  alternates: { canonical: "/berita" },
};

export default function BeritaPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#14110a] font-[family-name:var(--font-body)] text-[#FBF6E6] selection:bg-[#FFD21F] selection:text-[#14110a]`}
    >
      <LandingStyles />
      <Navbar />

      <main className="mx-auto min-h-[70vh] max-w-6xl px-5 pb-24 pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD21F]">
          Publikasi IKSAJ
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Semua berita
        </h1>
        <p className="mt-4 max-w-2xl text-[#FBF6E6]/65">
          Kabar terbaru, pengumuman, dan cerita dari keluarga besar IKSAJ.
        </p>
        <Suspense fallback={<BeritaLoading />}>
          <PublishedBeritaList />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function PublishedBeritaList() {
  const berita = await getPublishedBerita();

  return (
    <>
      {berita.length === 0 ? (
        <p className="mt-12 rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60">
          Belum ada berita yang dipublikasikan.
        </p>
      ) : (
        <>
          <p className="mt-10 text-sm text-[#FBF6E6]/50">
            {berita.length} berita
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {berita.map((item, index) => {
              const cover = publicUrl(BUCKET.berita, item.cover_path);

              return (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group flex h-full flex-col rounded-3xl border-2 border-[#FFD21F]/20 bg-[#FBF6E6] p-4 text-[#14110a] transition-transform hover:-translate-y-1 hover:border-[#FFD21F] sm:p-5"
                >
                  <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-2xl bg-[#FFD21F] font-[family-name:var(--font-display)] text-5xl font-extrabold">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-widest">
                    <span className="rounded-full bg-[#14110a] px-3 py-1 text-[#FFD21F]">
                      {item.category}
                    </span>
                    <time
                      dateTime={item.created_at}
                      className="text-[#14110a]/50"
                    >
                      {formatBeritaDate(item.created_at)}
                    </time>
                  </div>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-extrabold leading-snug">
                    {item.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#14110a]/70">
                    {item.summary}
                  </p>
                  <span className="mt-5 text-sm font-bold">
                    Baca selengkapnya{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function BeritaLoading() {
  return (
    <p className="mt-12 rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60">
      Memuat berita...
    </p>
  );
}
