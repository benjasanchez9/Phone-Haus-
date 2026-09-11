import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { TradeInWizard } from "@/components/trade-in/TradeInWizard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { IconCheck } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: { absolute: "Plan Recambio iPhone | Phone Haus Uruguay" },
  description: "Cotizá tu iPhone online en menos de dos minutos y usalo como parte de pago de tu próximo iPhone en Phone Haus.",
  alternates: { canonical: "/plan-recambio" },
};

export default async function TradeInPage() {
  const products = await getProducts();
  return (
    <div className="container-site pb-24 pt-6 sm:pt-10">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Plan Recambio" }]} className="mb-8" />
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
          <span className="rule mb-5" aria-hidden />
          <h1 className="display text-[2.6rem] sm:text-[3.8rem]">Plan Recambio</h1>
          <p className="lead mt-5 max-w-sm">
            Tu <span className="normal-case">iPhone</span> también es parte de pago. Respondé seis preguntas y conocé cuánto vale hoy.
          </p>
          <ul className="mt-8 hidden space-y-3 text-sm lg:block">
            {["Desde iPhone 11 en adelante", "Sin piezas cambiadas", "Libre de iCloud y con IMEI sin bloqueo", "Valor final confirmado en la revisión física"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <IconCheck size={16} className="text-blue" />
                {t}
              </li>
            ))}
          </ul>
        </aside>
        <div className="min-w-0">
          <TradeInWizard products={products} />
        </div>
      </div>
    </div>
  );
}
