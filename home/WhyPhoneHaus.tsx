import { siteConfig } from "@/data/site-config";
import { IconBadgeCheck, IconChat, IconShield, IconSwap } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

const items = [
  {
    icon: IconShield,
    title: "Garantía",
    text: `${siteConfig.warranty.new.duration} oficial de Apple en nuevos. ${siteConfig.warranty.used.duration} Phone Haus en seminuevos.`,
  },
  {
    icon: IconBadgeCheck,
    title: "Equipos verificados",
    text: "Cada seminuevo pasa por Phone Haus Checked: batería, pantalla, Face ID, cámaras y más.",
  },
  {
    icon: IconSwap,
    title: "Plan Recambio",
    text: "Entregá tu iPhone como parte de pago. Cotizás online y confirmamos en la revisión.",
  },
  {
    icon: IconChat,
    title: "Atención personalizada",
    text: "Te asesora una persona, no un bot. Antes, durante y después de la compra.",
  },
];

export function WhyPhoneHaus() {
  return (
    <section className="section border-t border-line" aria-labelledby="por-que">
      <div className="container-site">
        <SectionHeader title={<span id="por-que">Por qué Phone Haus</span>} intro="Tecnología con confianza: lo que eso significa cuando comprás con nosotros." />
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title} className="border-t border-ink pt-5">
              <Icon size={22} className="text-blue" />
              <h3 className="mt-4 text-lg font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-mute">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
