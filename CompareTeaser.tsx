import Link from "next/link";
import type { IphoneSpecs } from "@/types";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneRender } from "@/components/product/PhoneRender";
import { formatUSD } from "@/utils/format";

export function CompareTeaser({ models }: { models: { specs: IphoneSpecs; color: string; fromPrice: number | null }[] }) {
  const maxInches = Math.max(...models.map((m) => m.specs.metrics.screenInches));
  return (
    <section className="section" aria-labelledby="comparador-home">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <span className="rule mb-5" aria-hidden />
          <h2 id="comparador-home" className="display text-[2.6rem] sm:text-[4rem]">
            ¿Cuál <span className="normal-case">iPHONE</span>
            <br />
            es para vos?
          </h2>
          <p className="lead mt-5 max-w-md">
            Hasta tres modelos lado a lado: pantalla, cámaras, batería y precio real en Phone Haus.
          </p>
          <ButtonLink href="/comparador" size="lg" variant="dark" className="mt-8">
            Comparar iPhones
          </ButtonLink>
        </div>

        <div className="grid grid-cols-3 items-end gap-2 border-b [--ph:10rem] sm:[--ph:15rem] border-line pb-6 sm:gap-6">
          {models.map(({ specs, color, fromPrice }) => (
            <Link key={specs.modelId} href={`/comparador?m=${specs.modelId}`} className="group flex flex-col items-center text-center">
              <div
                className="flex items-end transition-transform duration-500 group-hover:-translate-y-1.5"
                style={{ height: `calc(var(--ph) * ${(specs.metrics.screenInches / maxInches).toFixed(3)})` }}
              >
                <PhoneRender modelId={specs.modelId} color={color} className="h-full w-auto drop-shadow-[0_20px_24px_rgba(0,0,0,.14)]" title={specs.name} />
              </div>
              <p className="mt-5 text-sm font-bold sm:text-base">{specs.name}</p>
              <p className="text-xs text-mute sm:text-sm">
                {String(specs.metrics.screenInches).replace(".", ",")}" · {specs.chip}
              </p>
              {fromPrice && <p className="mt-1 text-xs font-semibold text-blue sm:text-sm">desde {formatUSD(fromPrice)}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
