import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth';
import { successResponse, handleError } from '@/lib/api-response';
import { z } from 'zod';
export async function GET(){try{const {db,user}=await requireUser();const {data,error}=await db.from('orders').select('*,order_items(*)').eq('user_id',user.id).order('created_at',{ascending:false});if(error)throw error;return successResponse(data);}catch(e){return handleError(e);}}
export async function POST(request:NextRequest){try{const {db}=await requireUser();const input=z.object({items:z.array(z.object({productId:z.string().uuid(),quantity:z.number().int().min(1).max(99),selectedSize:z.string().min(1),selectedColor:z.string().min(1)})).min(1).max(50),addressId:z.string().uuid(),shipping:z.enum(['standard','express']),key:z.string().uuid()}).parse(await request.json());const {data,error}=await db.rpc('create_checkout_order',{p_items:input.items,p_address_id:input.addressId,p_shipping:input.shipping,p_key:input.key});if(error)throw new Error(error.message);return successResponse({id:data},201);}catch(e){return handleError(e);}}
