import type { Condition } from "@/types";
import { siteConfig } from "@/data/site-config";
import { IconShield } from "@/components/ui/Icon";

export function WarrantyBlock({ condition }: { condition: Condition }) {
  const w = condition === "nuevo" ? siteConfig.warranty.new : siteConfig.warranty.used;
  return (
    <div className="rounded-md border border-line p-5">
      <div className="flex items-center gap-2">
        <IconShield size={20} className="text-blue" />
        <p className="font-bold">Garantía {w.duration}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-mute">{w.text}</p>
      <p className="mt-3 text-sm text-mute">
        <span className="font-semibold text-ink">No cubre:</span> {siteConfig.warranty.notCovered.join(", ").toLowerCase()}.
      </p>
    </div>
  );
}
