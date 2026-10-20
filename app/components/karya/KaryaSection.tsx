import Link from "next/link";
import type { Karya } from "@/lib/landing";
import { Reveal, SectionTag } from "../ui";

export default function KaryaSection({ items }: { items: Karya[] }) {
  return (
    <section id="karya" className="py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionTag no="02" text="Karya Tulis" dark />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Goresan pena <span className="text-[#FFD21F]">para santri.</span>
            </h2>
            <Link
              href="/karya"
              className="rounded-full border-2 border-[#FFD21F] px-5 py-2 text-sm font-bold text-[#FFD21F] transition-colors hover:bg-[#FFD21F] hover:text-[#14110a]"
            >
              Semua karya →
            </Link>
          </div>
          <p className="mt-5 max-w-2xl text-[#FBF6E6]/70">
            Esai, puisi, opini, dan cerpen karya anggota IKSAJ.
          </p>
        </Reveal>

        {items.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-dashed border-[#FFD21F]/40 p-8 text-center text-[#FBF6E6]/60">
            Belum ada karya tulis yang dipublikasikan.
          </p>
        ) : (
          <ul className="mt-12 divide-y divide-[#FFD21F]/20 border-y border-[#FFD21F]/20">
            {items.map((k, i) => (
              <li key={k.id}>
                <Reveal delay={i * 80}>
                  <Link
                    href={`/karya/${k.id}`}
                    className="group flex flex-wrap items-center gap-x-6 gap-y-2 py-6 transition-colors hover:bg-[#FFD21F]/5 sm:flex-nowrap"
                  >
                    <span className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[#FFD21F] md:text-4xl">
                      0{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold leading-snug md:text-xl">{k.title}</h3>
                      <p className="text-sm text-[#FBF6E6]/60">
                        Oleh {k.author || "Anonim"}
                      </p>
                    </div>
                    <span className="rounded-full border border-[#FFD21F]/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#FFD21F]">
                      {k.category}
                    </span>
                    <span className="text-xl text-[#FFD21F] transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}