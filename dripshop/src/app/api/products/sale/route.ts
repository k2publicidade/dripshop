import {getCatalog} from '@/lib/catalog';
import {successResponse,handleError} from '@/lib/api-response';
export async function GET(){try{return successResponse((await getCatalog()).filter(p=>p.discount && p.discount > 0));}catch(e){return handleError(e);}}