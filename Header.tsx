"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/site-config";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/brand/Logo";
import { IconClose, IconMenu, IconWhatsApp } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-md transition-colors duration-300",
        scrolled || open ? "border-line" : "border-transparent",
      )}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" aria-label="Phone Haus, ir al inicio" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative py-2 text-[0.92rem] font-medium transition-colors hover:text-blue",
                    "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:bg-blue after:transition-transform after:duration-300",
                    isActive(item.href) ? "text-ink after:scale-x-100" : "text-ink/70 after:scale-x-0",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("dark", "sm", "hidden sm:inline-flex")}
          >
            <IconWhatsApp size={16} />
            Contactar
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      <div
        id="menu-movil"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Menú móvil" className="container-site flex min-h-full flex-col pb-8 pt-4">
          <ul className="divide-y divide-line border-y border-line">
            {[{ href: "/", label: "Inicio" }, ...siteConfig.nav, { href: "/contacto", label: "Contacto" }].map((item, i) => (
              <li key={item.href} className="animate-rise" style={{ animationDelay: `${i * 35}ms` }}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "display-sm flex items-center justify-between py-4 text-[1.6rem]",
                    pathname === item.href ? "text-blue" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg", "w-full")}>
              <IconWhatsApp size={18} />
              Escribinos por WhatsApp
            </a>
            <p className="mt-4 text-center text-sm text-mute">
              {siteConfig.instagram.handle} · {siteConfig.claim.toLowerCase()}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
