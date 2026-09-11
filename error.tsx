"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-site py-24 sm:py-36">
      <p className="text-sm font-semibold text-danger">Algo falló</p>
      <h1 className="display mt-4 text-[2.6rem] sm:text-[4rem]">No pudimos cargar esta página</h1>
      <p className="lead mt-5 max-w-md">Probá de nuevo. Si el problema sigue, escribinos por WhatsApp y te ayudamos.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="dark" size="lg" onClick={reset}>
          Reintentar
        </Button>
        <ButtonLink href="/contacto" variant="outline" size="lg">
          Contactar
        </ButtonLink>
      </div>
    </div>
  );
}
