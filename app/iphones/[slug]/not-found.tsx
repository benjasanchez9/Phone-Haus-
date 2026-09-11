import { ButtonLink } from "@/components/ui/Button";

export default function ProductNotFound() {
  return (
    <div className="container-site py-24 sm:py-32">
      <span className="rule mb-5" aria-hidden />
      <h1 className="display text-[2.6rem] sm:text-[4rem]">Este equipo ya no está publicado</h1>
      <p className="lead mt-5 max-w-md">Puede que se haya vendido o que el link esté incompleto. Mirá los equipos disponibles hoy.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/iphones" variant="dark" size="lg">
          Ver iPhones disponibles
        </ButtonLink>
        <ButtonLink href="/contacto" variant="outline" size="lg">
          Consultar por un modelo
        </ButtonLink>
      </div>
    </div>
  );
}
