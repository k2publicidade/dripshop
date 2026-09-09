import {createClient} from '@/lib/supabase/server';
import {successResponse,handleError} from '@/lib/api-response';
export async function GET(){try{const db=await createClient();const {data,error}=await db.from('featured_categories').select('*');if(error)throw error;return successResponse(data);}catch(e){return handleError(e);}}