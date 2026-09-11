import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";
import { whatsappUrl } from "@/lib/whatsapp";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { IconInstagram, IconTruck, IconWhatsApp } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribinos por WhatsApp o Instagram @phonehaus.uy. Envíos a Montevideo e interior.",
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  const loc = siteConfig.location;
  return (
    <>
      <PageHeader title="Contacto" intro="La forma más rápida de hablar con nosotros es WhatsApp." crumbs={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]} />
      <div className="container-site grid gap-12 pb-24 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 rounded-md bg-ink p-6 text-white transition-colors hover:bg-blue">
            <IconWhatsApp size={28} />
            <span>
              <span className="block text-lg font-bold">WhatsApp</span>
              <span className="text-sm text-white/65 group-hover:text-white/85">Consultas, compras y Plan Recambio</span>
            </span>
          </a>
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 rounded-md border border-line bg-surface p-6 transition-colors hover:border-blue"
          >
            <IconInstagram size={28} className="text-blue" />
            <span>
              <span className="block text-lg font-bold">Instagram</span>
              <span className="text-sm text-mute">{siteConfig.instagram.handle}</span>
            </span>
          </a>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-line p-6">
              <IconTruck size={24} className="text-blue" />
              <p className="mt-3 font-bold">Envíos</p>
              <p className="mt-1 text-sm text-mute">
                {siteConfig.shipping.headline} {siteConfig.shipping.zones.map((z) => z.label).join(" e ")}.
              </p>
            </div>
            <div className="rounded-md border border-line p-6">
              <p className="font-bold">Local</p>
              {loc.address ? (
                <address className="mt-1 text-sm not-italic text-mute">
                  {loc.address}
                  {loc.hours && <span className="block">{loc.hours}</span>}
                </address>
              ) : (
                <p className="display-sm mt-2 text-xl text-blue">{loc.label}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="display-sm mb-6 text-[1.6rem] sm:text-[2rem]">Dejanos tu consulta</h2>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
