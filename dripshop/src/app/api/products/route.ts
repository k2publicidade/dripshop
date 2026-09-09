import { NextRequest } from 'next/server';
import { getCatalog } from '@/lib/catalog';
import { successResponse, handleError } from '@/lib/api-response';
export async function GET(request:NextRequest){try{const q=(request.nextUrl.searchParams.get('q')||'').toLocaleLowerCase('pt-BR');const products=(await getCatalog()).filter(p=>!q||[p.name,p.description,p.category,p.collection].join(' ').toLocaleLowerCase('pt-BR').includes(q));return successResponse({products,total:products.length});}catch(e){return handleError(e);}}
