import {NextRequest} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {successResponse,handleError} from '@/lib/api-response';
import {z} from 'zod';
export async function POST(request:NextRequest){try{const b=z.object({name:z.string().trim().min(2).max(100),email:z.string().email().max(254),subject:z.string().trim().min(2).max(150),message:z.string().trim().min(10).max(5000)}).parse(await request.json());const db=await createClient();const {error}=await db.rpc('submit_contact',{p_name:b.name,p_email:b.email,p_subject:b.subject,p_message:b.message});if(error)throw new Error('Não foi possível enviar. Aguarde alguns minutos e tente novamente.');return successResponse({received:true});}catch(e){return handleError(e);}}
