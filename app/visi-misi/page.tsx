
import type { Metadata } from "next";
import Link from "next/link";
import OrganizationPage from "../components/OrganizationPage";

export const metadata: Metadata = {
  title: "Visi & Misi",
  description:
    "Visi dan enam misi Ikatan Santri Annuqayah Jawa (IKSAJ) dalam membentuk pribadi muslim yang bertakwa, berilmu, berakhlak luhur, dan bertanggung jawab.",
  alternates: { canonical: "/visi-misi" },
};

const misi = [
  {
    number: "01",
    title: "Keimanan dan ketakwaan",
    description:
      "Meningkatkan keimanan dan ketakwaan kepada Allah SWT sebagai landasan kehidupan dan perjuangan organisasi.",
  },
  {
    number: "02",
    title: "Pengamalan nilai keislaman",
    description:
      "Melaksanakan nilai-nilai keislaman dalam kehidupan perseorangan dan bermasyarakat.",
  },
  {
    number: "03",
    title: "Pengembangan organisasi",
    description:
      "Mengembangkan potensi organisasi agar menjadi ruang belajar, berkarya, dan bertumbuh bagi seluruh anggota.",
  },
  {
    number: "04",
    title: "Persaudaraan dan persatuan",
    description:
      "Memupuk rasa persaudaraan dan kasih sayang antaranggota demi terciptanya persatuan dan kesatuan IKSAJ.",
  },
  {
    number: "05",
    title: "Pendidikan dan kepribadian",
    description:
      "Membangun kesadaran akan pentingnya pendidikan dalam membentuk pribadi muslim yang berakhlak dan berkepribadian luhur.",
  },
  {
    number: "06",
    title: "Kegiatan yang bermanfaat",
    description:
      "Melaksanakan berbagai kegiatan dalam bidang lainnya sesuai dengan asas dan tujuan organisasi.",
  },
];

const nilai = [
  {
    number: "01",
    title: "Religius",
    description:
      "Menjadikan keimanan, ketakwaan, dan nilai-nilai keislaman sebagai pedoman dalam setiap langkah.",
  },
  {
    number: "02",
    title: "Berilmu dan berakhlak",
    description:
      "Mengembangkan pengetahuan, kecakapan, dan budi pekerti melalui proses belajar di pesantren dan organisasi.",
  },
  {
    number: "03",
    title: "Solidaritas",
    description:
      "Menjaga kekompakan, kepedulian, dan rasa kekeluargaan dalam kehidupan bersama.",
  },
  {
    number: "04",
    title: "Tanggung jawab",
    description:
      "Belajar mengemban amanah, bekerja sama, dan memberikan kontribusi bagi organisasi serta masyarakat.",
  },
];

export default function VisiMisiPage() {
  return (
    <OrganizationPage
      eyebrow="Arah langkah organisasi"
      title="Beriman, berilmu, berakhlak, dan bertanggung jawab."
      description="Visi dan misi IKSAJ menjadi pedoman bersama dalam membentuk pribadi muslim yang bertakwa, mengembangkan potensi organisasi, dan menjaga persaudaraan santri di PP. Annuqayah Daerah Lubangsa."
    >
      <section
        aria-labelledby="visi-title"
        className="relative overflow-hidden rounded-3xl bg-[#FFD21F] p-7 text-[#14110a] md:p-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[28px] border-[#14110a]/[0.06] md:h-72 md:w-72"
        />

        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em]">
            Arah dan cita-cita
          </p>

          <h2
            id="visi-title"
            className="mt-6 font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight md:text-5xl"
          >
            Visi IKSAJ
          </h2>

          <p className="mt-5 text-lg font-semibold leading-relaxed md:text-2xl">
            Membentuk pribadi muslim yang bertakwa kepada Allah SWT,
            berbudi luhur, berilmu, cakap, dan bertanggung jawab
            dalam mengamalkan ilmu pengetahuan serta berkomitmen
            menegakkan nilai-nilai keislaman dalam kehidupan sehari-hari.
          </p>

          <div className="mt-8 h-1 w-20 rounded-full bg-[#14110a]/30" />

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#14110a]/75">
            Visi ini menjadi arah pembinaan anggota, agar proses
            berorganisasi berjalan seiring dengan pendidikan,
            pembentukan akhlak, dan pengamalan ilmu.
          </p>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="misi-title">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
          Langkah untuk mewujudkan visi
        </p>

        <h2
          id="misi-title"
          className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold md:text-4xl"
        >
          Enam misi IKSAJ
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#FBF6E6]/65">
          Visi diwujudkan melalui langkah-langkah yang mencakup
          penguatan spiritual, pengamalan ajaran Islam, pengembangan
          organisasi, persaudaraan, pendidikan, dan kegiatan yang
          bermanfaat.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {misi.map((item) => (
            <article
              key={item.number}
              className="group rounded-2xl border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.02] p-6 transition-colors hover:border-[#FFD21F]/40 hover:bg-[#FBF6E6]/[0.04] md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  {item.title}
                </h3>

                <span className="shrink-0 font-[family-name:var(--font-display)] text-lg font-extrabold text-[#FFD21F]">
                  {item.number}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#FBF6E6]/65">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
          Nilai dalam tindakan
        </p>

        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold md:text-4xl">
          Bagaimana visi dan misi dijalankan?
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#FBF6E6]/65">
          Nilai-nilai organisasi tidak berhenti pada rumusan tertulis.
          Nilai tersebut perlu hadir dalam kegiatan, hubungan
          antarangggota, proses belajar, dan pelaksanaan amanah.
          Dokumentasi kegiatan IKSAJ menunjukkan beberapa bentuk
          penerapannya dalam kehidupan organisasi.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {nilai.map((item) => (
            <article
              key={item.number}
              className="rounded-2xl border border-[#FBF6E6]/10 p-6"
            >
              <span className="text-sm font-bold tracking-widest text-[#FFD21F]">
                {item.number}
              </span>

              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold">
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
          Dari gagasan menjadi gerakan
        </p>

        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-extrabold md:text-4xl">
          Organisasi sebagai ruang belajar dan pengabdian.
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#FBF6E6]/70">
          Ngaji Organisasi, Mutalaah Organisasi, kegiatan keagamaan,
          dan aktivitas sosial merupakan contoh kegiatan IKSAJ yang
          terdokumentasi. Kegiatan semacam ini dapat menjadi sarana
          untuk memperluas wawasan, melatih tanggung jawab, merawat
          persaudaraan, serta menumbuhkan kepedulian terhadap sesama.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/tentang"
            className="rounded-full border border-[#FBF6E6]/20 px-5 py-3 text-sm font-bold transition-colors hover:border-[#FFD21F]/60 hover:text-[#FFD21F]"
          >
            Tentang IKSAJ
          </Link>

          <Link
            href="/sejarah"
            className="rounded-full bg-[#FFD21F] px-5 py-3 text-sm font-bold text-[#14110a] transition-colors hover:bg-[#FBF6E6]"
          >
            Telusuri sejarah →
          </Link>
        </div>
      </section>

      <aside className="mt-8 rounded-2xl border border-[#FBF6E6]/10 p-5">
        <h2 className="text-sm font-bold">
          Rujukan visi dan misi
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#FBF6E6]/55">
          Rumusan visi dan enam misi merujuk pada halaman IKSAJ
          yang dipublikasikan di situs PP. Annuqayah Daerah Lubangsa.
          Uraian pada kartu-kartu di atas merupakan penjelasan
          pengembangan dari setiap misi agar lebih mudah dipahami.
        </p>

        <a
          href="https://www.lubangsa.org/lubangsa_v2/page/IKSAJ"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-sm font-semibold text-[#FFD21F] hover:underline"
        >
          Lihat visi & misi pada situs Lubangsa ↗
        </a>

        <a
          href="https://lubangsa.org/berita/iksaj-ngaji-organisasi-mengokohkan-loyalitas-dan-profesionalitas-elemen-organisasi"
          target="_blank"
          rel="noreferrer"
          className="mt-3 block text-sm font-semibold text-[#FFD21F] hover:underline"
        >
          Baca dokumentasi Ngaji Organisasi ↗
        </a>
      </aside>
    </OrganizationPage>
  );
}
