import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { body, display } from "../components/fonts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LandingStyles } from "../components/ui";
import { BUCKET, publicUrl } from "@/lib/landing";
import { getGaleriPhotos } from "@/lib/public-konten";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Dokumentasi kegiatan dan momen keluarga besar IKSAJ.",
  alternates: { canonical: "/galeri" },
};

export default function GaleriPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#14110a] font-[family-name:var(--font-body)] text-[#FBF6E6] selection:bg-[#FFD21F] selection:text-[#14110a]`}
    >
      <LandingStyles />
      <Navbar />

      <main className="mx-auto min-h-[70vh] max-w-6xl px-5 pb-24 pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD21F]">
          Dokumentasi IKSAJ
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Galeri foto
        </h1>
        <p className="mt-4 max-w-2xl text-[#FBF6E6]/65">
          Momen kebersamaan dan kegiatan keluarga besar IKSAJ.
        </p>
        <Suspense fallback={<GaleriLoading />}>
          <PublishedGaleri />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function PublishedGaleri() {
  const photos = await getGaleriPhotos();

  if (photos.length === 0) {
    return (
      <p className="mt-12 rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60">
        Belum ada dokumentasi yang diunggah.
      </p>
    );
  }

  return (
    <>
      <p className="mt-10 text-sm text-[#FBF6E6]/50">
        {photos.length} foto
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <figure
            key={photo.id}
            className="group overflow-hidden rounded-3xl border-2 border-[#FFD21F]/20 bg-[#FBF6E6] text-[#14110a] transition-colors hover:border-[#FFD21F]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#14110a]">
              <Image
                src={publicUrl(BUCKET.galeri, photo.storage_path)!}
                alt={photo.title || photo.caption || "Dokumentasi IKSAJ"}
                fill
                unoptimized
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {(photo.title || photo.caption) && (
              <figcaption className="p-4">
                {photo.title && (
                  <p className="font-[family-name:var(--font-display)] text-lg font-bold">
                    {photo.title}
                  </p>
                )}
                {photo.caption && (
                  <p className="mt-1 text-sm text-[#14110a]/65">
                    {photo.caption}
                  </p>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </>
  );
}

function GaleriLoading() {
  return (
    <p className="mt-12 rounded-3xl border-2 border-dashed border-[#FFD21F]/30 p-8 text-center text-[#FBF6E6]/60">
      Memuat galeri...
    </p>
  );
}
