import { whatsappUrl } from "@/lib/whatsapp";
import { IconWhatsApp } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";

export function FinalCta({ title = "¿Ya sabés cuál querés?", text = "Escribinos y encontrá tu próximo iPhone." }: { title?: string; text?: string }) {
  return (
    <section className="container-site py-16 sm:py-24">
      <div className="flex flex-col gap-8 border-y-2 border-ink py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="display text-[2.6rem] sm:text-[4.4rem]">{title}</h2>
          <p className="lead mt-4">{text}</p>
        </div>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg", "shrink-0")}>
          <IconWhatsApp size={20} />
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  );
}
