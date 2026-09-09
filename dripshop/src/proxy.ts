import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const db = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await db.auth.getUser();
  const withSessionCookies = (target: NextResponse) => {
    response.cookies.getAll().forEach(cookie => target.cookies.set(cookie));
    return target;
  };
  const path = request.nextUrl.pathname;
  const privateApi = /^\/api\/(orders|cart)(\/|$)/.test(path);
  const catalogWrite = /^\/api\/(products|categories|collections|featured-categories)(\/|$)/.test(path) && !['GET','HEAD'].includes(request.method);
  if (privateApi || catalogWrite) {
    if (!user) return withSessionCookies(NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 }));
    if (catalogWrite) {
      const { data } = await db.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role !== 'ADMIN') return withSessionCookies(NextResponse.json({ error: 'Acesso restrito' }, { status: 403 }));
    }
  }
  if (path.startsWith('/admin') || path.startsWith('/conta')) {
    if (!user) {
      const url = new URL('/login', request.url);
      url.searchParams.set('next', path);
      return withSessionCookies(NextResponse.redirect(url));
    }
    if (path.startsWith('/admin') || path === '/conta') {
      const { data } = await db.from('profiles').select('role').eq('id', user.id).single();
      if (path === '/conta' && data?.role === 'ADMIN') return withSessionCookies(NextResponse.redirect(new URL('/admin', request.url)));
      if (path.startsWith('/admin') && data?.role !== 'ADMIN') return withSessionCookies(NextResponse.redirect(new URL('/conta', request.url)));
    }
  }
  return response;
}

export const config = { matcher: ['/admin/:path*', '/conta/:path*', '/api/:path*'] };
