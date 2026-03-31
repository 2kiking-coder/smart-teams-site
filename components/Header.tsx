"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const COMPANY_URL =
  "https://t2l.co.kr/Source/Client/Info/C_INFO_INFOMATION.aspx";

const T2L_URL = "https://t2l.co.kr/";

const NAV = [
  { label: "회사소개", href: COMPANY_URL, external: true },
  { label: "주요기능", href: "/products", external: false },
  { label: "도입사례", href: "/cases", external: false },
  { label: "도입비용", href: "/pricing", external: false },
  { label: "T2L", href: T2L_URL, external: true },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("http")) return false;
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#555a63]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
  <span className="text-[13px] font-extrabold tracking-tight text-[#ff4d3d]">
    T2L
  </span>
  <span className="text-[15px] font-extrabold tracking-tight text-white sm:text-[16px]">
    SMART TEAMS
  </span>
  <span className="hidden text-[13px] font-medium text-white/70 md:inline-block">
    Microsoft 365 연동 (Enterprise)
  </span>
</Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {NAV.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full px-3 text-sm font-semibold text-white/88 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition",
                    isActive(item.href)
                      ? "bg-white text-slate-900"
                      : "text-white/88 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              )
            )}

            <Link
              href="/contact"
              className="ml-3 inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-[13px] font-semibold text-slate-900 transition hover:bg-white/90"
            >
              도입 문의
            </Link>

            <a
              href="https://t2l.smart-teams.co.kr:20003/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#6d5bd0] px-4 text-[13px] font-semibold text-white transition hover:opacity-90"
            >
              테스트계정
            </a>
          </nav>

          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          >
            <span className="relative block h-5 w-5">
              <span
                className={[
                  "absolute left-0 top-[2px] h-[2px] w-5 rounded-full bg-white transition-all duration-300",
                  open ? "top-[9px] rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[9px] h-[2px] w-5 rounded-full bg-white transition-all duration-300",
                  open ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[16px] h-[2px] w-5 rounded-full bg-white transition-all duration-300",
                  open ? "top-[9px] -rotate-45" : "",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setOpen(false)}
      />

      <div
        className={[
          "fixed inset-x-0 top-[68px] z-50 origin-top border-b border-white/10 bg-[#555a63]/98 px-4 pb-6 pt-4 shadow-2xl backdrop-blur-xl transition duration-300 lg:hidden",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl">
            <div className="mb-4 px-2 text-sm font-medium text-white/70">
              Microsoft 365 연동 (Enterprise)
            </div>

            <nav className="flex flex-col">
              {NAV.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-4 text-[17px] font-bold text-white transition hover:bg-white/10"
                  >
                    <span>{item.label}</span>
                    <span className="text-sm text-white/50">↗</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-center justify-between rounded-2xl px-4 py-4 text-[17px] font-bold transition",
                      isActive(item.href)
                        ? "bg-white text-slate-900"
                        : "text-white hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    <span className={isActive(item.href) ? "text-slate-500" : "text-white/40"}>
                      →
                    </span>
                  </Link>
                )
              )}
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-4 text-sm font-extrabold text-slate-900 transition hover:bg-white/90"
              >
                도입 문의
              </Link>

              <a
                href="https://t2l.smart-teams.co.kr:20003/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#6d5bd0] px-4 text-sm font-extrabold text-white transition hover:opacity-90"
              >
                테스트계정
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}