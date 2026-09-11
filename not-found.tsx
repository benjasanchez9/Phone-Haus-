import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-site py-24 sm:py-36">
      <p className="text-sm font-semibold text-blue">Error 404</p>
      <h1 className="display mt-4 text-[2.8rem] sm:text-[4.6rem]">Esta página no existe</h1>
      <p className="lead mt-5 max-w-md">El link puede estar incompleto o la página se movió. Estos atajos te llevan a lo importante.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" variant="dark" size="lg">
          Ir al inicio
        </ButtonLink>
        <ButtonLink href="/iphones" variant="outline" size="lg">
          Ver iPhones
        </ButtonLink>
        <ButtonLink href="/plan-recambio" variant="outline" size="lg">
          Cotizar mi iPhone
        </ButtonLink>
      </div>
    </div>
  );
}
