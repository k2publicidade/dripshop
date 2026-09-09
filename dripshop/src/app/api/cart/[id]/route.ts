import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth';
import { successResponse,handleError } from '@/lib/api-response';
import {z} from 'zod';
export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){try{const {db,user}=await requireUser();const {id}=await params;const b=z.object({quantity:z.number().int().min(1).max(99)}).parse(await request.json());const {data,error}=await db.from('cart_items').update(b).eq('id',id).eq('user_id',user.id).select().single();if(error)throw error;return successResponse(data);}catch(e){return handleError(e);}}
export async function DELETE(_request:NextRequest,{params}:{params:Promise<{id:string}>}){try{const {db,user}=await requireUser();const {id}=await params;const {error}=await db.from('cart_items').delete().eq('id',id).eq('user_id',user.id);if(error)throw error;return successResponse({deleted:true});}catch(e){return handleError(e);}}
