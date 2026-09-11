import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { IconTruck } from "@/components/ui/Icon";

export function PaymentsShipping() {
  const { payments, shipping } = siteConfig;
  return (
    <section className="section bg-surface" aria-label="Formas de pago y envíos">
      <div className="container-site grid gap-16 lg:grid-cols-2 lg:gap-20">
        <div id="pagos">
          <span className="rule mb-5" aria-hidden />
          <h2 className="display text-[2.2rem] sm:text-[3rem]">Formas de pago</h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {payments.methods.map((m) => (
              <li key={m.id} className="flex items-baseline justify-between gap-6 py-4">
                <span className="text-lg font-bold tracking-tight">{m.label}</span>
                <span className="text-right text-sm text-mute">{m.detail}</span>
              </li>
            ))}
          </ul>
          {payments.installments.enabled && (
            <p className="mt-5 text-sm text-mute">
              Hasta <strong className="font-semibold text-ink">{payments.installments.maxInstallments} cuotas</strong> con {payments.installments.provider}. {payments.installments.note}
            </p>
          )}
        </div>

        <div id="envios">
          <span className="rule mb-5" aria-hidden />
          <h2 className="display text-[2.2rem] sm:text-[3rem]">Envíos</h2>
          <p className="mt-6 flex items-center gap-3 text-xl font-bold tracking-tight">
            <IconTruck size={24} className="text-blue" />
            {shipping.headline}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {shipping.zones.map((z) => (
              <li key={z.id} className="rounded-md border border-line p-5">
                <p className="font-bold">{z.label}</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-mute">Tiempo</dt>
                    <dd>{z.time ?? "A coordinar"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-mute">Costo</dt>
                    <dd>{z.cost ?? "A coordinar"}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-mute">
            {shipping.note}{" "}
            <Link href="/preguntas-frecuentes#envios" className="font-medium text-blue hover:underline">
              Más sobre envíos
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
