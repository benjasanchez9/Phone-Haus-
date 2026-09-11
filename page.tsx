import type { Metadata } from "next";
import { getFeaturedProducts, getProducts, getSpecs, offerForModel } from "@/lib/catalog";
import { calculateTradeIn } from "@/lib/trade-in-engine";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TradeInTeaser } from "@/components/home/TradeInTeaser";
import { CompareTeaser } from "@/components/home/CompareTeaser";
import { WhyPhoneHaus } from "@/components/home/WhyPhoneHaus";
import { PaymentsShipping } from "@/components/home/PaymentsShipping";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCta } from "@/components/home/FinalCta";
import { formatUSD } from "@/utils/format";
import type { ModelId } from "@/types";

export const metadata: Metadata = {
  title: { absolute: "Phone Haus | iPhones nuevos y seminuevos en Uruguay" },
  alternates: { canonical: "/" },
};

const COMPARE_TEASER: ModelId[] = ["iphone-17", "iphone-17-pro", "iphone-17-pro-max"];

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedProducts(4), getProducts()]);
  const spotlight = all.find((p) => p.modelId === "iphone-17-pro") ?? all[0];
  const secondary = all.find((p) => p.modelId === "iphone-17-pro-max");

  // Ejemplo real calculado con el motor: iPhone 13 128 GB en excelente estado.
  const example = calculateTradeIn({
    modelId: "iphone-13",
    storageGB: 128,
    repairedParts: false,
    batteryHealth: 90,
    screen: "excelente",
    sides: "excelente",
    back: "excelente",
    functional: { powersOn: true, faceId: true, cameras: true, buttons: true, charging: true, audio: true, icloudFree: true, imeiClean: true },
  });

  const compareModels = COMPARE_TEASER.map((id) => {
    const specs = getSpecs(id)!;
    const offer = offerForModel(id, all);
    return { specs, color: offer?.cheapest.color.hex ?? "#CFCFCB", fromPrice: offer?.fromPrice ?? null };
  });

  return (
    <>
      <Hero spotlight={spotlight} secondary={secondary} />
      <FeaturedProducts products={featured} />
      <TradeInTeaser exampleValue={example.status === "quoted" ? formatUSD(example.estimatedUSD) : "USD —"} targetName="iPhone 17 Pro" />
      <CompareTeaser models={compareModels} />
      <WhyPhoneHaus />
      <PaymentsShipping />
      <Testimonials />
      <FinalCta />
    </>
  );
}
