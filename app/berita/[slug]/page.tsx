import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { body, display } from "../../components/fonts";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { LandingStyles } from "../../components/ui";
import { BUCKET, publicUrl } from "@/lib/landing";
import {
  formatBeritaDate,
  getPublishedBeritaBySlug,
} from "@/lib/public-berita";

type Props = PageProps<"/berita/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const berita = await getPublishedBeritaBySlug(slug);

  if (!berita) return { title: "Berita tidak ditemukan" };

  return {
    title: berita.title,
    description: berita.summary,
    alternates: { canonical: `/berita/${berita.slug}` },
  };
}

export default function ArtikelBeritaPage({ params }: Props) {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#14110a] font-[family-name:var(--font-body)] text-[#FBF6E6] selection:bg-[#FFD21F] selection:text-[#14110a]`}
    >
      <LandingStyles />
      <Navbar />
      <Suspense fallback={<ArtikelLoading />}>
        <ArtikelBerita params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}

async function ArtikelBerita({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = await getPublishedBeritaBySlug(slug);

  if (!berita) notFound();

  const cover = publicUrl(BUCKET.berita, berita.cover_path);

  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-5 pb-24 pt-32">
        <Link
          href="/berita"
          className="text-sm font-bold text-[#FFD21F] transition-colors hover:text-[#FBF6E6]"
        >
          ← Semua berita
        </Link>

        <article className="mt-10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest">
            <span className="rounded-full bg-[#FFD21F] px-3 py-1 text-[#14110a]">
              {berita.category}
            </span>
            <time dateTime={berita.created_at} className="text-[#FBF6E6]/50">
              {formatBeritaDate(berita.created_at)}
            </time>
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {berita.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#FBF6E6]/70">
            {berita.summary}
          </p>

          {cover && (
            <div className="relative mt-9 aspect-[16/9] overflow-hidden rounded-3xl border-2 border-[#FFD21F]/20 bg-[#FBF6E6]/5">
              <Image
                src={cover}
                alt={berita.title}
                fill
                unoptimized
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mt-10 whitespace-pre-wrap break-words text-base leading-8 text-[#FBF6E6]/85">
            {berita.content}
          </div>
        </article>
    </main>
  );
}

function ArtikelLoading() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-5 pb-24 pt-32">
      <p className="text-sm text-[#FBF6E6]/50">Memuat artikel...</p>
    </main>
  );
}
