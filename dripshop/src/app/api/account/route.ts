import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth';
import { successResponse, handleError } from '@/lib/api-response';
import { z } from 'zod';
export async function GET(){try{const {user}=await requireUser();return successResponse(user);}catch(e){return handleError(e);}}
export async function PATCH(request:NextRequest){try{const {db,user}=await requireUser();const input=z.object({name:z.string().trim().min(2).max(100),phone:z.string().max(25).optional(),cpf:z.string().max(14).optional()}).parse(await request.json());const {data,error}=await db.from('profiles').update({...input,cpf:input.cpf||null}).eq('id',user.id).select('id,name,email,phone,cpf,role').single();if(error)throw new Error('Não foi possível salvar os dados. Confira o CPF informado.');return successResponse(data);}catch(e){return handleError(e);}}
