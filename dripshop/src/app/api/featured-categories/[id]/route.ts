import {createClient} from '@/lib/supabase/server';
import {successResponse,errorResponse,handleError} from '@/lib/api-response';
import {NextRequest} from 'next/server';
export async function GET(_r:NextRequest,{params}:{params:Promise<{id:string}>}){try{const db=await createClient();const {id}=await params;const {data,error}=await db.from('featured_categories').select('*').eq('id',id).single();if(error)return errorResponse('Não encontrado',404);return successResponse(data);}catch(e){return handleError(e);}}