import {NextRequest} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {successResponse,handleError} from '@/lib/api-response';
import {z} from 'zod';
export async function POST(request:NextRequest){try{const {email}=z.object({email:z.string().email().max(254),consent:z.literal(true)}).parse(await request.json());const db=await createClient();const {error}=await db.rpc('subscribe_newsletter',{p_email:email});if(error)throw new Error('Não foi possível cadastrar seu email.');return successResponse({subscribed:true});}catch(e){return handleError(e);}}
