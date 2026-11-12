import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-2xl font-bold tracking-tight">Panel Phone Haus</h1>
      <p className="mt-1 text-sm text-mute">Ingresá para administrar los artículos.</p>
      <LoginForm />
    </div>
  );
}
