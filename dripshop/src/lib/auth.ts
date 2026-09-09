import { createClient } from '@/lib/supabase/server';
import { UnauthorizedError, AppError } from '@/lib/errors';

export async function requireUser(admin = false) {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new UnauthorizedError('Entre na sua conta para continuar.');
  const { data: profile, error } = await db.from('profiles').select('*').eq('id', user.id).single();
  if (error || !profile) throw new UnauthorizedError('Não foi possível carregar sua conta.');
  if (admin && profile.role !== 'ADMIN') throw new AppError('Acesso restrito à administração.', 403, 'FORBIDDEN');
  return { db, user: profile };
}
