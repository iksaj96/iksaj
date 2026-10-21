import type { ReactNode } from "react";
import { body, display } from "./fonts";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { LandingStyles } from "./ui";

export default function OrganizationPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#14110a] font-[family-name:var(--font-body)] text-[#FBF6E6] selection:bg-[#FFD21F] selection:text-[#14110a]`}
    >
      <LandingStyles />
      <Navbar />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-5 pb-24 pt-36">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD21F]">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#FBF6E6]/65">
          {description}
        </p>
        <div className="mt-12">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
