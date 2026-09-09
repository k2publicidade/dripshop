'use client';
import {useState} from 'react';
import {createClient} from '@/lib/supabase/client';

export default function VideoUpload({value,onChange}:{value:string;onChange:(url:string)=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function upload(file?:File){
  if(!file)return;
  setError('');
  if(file.type!=='video/mp4'||file.size>50*1024*1024){setError('Selecione um vídeo MP4 de até 50 MB.');return;}
  setBusy(true);
  try{const db=createClient();const path=crypto.randomUUID()+'.mp4';const {error}=await db.storage.from('site-videos').upload(path,file,{contentType:'video/mp4',upsert:false});if(error)throw Error('Não foi possível enviar. Verifique a configuração do armazenamento de vídeos.');onChange(db.storage.from('site-videos').getPublicUrl(path).data.publicUrl);}catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 return <fieldset className="border p-4 space-y-3"><legend>Vídeo da seção</legend>{value&&<><video controls preload="metadata" src={value} className="max-h-52 w-full"/><button type="button" onClick={()=>onChange('')} disabled={busy}>Remover vídeo</button></>}<label className="block">{busy?'Enviando vídeo…':'Enviar vídeo MP4 (até 50 MB)'}<input type="file" accept="video/mp4" disabled={busy} onChange={e=>{void upload(e.target.files?.[0]);e.target.value='';}}/></label>{error&&<p role="alert">{error}</p>}</fieldset>;
}
