import type { Metadata } from "next";
import Link from "next/link";
import OrganizationPage from "../components/OrganizationPage";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal IKSAJ (Ikatan Santri Annuqayah Jawa), organisasi daerah santri asal Jawa di PP. Annuqayah Daerah Lubangsa, Guluk-Guluk, Sumenep.",
  alternates: { canonical: "/tentang" },
};

const highlights = [
  {
    number: "01",
    title: "Persaudaraan",
    description:
      "Merawat tali silaturahmi, mempererat rasa kekeluargaan, dan membangun solidaritas antarsantri asal Jawa dalam kehidupan pesantren.",
  },
  {
    number: "02",
    title: "Keislaman dan akhlak",
    description:
      "Menumbuhkan pribadi muslim yang bertakwa, berbudi luhur, serta menjadikan nilai-nilai keislaman sebagai pedoman dalam kehidupan sehari-hari.",
  },
  {
    number: "03",
    title: "Belajar dan berkontribusi",
    description:
      "Menjadi ruang untuk mengasah potensi, melatih tanggung jawab, mengembangkan kreativitas, dan belajar berorganisasi melalui pengalaman bersama.",
  },
];

export default function TentangPage() {
  return (
    <OrganizationPage
      eyebrow="Mengenal IKSAJ"
      title="Satu ikatan, ruang untuk tumbuh bersama."
      description="Ikatan Santri Annuqayah Jawa (IKSAJ) adalah organisasi daerah (ORDA) bagi santri asal Jawa yang menempuh pendidikan di Pondok Pesantren Annuqayah Daerah Lubangsa, Guluk-Guluk, Sumenep, Jawa Timur."
    >
      <section className="grid gap-8 rounded-3xl border border-[#FFD21F]/25 bg-[#FBF6E6]/[0.03] p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
            Siapa kami
          </p>

          <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-extrabold md:text-3xl">
            Berasal dari daerah yang sama, bertumbuh dalam satu keluarga.
          </h2>

          <p className="mt-5 text-base leading-relaxed text-[#FBF6E6]/75">
            Kehidupan pesantren bukan hanya tentang menuntut ilmu,
            tetapi juga tentang belajar hidup bersama, membangun
            kepedulian, dan menempa karakter. Dalam perjalanan itu,
            IKSAJ hadir sebagai wadah bagi santri asal Jawa untuk
            saling mengenal, menguatkan persaudaraan, dan mengembangkan
            potensi diri.
          </p>

          <p className="mt-4 text-base leading-relaxed text-[#FBF6E6]/75">
            Sebagai organisasi daerah di bawah naungan PP. Annuqayah
            Daerah Lubangsa, IKSAJ menjadi bagian dari kehidupan
            keorganisasian pesantren. Di dalamnya, anggota belajar
            bekerja sama, bertanggung jawab, dan menerjemahkan
            nilai-nilai keislaman ke dalam tindakan nyata.
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-[#FFD21F] p-7 text-[#14110a]">
          <span className="text-xs font-bold uppercase tracking-[0.25em]">
            Awal perjalanan
          </span>

          <span className="mt-2 font-[family-name:var(--font-display)] text-6xl font-extrabold">
            1996
          </span>

          <span className="mt-1 text-sm font-semibold">
            6 Agustus 1996
          </span>

          <p className="mt-5 text-sm leading-relaxed text-[#14110a]/80">
            Tanggal lahir IKSAJ sebagai wadah kebersamaan,
            kreativitas, dan pengembangan diri santri Jawa
            di lingkungan pesantren.
          </p>

          <Link
            href="/sejarah"
            className="mt-6 w-fit rounded-full border-2 border-[#14110a] px-4 py-2 text-sm font-bold transition-colors hover:bg-[#14110a] hover:text-[#FFD21F]"
          >
            Telusuri sejarah →
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
          Mengenal lebih dekat
        </p>

        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold md:text-4xl">
          Berawal dari semangat kebersamaan.
        </h2>

        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-[#FBF6E6]/75">
          <p>
            Sebelum bernama IKSAJ, perkumpulan santri Jawa di
            lingkungan Annuqayah Daerah Lubangsa pernah menggunakan
            nama SANTIKA (Santri Tiga Kabupaten), kemudian AKBAR 88.
            Perjalanan tersebut menjadi bagian dari latar belakang
            terbentuknya IKSAJ sebagai wadah kebersamaan santri Jawa.
          </p>

          <p>
            Pada 6 Agustus 1996, Moh. Holil Syarqawi mengajak
            sejumlah santri asal Jember, Bondowoso, Situbondo,
            dan sekitarnya untuk bermusyawarah. Pertemuan itu
            melahirkan kesepakatan membentuk Ikatan Santri
            Annuqayah Jawa (IKSAJ), dengan semangat menghimpun
            anggota sekaligus memberi ruang bagi kreativitas
            dan kegiatan bersama.
          </p>

          <p>
            Sejak itu, IKSAJ menjadi bagian dari dinamika
            organisasi daerah di PP. Annuqayah Daerah Lubangsa,
            tempat para santri belajar mengelola kebersamaan
            dan mengambil peran dalam kehidupan organisasi.
          </p>
        </div>

        <Link
          href="/sejarah"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#FFD21F] transition-opacity hover:opacity-75"
        >
          Baca perjalanan IKSAJ selengkapnya
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
          Nilai yang kami rawat
        </p>

        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold md:text-4xl">
          Bertumbuh dengan nilai, bergerak dengan tujuan.
        </h2>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.number}
              className="rounded-2xl border border-[#FBF6E6]/10 p-6 transition-colors hover:border-[#FFD21F]/40"
            >
              <span className="text-sm font-bold tracking-widest text-[#FFD21F]">
                {item.number}
              </span>

              <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl font-bold">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#FBF6E6]/60">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-[#FFD21F]/20 p-7 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
          Langkah bersama
        </p>

        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-extrabold md:text-4xl">
          Menjaga persaudaraan, membentuk pribadi yang bertanggung jawab.
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#FBF6E6]/70">
          IKSAJ tidak berhenti pada identitas daerah. Ia merupakan
          ruang untuk belajar, mengembangkan potensi, memperkuat
          nilai keislaman, dan menumbuhkan kepedulian terhadap
          sesama. Semua itu menjadi bagian dari proses santri
          untuk bertumbuh dan memberikan manfaat.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/visi-misi"
            className="rounded-full bg-[#FFD21F] px-5 py-3 text-sm font-bold text-[#14110a] transition-colors hover:bg-[#ffe16a]"
          >
            Kenali visi & misi →
          </Link>

          <Link
            href="/sejarah"
            className="rounded-full border border-[#FBF6E6]/20 px-5 py-3 text-sm font-bold transition-colors hover:border-[#FFD21F]/60 hover:text-[#FFD21F]"
          >
            Baca sejarah IKSAJ
          </Link>
        </div>
      </section>
    </OrganizationPage>
  );
}
