import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/brand/Logo";
import { IconInstagram, IconWhatsApp } from "@/components/ui/Icon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white">
      <div className="container-site py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo invert className="text-2xl" />
            <p className="display-sm mt-6 max-w-xs text-[1.35rem] text-white/90">{siteConfig.claim}</p>
            <div className="mt-6 flex gap-3">
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${siteConfig.instagram.handle}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/15 transition-colors hover:border-blue hover:text-blue"
              >
                <IconInstagram size={18} />
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/15 transition-colors hover:border-blue hover:text-blue"
              >
                <IconWhatsApp size={18} />
              </a>
            </div>
          </div>

          <FooterCol title="Tienda">
            <FooterLink href="/iphones">Todos los iPhones</FooterLink>
            <FooterLink href="/iphones?estado=nuevo">Nuevos</FooterLink>
            <FooterLink href="/iphones?estado=seminuevo">Seminuevos</FooterLink>
            <FooterLink href="/comparador">Comparador</FooterLink>
          </FooterCol>

          <FooterCol title="Servicios">
            <FooterLink href="/plan-recambio">Plan Recambio</FooterLink>
            <FooterLink href="/preguntas-frecuentes#garantia">Garantía</FooterLink>
            <FooterLink href="/preguntas-frecuentes#envios">Envíos</FooterLink>
            <FooterLink href="/preguntas-frecuentes#pagos">Formas de pago</FooterLink>
          </FooterCol>

          <FooterCol title="Phone Haus">
            <FooterLink href="/nosotros">Nosotros</FooterLink>
            <FooterLink href="/preguntas-frecuentes">Preguntas frecuentes</FooterLink>
            <FooterLink href="/contacto">Contacto</FooterLink>
            <li className="text-white/50">Local: {siteConfig.location.label}</li>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© {year} Phone Haus. Uruguay.</p>
          <p>Apple, iPhone y sus marcas son propiedad de Apple Inc. Phone Haus es un revendedor independiente.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white/45">{title}</h2>
      <ul className="mt-4 space-y-3 text-[0.95rem]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-white/85 transition-colors hover:text-blue">
        {children}
      </Link>
    </li>
  );
}
