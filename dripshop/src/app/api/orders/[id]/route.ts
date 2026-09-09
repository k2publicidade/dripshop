import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth';
import { successResponse, handleError } from '@/lib/api-response';
export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){try{const {db,user}=await requireUser();const {id}=await params;const {data,error}=await db.from('orders').select('*,order_items(*)').eq('id',id).eq('user_id',user.id).single();if(error)throw new Error('Pedido não encontrado');return successResponse(data);}catch(e){return handleError(e);}}
