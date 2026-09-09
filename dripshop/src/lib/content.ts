import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { sectionSchema, type ContentSection, type Artist } from './content-schema';
export const getContent=cache(async():Promise<ContentSection[]>=>{const db=await createClient();const {data,error}=await db.from('site_sections').select('*').eq('is_active',true).order('position');if(error){console.error('Content unavailable:',error.code);return [];}return (data||[]).flatMap(row=>{const parsed=sectionSchema.safeParse(row);return parsed.success?[parsed.data]:[];});});
export const getArtists=cache(async():Promise<Artist[]>=>{const db=await createClient();const {data,error}=await db.from('creators').select('id,name,slug,bio,image,verified').order('name');if(error)throw new Error('Não foi possível carregar os artistas.');return data||[];});
