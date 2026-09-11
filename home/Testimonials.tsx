import { siteConfig } from "@/data/site-config";
import { testimonials } from "@/data/testimonials";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Oculta mientras siteConfig.features.SHOW_TESTIMONIALS sea false.
 * Los datos actuales son PLACEHOLDERS (no reseñas reales).
 */
export function Testimonials() {
  if (!siteConfig.features.SHOW_TESTIMONIALS) return null;
  const real = testimonials.filter((t) => !t.isDemo);
  const list = real.length ? real : testimonials;
  return (
    <section className="section border-t border-line" aria-labelledby="clientes">
      <div className="container-site">
        <SectionHeader title={<span id="clientes">Clientes Phone Haus</span>} />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {list.map((t) => (
            <li key={t.id} className="border-t border-ink pt-5">
              <p className="text-lg leading-relaxed">{t.text}</p>
              <p className="mt-4 text-sm text-mute">
                {t.name}
                {t.isDemo && " (demo)"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
