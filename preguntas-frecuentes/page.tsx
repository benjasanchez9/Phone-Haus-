import type { Metadata } from "next";
import Link from "next/link";
import { faqCategories } from "@/data/faq";
import { siteConfig } from "@/data/site-config";
import { Accordion } from "@/components/faq/Accordion";
import { PageHeader } from "@/components/ui/PageHeader";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Garantía, iPhones nuevos y seminuevos, Plan Recambio, pagos con Mercado Pago y envíos en Phone Haus.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((c) =>
      c.items.map((i) => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })),
    ),
  };

  return (
    <>
      <PageHeader
        title="Preguntas frecuentes"
        intro="Lo que más nos consultan antes de comprar o entregar un iPhone."
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Preguntas frecuentes" }]}
      />
      <div className="container-site grid gap-12 pb-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Categorías" className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
          <ul className="-mx-5 flex gap-2 overflow-x-auto scrollbar-none px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
            {faqCategories.map((c) => (
              <li key={c.id} className="shrink-0">
                <Link href={`#${c.id}`} className="block rounded border border-line px-3 py-2 text-sm font-medium transition-colors hover:border-blue hover:text-blue lg:border-0 lg:px-0 lg:py-1.5">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-14">
          {faqCategories.map((c) => (
            <section key={c.id} id={c.id} aria-labelledby={`h-${c.id}`} className="scroll-mt-[calc(var(--header-h)+24px)]">
              <h2 id={`h-${c.id}`} className="display-sm mb-4 text-[1.6rem] sm:text-[2rem]">
                {c.title}
              </h2>
              <Accordion items={c.items} />
              {c.id === "garantia" && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[siteConfig.warranty.new, siteConfig.warranty.used].map((w) => (
                    <div key={w.title} className="rounded-md border border-line bg-surface p-5">
                      <p className="font-bold">
                        {w.title}: {w.duration}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-mute">{w.text}</p>
                    </div>
                  ))}
                  <div className="rounded-md border border-ink p-5 sm:col-span-2">
                    <p className="font-bold">No cubre</p>
                    <p className="mt-2 text-sm text-mute">{siteConfig.warranty.notCovered.join(", ")}.</p>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
      <FinalCta title="¿Te quedó alguna duda?" text="Escribinos y te respondemos en el día." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
