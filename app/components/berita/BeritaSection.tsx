import Image from "next/image";
import Link from "next/link";
import { BUCKET, publicUrl } from "@/lib/landing";
import type { Berita } from "@/lib/landing";
import { Marker, Reveal, SectionTag } from "../ui";

const tanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function BeritaSection({ items }: { items: Berita[] }) {
  return (
    <section id="berita" className="bg-[#FBF6E6] py-24 text-[#14110a]">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionTag no="01" text="Berita" />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Kabar terbaru dari <Marker>IKSAJ</Marker>.
            </h2>
            <Link
              href="/berita"
              className="rounded-full border-2 border-[#14110a] px-5 py-2 text-sm font-bold transition-colors hover:bg-[#14110a] hover:text-[#FBF6E6]"
            >
              Semua berita →
            </Link>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <p className="mt-12 rounded-3xl border-2 border-dashed border-[#14110a]/30 p-8 text-center text-[#14110a]/60">
            Belum ada berita yang dipublikasikan.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {items.map((b, i) => {
              const cover = publicUrl(BUCKET.berita, b.cover_path);
              return (
                <Reveal key={b.id} delay={i * 100}>
                  <Link
                    href={`/berita/${b.slug}`}
                    className="group flex h-full flex-col rounded-3xl border-2 border-[#14110a] bg-white p-6 shadow-[5px_5px_0_0_#FFD21F] transition-transform hover:-translate-y-1"
                  >
                    <div className="relative mb-4 grid h-40 place-items-center overflow-hidden rounded-2xl bg-[#FFD21F] font-[family-name:var(--font-display)] text-5xl font-extrabold">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={b.title}
                          fill
                          unoptimized
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        `0${i + 1}`
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-widest">
                      <span className="rounded-full bg-[#14110a] px-3 py-1 text-[#FFD21F]">
                        {b.category}
                      </span>
                      <span className="text-[#14110a]/50">{tanggal(b.created_at)}</span>
                    </div>
                    <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-extrabold leading-snug">
                      {b.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#14110a]/70">
                      {b.summary}
                    </p>
                    <span className="mt-5 text-sm font-bold">
                      Baca selengkapnya{" "}
                      <span className="inline-block transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}