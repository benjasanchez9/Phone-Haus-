"use client";

import { useId, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { IconCheck, IconWhatsApp } from "@/components/ui/Icon";

const TOPICS = ["Comprar un iPhone", "Plan Recambio", "Garantía", "Envíos", "Otro"];

/**
 * Formulario de contacto. Sin backend por ahora: arma el mensaje y lo
 * abre en WhatsApp. Para enviarlo a un email/CRM, reemplazar `submit`
 * por un POST a una Route Handler (app/api/contact/route.ts).
 */
export function ContactForm() {
  const id = useId();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Escribí tu nombre.";
    if (message.trim().length < 5) next.message = "Contanos brevemente tu consulta.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const text = ["Hola Phone Haus 👋", "", `Soy ${name.trim()}.`, `Consulta: ${topic}`, "", message.trim()].join("\n");
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="animate-settle rounded-md border border-line bg-surface p-8" role="status">
        <IconCheck size={28} className="text-blue" />
        <p className="display-sm mt-4 text-2xl">Abrimos WhatsApp con tu mensaje.</p>
        <p className="mt-2 text-mute">Si no se abrió, revisá que tu navegador permita ventanas emergentes.</p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
          Escribir otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-md border border-line bg-surface p-6 sm:p-8">
      <div>
        <label htmlFor={`${id}-name`} className="mb-2 block text-sm font-semibold">
          Nombre
        </label>
        <input
          id={`${id}-name`}
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="given-name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${id}-name-e` : undefined}
        />
        {errors.name && (
          <p id={`${id}-name-e`} className="mt-1.5 text-sm text-danger">
            {errors.name}
          </p>
        )}
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Motivo</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <label
              key={t}
              className="cursor-pointer rounded border border-line px-3.5 py-2 text-sm font-medium transition-colors has-[:checked]:border-blue has-[:checked]:bg-blue-soft has-[:checked]:text-blue has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue"
            >
              <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={`${id}-msg`} className="mb-2 block text-sm font-semibold">
          Mensaje
        </label>
        <textarea
          id={`${id}-msg`}
          rows={5}
          className="field resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ej: busco un iPhone 16 de 256 GB, ¿tienen disponible?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${id}-msg-e` : undefined}
        />
        {errors.message && (
          <p id={`${id}-msg-e`} className="mt-1.5 text-sm text-danger">
            {errors.message}
          </p>
        )}
      </div>
      <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
        <IconWhatsApp size={18} />
        Enviar por WhatsApp
      </Button>
    </form>
  );
}
