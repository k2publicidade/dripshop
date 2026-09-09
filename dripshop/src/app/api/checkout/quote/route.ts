import {NextRequest} from 'next/server';
import {z} from 'zod';
import {requireUser} from '@/lib/auth';
import {successResponse,handleError} from '@/lib/api-response';
import {ValidationError} from '@/lib/errors';
const schema=z.object({addressId:z.string().uuid(),shipping:z.enum(['standard','express']),items:z.array(z.object({productId:z.string().uuid(),selectedSize:z.string().min(1),selectedColor:z.string().min(1),quantity:z.number().int().min(1).max(99)})).min(1).max(50)});
export async function POST(request:NextRequest){try{
 const {db,user}=await requireUser();const input=schema.parse(await request.json());
 const {data:address,error:addressError}=await db.from('addresses').select('id').eq('id',input.addressId).eq('user_id',user.id).single();if(addressError||!address)throw new ValidationError('Escolha um endereço válido.');
 const {data:products,error}=await db.from('products').select('id,name,price,stock,is_active,product_variants(size,color,stock)').in('id',[...new Set(input.items.map(i=>i.productId))]);if(error)throw error;
 let cents=0;const quantities=new Map<string,number>();const totals=new Map<string,number>();
 for(const item of input.items){const product=products?.find(p=>p.id===item.productId);const variant=product?.product_variants.find(v=>v.size===item.selectedSize&&v.color===item.selectedColor);const key=JSON.stringify([item.productId,item.selectedSize,item.selectedColor]);const qty=(quantities.get(key)||0)+item.quantity;quantities.set(key,qty);const total=(totals.get(item.productId)||0)+item.quantity;totals.set(item.productId,total);if(!product?.is_active||!variant||variant.stock<qty||product.stock<total)throw new ValidationError('Uma das peças não tem estoque suficiente. Revise sua sacola.');cents+=Math.round(Number(product.price)*100)*item.quantity;}
 const {data:settings,error:settingsError}=await db.from('store_settings').select('*').eq('id','store').single();if(settingsError||!settings)throw new Error('Configuração de entrega indisponível');
 const shipping=input.shipping==='express'?Math.round(Number(settings.express_shipping)*100):cents>=Math.round(Number(settings.free_shipping_threshold)*100)?0:Math.round(Number(settings.standard_shipping)*100);
 return successResponse({subtotal:cents/100,shipping:shipping/100,total:(cents+shipping)/100,paymentAvailable:false});
 }catch(e){return handleError(e);}}
