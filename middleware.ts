import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protege /admin: refresca la sesión de Supabase y manda al login
 * a quien no esté autenticado. El sitio público no pasa por acá.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v as string));
      },
    },
  });

  // No poner código entre createServerClient y getClaims().
  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);
  const isLogin = request.nextUrl.pathname.startsWith("/admin/login");

  if (!loggedIn && !isLogin) {
    const to = request.nextUrl.clone();
    to.pathname = "/admin/login";
    return NextResponse.redirect(to);
  }
  if (loggedIn && isLogin) {
    const to = request.nextUrl.clone();
    to.pathname = "/admin";
    return NextResponse.redirect(to);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
