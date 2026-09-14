import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CheckedSection } from "@/components/product/CheckedSection";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Phone Haus: iPhones nuevos y seminuevos certificados en Uruguay. Tecnología con confianza.",
  alternates: { canonical: "/nosotros" },
};

const blocks = [
  {
    title: "Qué es Phone Haus",
    text: "Una tienda uruguaya especializada en iPhone. Hacemos una sola cosa y la queremos hacer bien: que cambiar de teléfono sea claro, rápido y seguro.",
  },
  {
    title: "Qué vendemos",
    text: "iPhones nuevos, sellados de fábrica, y seminuevos seleccionados. Publicamos precio, capacidad y, en los seminuevos, la salud de batería de cada equipo.",
  },
  {
    title: "Seminuevo certificado",
    text: "Un seminuevo Phone Haus no es un usado cualquiera. Lo revisamos punto por punto antes de publicarlo y te decimos exactamente en qué estado está.",
  },
  {
    title: "Garantía",
    text: `${siteConfig.warranty.new.duration} de garantía oficial de Apple en nuevos. ${siteConfig.warranty.used.duration} de garantía Phone Haus en seminuevos, ante fallas de software o funcionamiento interno.`,
  },
  {
    title: "Plan Recambio",
    text: "Tu iPhone actual vale. Lo cotizás online, lo revisamos en persona y lo descontamos del precio de tu próximo equipo.",
  },
  {
    title: "Atención",
    text: "Te responde una persona que conoce los equipos. Te ayudamos a elegir, y seguimos disponibles después de la compra.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="container-site pt-6 sm:pt-10">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Nosotros" }]} />
      </div>

      <section className="container-site pb-16 pt-12 sm:pb-24 sm:pt-20">
        <p className="text-sm font-semibold text-blue">{siteConfig.claim.charAt(0) + siteConfig.claim.slice(1).toLowerCase()}</p>
        <h1 className="display mt-6 max-w-5xl text-[2.2rem] min-[380px]:text-[2.6rem] sm:text-[4.6rem] lg:text-[5.4rem]">
          Comprar tecnología debería ser simple. Pero, sobre todo, debería dar confianza.
        </h1>
      </section>

      <section className="border-t border-line">
        <div className="container-site grid gap-x-12 gap-y-12 py-16 sm:grid-cols-2 sm:py-24 lg:grid-cols-3">
          {blocks.map((b) => (
            <div key={b.title}>
              <span className="rule mb-5" aria-hidden />
              <h2 className="text-xl font-bold tracking-tight">{b.title}</h2>
              <p className="mt-3 leading-relaxed text-mute">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-site pb-8">
        <CheckedSection />
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/iphones" variant="dark" size="lg">
            Ver iPhones
          </ButtonLink>
          <ButtonLink href="/plan-recambio" variant="outline" size="lg">
            Cotizar mi iPhone
          </ButtonLink>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
