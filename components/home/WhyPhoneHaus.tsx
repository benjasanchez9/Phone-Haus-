import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { IconCheck } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Qué significa comprar en Phone Haus, contado desde la revisión:
 * qué se revisa en cada seminuevo y qué respalda la compra.
 */
const commitments = [
  {
    title: "Garantía",
    text: `${siteConfig.warranty.new.duration} oficial de Apple en nuevos. ${siteConfig.warranty.used.duration} de Phone Haus en seminuevos.`,
  },
  {
    title: "Plan Recambio",
    text: "Tu iPhone como parte de pago. Lo cotizás online y confirmamos el valor al revisarlo.",
  },
  {
    title: "Atención de una persona",
    text: "Te asesoramos por WhatsApp antes, durante y después de la compra.",
  },
];

export function WhyPhoneHaus() {
  return (
    <section className="section border-t border-line" aria-labelledby="por-que">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeader
            title={<span id="por-que">Así revisamos cada seminuevo</span>}
            intro="Antes de publicarlo, un técnico prueba cada equipo y mide su batería. Lo que ves en la ficha es lo que encontró."
          />
          <ul className="mt-8 grid grid-cols-2 gap-x-6 sm:grid-cols-4 lg:grid-cols-2">
            {siteConfig.checkedPoints.map((p) => (
              <li key={p} className="flex items-center gap-2 border-t border-line py-3 text-[0.95rem] font-medium">
                <IconCheck size={16} className="shrink-0 text-blue" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <dl className="self-end border-t-2 border-ink">
          {commitments.map((c) => (
            <div key={c.title} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-bold tracking-tight">{c.title}</dt>
              <dd className="leading-relaxed text-mute">{c.text}</dd>
            </div>
          ))}
          <div className="pt-5">
            <Link href="/preguntas-frecuentes#garantia" className="text-sm font-semibold text-blue underline-offset-4 hover:underline">
              Qué cubre la garantía
            </Link>
          </div>
        </dl>
      </div>
    </section>
  );
}
