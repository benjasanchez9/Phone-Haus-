import { ButtonLink } from "@/components/ui/Button";
import { PhoneRender } from "@/components/product/PhoneRender";

/* Sección fuerte de la Home: el Plan Recambio en tres pasos visuales. */
export function TradeInTeaser({ exampleValue, targetName }: { exampleValue: string; targetName: string }) {
  return (
    <section className="bg-ink text-white" aria-labelledby="recambio-home">
      <div className="container-site grid gap-14 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <span className="rule mb-6" aria-hidden />
          <h2 id="recambio-home" className="display text-[2.7rem] sm:text-[4.2rem]">
            Tu <span className="normal-case">iPHONE</span>
            <br />
            también es parte de pago.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/65">
            Cotizá tu equipo online y descubrí cuánto te falta para cambiarlo.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/plan-recambio" size="lg" variant="primary">
              Cotizar mi iPhone
            </ButtonLink>
            <p className="text-sm text-white/45">Seis pasos. Menos de dos minutos.</p>
          </div>
        </div>

        <ol className="relative grid grid-cols-3 items-end gap-3 sm:gap-6" aria-label="Cómo funciona el Plan Recambio">
          <div className="absolute left-[16%] right-[16%] top-[42%] h-px bg-gradient-to-r from-white/25 via-blue to-blue" aria-hidden />
          <li className="relative flex flex-col items-center text-center">
            <div className="h-36 sm:h-52">
              <PhoneRender modelId="iphone-13" color="#3A3F48" className="h-full w-auto opacity-80" title="Tu iPhone actual" />
            </div>
            <p className="mt-4 text-xs text-white/45">1</p>
            <p className="text-sm font-semibold sm:text-base">Tu iPhone</p>
          </li>
          <li className="relative flex flex-col items-center text-center">
            <div className="flex h-36 w-full items-center justify-center sm:h-52">
              <div className="rounded-md border border-blue/60 bg-blue/10 px-3 py-4 sm:px-5 sm:py-6">
                <p className="text-[0.7rem] text-white/55 sm:text-xs">Valor estimado</p>
                <p className="mt-1 text-lg font-extrabold tracking-tight sm:text-3xl" style={{ fontStretch: "110%" }}>
                  {exampleValue}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/45">2</p>
            <p className="text-sm font-semibold sm:text-base">Cotización</p>
          </li>
          <li className="relative flex flex-col items-center text-center">
            <div className="h-36 sm:h-52">
              <PhoneRender modelId="iphone-17-pro" color="#E0762F" className="h-full w-auto" title={targetName} />
            </div>
            <p className="mt-4 text-xs text-white/45">3</p>
            <p className="text-sm font-semibold sm:text-base">Nuevo iPhone</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
