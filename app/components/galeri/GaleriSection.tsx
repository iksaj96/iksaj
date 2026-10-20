import Image from "next/image";
import Link from "next/link";
import { BUCKET, publicUrl } from "@/lib/landing";
import type { Galeri } from "@/lib/landing";
import { Reveal, SectionTag } from "../ui";

// pola bentuk kotak agar tampilan tetap seperti desain awal
const SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "",
  "sm:col-span-2",
];

export default function GaleriSection({ items }: { items: Galeri[] }) {
  return (
    <section id="galeri" className="bg-[#FFD21F] py-24 text-[#14110a]">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionTag no="03" text="Galeri" />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Momen yang{" "}
              <span className="underline decoration-[#14110a] decoration-4 underline-offset-8">
                terekam.
              </span>
            </h2>
            <Link
              href="/galeri"
              className="rounded-full border-2 border-[#14110a] px-5 py-2 text-sm font-bold transition-colors hover:bg-[#14110a] hover:text-[#FBF6E6]"
            >
              Semua foto →
            </Link>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="mt-12 rounded-3xl border-2 border-dashed border-[#14110a]/40 p-8 text-center text-[#14110a]/70">
            Belum ada dokumentasi yang diunggah.
          </p>
        ) : (
          <div className="mt-12 grid auto-rows-[160px] gap-4 sm:grid-cols-2 md:auto-rows-[200px] lg:grid-cols-4">
            {items.map((g, i) => (
              <Reveal key={g.id} delay={i * 80} className={`${SPANS[i] ?? ""} h-full`}>
                <figure className="group relative h-full overflow-hidden rounded-3xl border-2 border-[#14110a] bg-[#14110a]">
                  <Image
                    src={publicUrl(BUCKET.galeri, g.storage_path)!}
                    alt={g.title || g.caption || "Dokumentasi IKSAJ"}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {(g.title || g.caption) && (
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-[#14110a]/90 p-4 text-[#FBF6E6] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {g.title && (
                        <p className="font-[family-name:var(--font-display)] text-lg font-bold">
                          {g.title}
                        </p>
                      )}
                      {g.caption && (
                        <p className="text-xs text-[#FBF6E6]/70">{g.caption}</p>
                      )}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}