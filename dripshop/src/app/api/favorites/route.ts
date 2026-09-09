import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth';
import { successResponse, handleError } from '@/lib/api-response';
import { z } from 'zod';
export async function GET(){try{const {db,user}=await requireUser();const {data,error}=await db.from('favorites').select('product_id').eq('user_id',user.id);if(error)throw error;return successResponse(data?.map(f=>f.product_id));}catch(e){return handleError(e);}}
export async function POST(request:NextRequest){try{const {db,user}=await requireUser();const {productId}=z.object({productId:z.string().uuid()}).parse(await request.json());const {error}=await db.from('favorites').upsert({user_id:user.id,product_id:productId},{onConflict:'user_id,product_id'});if(error)throw error;return successResponse({saved:true});}catch(e){return handleError(e);}}
export async function DELETE(request:NextRequest){try{const {db,user}=await requireUser();const {productId}=z.object({productId:z.string().uuid()}).parse(await request.json());const {error}=await db.from('favorites').delete().eq('user_id',user.id).eq('product_id',productId);if(error)throw error;return successResponse({deleted:true});}catch(e){return handleError(e);}}
