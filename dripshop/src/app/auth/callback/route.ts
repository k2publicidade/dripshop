import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
export async function GET(request:NextRequest){const code=request.nextUrl.searchParams.get('code');const db=await createClient();if(code){const {error}=await db.auth.exchangeCodeForSession(code);if(!error){const target=request.nextUrl.searchParams.get('next');return NextResponse.redirect(new URL(target==='/redefinir-senha'?target:'/conta',request.url));}}return NextResponse.redirect(new URL('/login?error=confirmation',request.url));}
