import { siteConfig } from "@/data/site-config";
import { IconBadgeCheck, IconCheck } from "@/components/ui/Icon";

export function CheckedSection() {
  return (
    <section className="rounded-md bg-ink p-6 text-white sm:p-10" aria-labelledby="checked">
      <div className="flex items-center gap-3 text-blue">
        <IconBadgeCheck size={26} />
        <h2 id="checked" className="display-sm text-[1.5rem] text-white sm:text-[1.9rem]">
          Phone Haus Checked
        </h2>
      </div>
      <p className="mt-4 max-w-lg text-white/70">
        Cada equipo seminuevo es revisado y verificado antes de ponerse a la venta.
      </p>
      <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {siteConfig.checkedPoints.map((p) => (
          <li key={p} className="flex items-center gap-2 border-t border-white/15 pt-3 text-sm font-medium">
            <IconCheck size={16} className="text-blue" />
            {p}
          </li>
        ))}
      </ul>
    </section>
  );
}
