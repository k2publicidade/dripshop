import { sectionSchema } from '@/lib/content-schema';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth';
import { successResponse, errorResponse, handleError } from '@/lib/api-response';
import { z } from 'zod';
const slug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,'Use letras minúsculas, números e hífens');
const image=z.string().url().refine(v=>v.startsWith('https://'),'Use uma imagem HTTPS');
const base=z.object({name:z.string().trim().min(2).max(200),slug,description:z.string().max(5000).optional(),image:image.or(z.literal('')).optional()});
const schemas={site_sections:sectionSchema,categories:base.extend({parent_id:z.string().uuid().nullable().optional()}),collections:base.extend({is_active:z.boolean()}),creators:base.omit({description:true}).extend({bio:z.string().max(5000).optional(),verified:z.boolean().optional()}),featured_categories:z.object({title:z.string().min(2),image_url:image,link_url:z.string().regex(/^\/(?!\/)/),button_text:z.string().min(1),position:z.number().int().min(0),is_active:z.boolean()}),store_settings:z.object({name:z.string().min(2),support_email:z.string().email().or(z.literal('')),free_shipping_threshold:z.number().min(0),standard_shipping:z.number().min(0),express_shipping:z.number().min(0)})};
const tables=['site_sections','products','categories','collections','creators','featured_categories','store_settings','orders','profiles','contact_messages','newsletter_subscribers'];
export async function GET(_request:NextRequest,{params}:{params:Promise<{resource:string}>}){try{const {db}=await requireUser(true);const {resource}=await params;if(!tables.includes(resource))return errorResponse('Não encontrado',404);const select=resource==='products'?'*,product_variants(*),product_colors(*)':resource==='orders'?'*,order_items(*),order_status_history(*)':'*';const {data,error}=await db.from(resource).select(select).limit(1000);if(error)throw error;return successResponse(data);}catch(e){return handleError(e);}}
export async function POST(request:NextRequest,{params}:{params:Promise<{resource:string}>}){try{const {db}=await requireUser(true);const {resource}=await params;const body=await request.json();if(resource==='products'){
 const input=z.object({id:z.string().uuid().optional(),name:z.string().min(2).max(200),slug,description:z.string().min(10).max(10000),price:z.number().positive().max(999999),original_price:z.number().positive().nullable(),images:z.array(image).min(1).max(10),category_id:z.string().uuid(),collection_id:z.string().uuid().nullable(),is_active:z.boolean(),is_new:z.boolean(),is_featured:z.boolean(),variants:z.array(z.object({size:z.string().min(1).max(20),color:z.string().min(1).max(40),hex:z.string().regex(/^#[0-9a-fA-F]{6}$/),stock:z.number().int().min(0).max(100000),sku:z.string().max(80).optional()})).min(1).max(200)}).parse(body);
 const {id,variants,...data}=input;const {data:productId,error}=await db.rpc('admin_save_product',{p_id:id||null,p_data:data,p_variants:variants});if(error)throw new Error('Não foi possível salvar. Verifique slug, SKU e variações duplicadas.');return successResponse({id:productId});
 }
 if(!(resource in schemas))return errorResponse('Operação indisponível',405);
 const schema=schemas[resource as keyof typeof schemas];const input: Record<string,unknown>=schema.parse(body);const id=body.id?z.string().parse(body.id):undefined;
 const query=id?db.from(resource).update(input).eq('id',id):db.from(resource).insert(input);
 const {data,error}=await query.select().single();if(error)throw new Error('Não foi possível salvar. Verifique os dados e o identificador único.');revalidatePath('/', 'layout');return successResponse(data);
 }catch(e){return handleError(e);}}
export async function PATCH(request:NextRequest,{params}:{params:Promise<{resource:string}>}){try{const {db}=await requireUser(true);const {resource}=await params;const body=await request.json();const id=z.string().uuid().parse(body.id);
 if(resource==='products'||resource==='collections'){const is_active=z.boolean().parse(body.is_active);const {error}=await db.from(resource).update({is_active}).eq('id',id);if(error)throw error;return successResponse({updated:true});}
 if(resource==='contact_messages'){const status=z.enum(['NEW','READ','RESOLVED']).parse(body.status);const {error}=await db.from(resource).update({status}).eq('id',id);if(error)throw error;return successResponse({updated:true});}
 if(resource==='orders'){
  if(body.status){const input=z.object({status:z.enum(['CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED']),tracking_code:z.string().max(100).optional(),note:z.string().max(1000).optional()}).parse(body);const {error}=await db.rpc('admin_transition_order',{p_id:id,p_status:input.status,p_tracking:input.tracking_code||null,p_note:input.note||''});if(error)return errorResponse(error.message,400);}
  else{const tracking_code=z.string().max(100).parse(body.tracking_code||'');const {error}=await db.from('orders').update({tracking_code}).eq('id',id);if(error)throw error;}
  return successResponse({updated:true});
 }
 return errorResponse('Operação indisponível',405);
 }catch(e){return handleError(e);}}

