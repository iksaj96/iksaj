import type { Metadata } from "next";
import Link from "next/link";
import OrganizationPage from "../components/OrganizationPage";

export const metadata: Metadata = {
  title: "Sejarah IKSAJ",
  description:
    "Menelusuri sejarah Ikatan Santri Annuqayah Jawa (IKSAJ), dari SANTIKA dan AKBAR 88 hingga berdiri pada 6 Agustus 1996 dan perkembangannya di PP. Annuqayah Daerah Lubangsa.",
  alternates: { canonical: "/sejarah" },
};

const perjalanan = [
  {
    date: "Sebelum 1996",
    title: "Jejak perkumpulan santri Jawa",
    description:
      "Sebelum IKSAJ terbentuk, santri Jawa di lingkungan PP. Annuqayah Daerah Lubangsa pernah berhimpun dalam SANTIKA (Santri Tiga Kabupaten), yang beranggotakan santri dari Jember, Banyuwangi, dan Situbondo. Perkumpulan berikutnya dikenal dengan nama AKBAR 88.",
    tag: "Awal mula",
  },
  {
    date: "Sekitar 1994–1996",
    title: "Muncul kebutuhan untuk berhimpun kembali",
    description:
      "Menurut riwayat yang dipublikasikan di situs Lubangsa, setelah masa AKBAR 88, santri Jawa sempat tidak memiliki perkumpulan selama sekitar dua tahun. Kebutuhan akan wadah bersama kemudian mendorong lahirnya kembali sebuah organisasi.",
    tag: "Masa peralihan",
  },
  {
    date: "6 Agustus 1996",
    title: "Lahirnya IKSAJ",
    description:
      "Moh. Holil Syarqawi mengajak sejumlah santri asal Jember, Bondowoso, Situbondo, dan sekitarnya untuk berkumpul dan bermusyawarah. Pertemuan tersebut menghasilkan kesepakatan membentuk Ikatan Santri Annuqayah Jawa (IKSAJ) sebagai wadah kebersamaan dan pengembangan kreativitas santri Jawa.",
    tag: "Tonggak sejarah",
  },
  {
    date: "2019–2020",
    title: "Menghidupkan kegiatan keagamaan dan pendidikan organisasi",
    description:
      "Dokumentasi kegiatan IKSAJ menunjukkan adanya peringatan Maulid Nabi melalui kegiatan bersholawat pada 2019 dan kegiatan Mutalaah Organisasi pada 2020. Kegiatan ini memperlihatkan peran organisasi dalam kehidupan keagamaan sekaligus pembelajaran keorganisasian anggotanya.",
    tag: "Kegiatan organisasi",
  },
  {
    date: "2021",
    title: "Penguatan kapasitas dan regenerasi pengurus",
    description:
      "IKSAJ menyelenggarakan Ngaji Organisasi dalam rangkaian Safari Ramadan serta melaksanakan pelantikan pengurus. Dokumentasi tersebut menunjukkan pentingnya pembelajaran dari para senior, kekompakan, komunikasi, dan keberlanjutan kepemimpinan organisasi.",
    tag: "Pengembangan",
  },
  {
    date: "5–6 Agustus 2022",
    title: "Mengenang perjalanan melalui Harlah ke-26",
    description:
      "Peringatan hari lahir ke-26 IKSAJ diselenggarakan di Aula Lubangsa dengan melibatkan alumni. Salah satu rangkaiannya berupa podcast bersama tokoh-tokoh organisasi untuk membantu anggota mengenal dan mengenang sejarah perjuangan IKSAJ.",
    tag: "Peringatan sejarah",
  },
];

export default function SejarahPage() {
  return (
    <OrganizationPage
      eyebrow="Perjalanan IKSAJ"
      title="Dari perkumpulan menjadi ikatan."
      description="Sejarah IKSAJ adalah perjalanan merawat persaudaraan santri Jawa, membangun wadah bersama, dan meneruskan tradisi belajar serta berorganisasi di PP. Annuqayah Daerah Lubangsa."
    >
      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-[#FBF6E6]/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD21F]">
            Tahun berdiri
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold">
            1996
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#FBF6E6]/60">
            Menjadi awal perjalanan IKSAJ dengan nama dan identitasnya
            yang dikenal hingga kini.
          </p>
        </article>

        <article className="rounded-2xl border border-[#FBF6E6]/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD21F]">
            Tanggal berdiri
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold">
            6 Agustus
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#FBF6E6]/60">
            Tanggal musyawarah yang melahirkan kesepakatan pembentukan
            Ikatan Santri Annuqayah Jawa.
          </p>
        </article>

        <article className="rounded-2xl border border-[#FBF6E6]/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD21F]">
            Lingkungan
          </p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-extrabold">
            Lubangsa
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#FBF6E6]/60">
            Tempat IKSAJ tumbuh sebagai organisasi daerah dalam
            kehidupan pesantren.
          </p>
        </article>
      </section>

      <section className="mt-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
          Catatan perjalanan
        </p>

        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold md:text-4xl">
          Menelusuri jejak dari masa ke masa.
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#FBF6E6]/65">
          Perjalanan IKSAJ tidak dimulai dari ruang kosong. Ia tumbuh
          dari pengalaman perkumpulan santri Jawa sebelumnya, kebutuhan
          untuk membangun wadah bersama, dan ikhtiar para anggota dalam
          menjaga keberlangsungan organisasi.
        </p>
      </section>

      <section className="relative mt-8 space-y-5 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-px before:bg-[#FFD21F]/35 md:before:left-[23px]">
        {perjalanan.map((item, index) => (
          <article
            key={item.date}
            className="relative grid gap-4 rounded-2xl border border-[#FBF6E6]/10 bg-[#FBF6E6]/[0.02] p-5 pl-14 transition-colors hover:border-[#FFD21F]/30 md:grid-cols-[190px_1fr] md:gap-8 md:p-7 md:pl-16"
          >
            <span
              className="absolute left-[12px] top-7 flex h-4 w-4 items-center justify-center rounded-full border-4 border-[#14110a] bg-[#FFD21F] md:left-[16px] md:top-9"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-bold text-[#FFD21F]">
                {item.date}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#FBF6E6]/40">
                {item.tag}
              </p>
            </div>

            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#FBF6E6]/65">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-3xl border border-[#FFD21F]/20 p-6 md:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD21F]">
          Warisan organisasi
        </p>

        <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-extrabold md:text-3xl">
          Sejarah bukan sekadar untuk dikenang.
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#FBF6E6]/65 md:text-base">
          Mengenal sejarah IKSAJ berarti memahami semangat yang
          melatarbelakangi kelahirannya: kebutuhan untuk bersatu,
          belajar, dan mengembangkan potensi bersama. Setiap generasi
          memiliki tanggung jawab untuk menjaga persaudaraan,
          memperkuat organisasi, dan meneruskan nilai-nilai
          keislaman dalam kehidupan sehari-hari.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/tentang"
            className="rounded-full border border-[#FBF6E6]/20 px-5 py-3 text-sm font-bold transition-colors hover:border-[#FFD21F]/60 hover:text-[#FFD21F]"
          >
            Tentang IKSAJ
          </Link>

          <Link
            href="/visi-misi"
            className="rounded-full bg-[#FFD21F] px-5 py-3 text-sm font-bold text-[#14110a] transition-colors hover:bg-[#FBF6E6]"
          >
            Lihat visi &amp; misi →
          </Link>
        </div>
      </section>

      <aside className="mt-8 rounded-2xl border border-[#FBF6E6]/10 p-5">
        <h2 className="text-sm font-bold">Sumber dan catatan sejarah</h2>

        <p className="mt-3 text-sm leading-relaxed text-[#FBF6E6]/55">
          Kronologi disusun berdasarkan publikasi di situs PP.
          Annuqayah Daerah Lubangsa. Rentang sekitar 1994–1996
          merupakan perkiraan dari keterangan bahwa pernah terjadi
          kekosongan perkumpulan selama sekitar dua tahun sebelum
          IKSAJ berdiri. Dokumentasi kegiatan pada 2019–2022
          merupakan contoh perkembangan yang tercatat, bukan
          riwayat lengkap seluruh periode kepengurusan.
        </p>

        <div className="mt-4 flex flex-col items-start gap-3 text-sm">
          <a
            href="https://www.lubangsa.org/lubangsa_v2/page/IKSAJ"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#FFD21F] hover:underline"
          >
            Sejarah IKSAJ — situs Lubangsa ↗
          </a>

          <a
            href="https://lubangsa.org/berita/iksaj-adakan-mutalaah-organisai-bagi-anggota"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#FFD21F] hover:underline"
          >
            Mutalaah Organisasi, 2020 ↗
          </a>

          <a
            href="https://lubangsa.org/berita/iksaj-ngaji-organisasi-mengokohkan-loyalitas-dan-profesionalitas-elemen-organisasi"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#FFD21F] hover:underline"
          >
            Ngaji Organisasi, 2021 ↗
          </a>

          <a
            href="https://lubangsa.org/berita/harlah-iksaj-ke-26-sukses-adakan-podcast-agar-lebih-meriah"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#FFD21F] hover:underline"
          >
            Harlah IKSAJ ke-26, 2022 ↗
          </a>
        </div>
      </aside>
    </OrganizationPage>
  );
}
