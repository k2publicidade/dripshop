import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createUserSchema, loginSchema } from '@/lib/validations';
import { handleError } from '@/lib/api-response';

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  try {
    const { action } = await context.params;
    const db = await createClient();
    if (action === 'logout') {
      const { error } = await db.auth.signOut();
      return NextResponse.json({ success: !error }, { status: error ? 500 : 200 });
    }
    const body = await request.json();
    if (action !== 'login' && action !== 'register') return NextResponse.json({ error: 'Rota não encontrada' }, { status: 404 });
    const input = action === 'login' ? loginSchema.parse(body) : createUserSchema.parse(body);
    const { data, error } = action === 'login'
      ? await db.auth.signInWithPassword(input)
      : await db.auth.signUp({ email: input.email, password: input.password, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/auth/callback`, data: { name: 'name' in input ? input.name : '' } } });
    if (error) return NextResponse.json({ error: action === 'login' ? 'Email ou senha inválidos, ou email ainda não confirmado.' : 'Não foi possível criar sua conta. Verifique os dados e tente novamente.' }, { status: 400 });
    const { data: profile } = data.session ? await db.from('profiles').select('id,email,name,phone,cpf,role').eq('id', data.user!.id).single() : { data: null };
    return NextResponse.json({ user: profile, confirmationRequired: !data.session });
  } catch (error) { return handleError(error); }
}

export async function GET() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ user: null });
  const { data } = await db.from('profiles').select('id,email,name,phone,cpf,role').eq('id', user.id).single();
  return NextResponse.json({ user: data });
}
