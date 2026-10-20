"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

/* satu observer untuk semua Reveal */
const callbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function observeOnce(el: Element, cb: () => void) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          sharedObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
  }
  callbacks.set(el, cb);
  sharedObserver.observe(el);
  return () => {
    callbacks.delete(el);
    sharedObserver?.unobserve(el);
  };
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setShow(true));
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Marker({ children }: { children: ReactNode }) {
  return (
    <span className="bg-[linear-gradient(transparent_62%,#FFD21F_62%)] px-1">
      {children}
    </span>
  );
}

export function SectionTag({
  no,
  text,
  dark = false,
}: {
  no: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="rounded-full bg-[#FFD21F] px-3 py-1 text-xs font-bold tracking-widest text-[#14110a]">
        {no}
      </span>
      <span
        className={`text-xs font-semibold uppercase tracking-[0.3em] ${
          dark ? "text-[#FFD21F]" : "text-[#14110a]/60"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

export function Logo({
  size = 40,
  className = "bg-[#FBF6E6]",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full p-1 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="Logo IKSAJ"
        width={size}
        height={size}
        priority
        className="h-full w-full object-contain"
      />
    </span>
  );
}

export function LandingStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      section[id] { scroll-margin-top: 4.5rem; }
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @keyframes draw { to { stroke-dashoffset: 0; } }
      @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes spin360 { to { transform: rotate(360deg); } }
      .marquee-track { animation: marquee 30s linear infinite; will-change: transform; }
      .rope { stroke-dasharray: 2400; stroke-dashoffset: 2400; animation: draw 3.2s ease-out 0.4s forwards; }
      .floaty { animation: floaty 6s ease-in-out infinite; will-change: transform; }
      .spin-slow { animation: spin360 24s linear infinite; will-change: transform; }
      .outline-text { -webkit-text-stroke: 2px #FFD21F; color: transparent; }
      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        .marquee-track, .floaty, .spin-slow { animation: none; }
        .rope { animation: none; stroke-dashoffset: 0; }
      }
    `}</style>
  );
}