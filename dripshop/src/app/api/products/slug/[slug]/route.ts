import { NextRequest } from 'next/server';
import { getCatalog } from '@/lib/catalog';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
export async function GET(_request:NextRequest,{params}:{params:Promise<{slug:string}>}){try{const {slug}=await params;const product=(await getCatalog()).find(p=>p.slug===slug);return product?successResponse(product):errorResponse('Produto não encontrado',404);}catch(e){return handleError(e);}}
