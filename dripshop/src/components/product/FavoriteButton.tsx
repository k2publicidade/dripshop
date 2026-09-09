'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
export default function FavoriteButton({productId,compact=false}:{productId:string;compact?:boolean}) {
 const router=useRouter();const {user}=useAuthStore();const [saved,setSaved]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{if(user)fetch('/api/favorites').then(r=>r.json()).then(b=>setSaved(b.data?.includes(productId)||false)).catch(()=>{});},[user,productId]);
 async function toggle(){if(!user){router.push('/login?next='+encodeURIComponent(window.location.pathname));return;}setBusy(true);setError('');try{const r=await fetch('/api/favorites',{method:saved?'DELETE':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId})});if(!r.ok)throw new Error();setSaved(!saved);}catch{setError('Não foi possível salvar. Tente novamente.');}finally{setBusy(false);}}
 return <div><button type="button" disabled={busy} onClick={toggle} aria-label={saved?"Remover dos favoritos":"Salvar nos favoritos"} aria-pressed={saved} className="flex items-center gap-2 text-sm py-3"><Heart size={19} fill={saved?'currentColor':'none'}/>{!compact&&(saved?'Salvo nos favoritos':'Salvar nos favoritos')}</button>{error&&<p role="alert" className="text-sm text-gray-700">{error}</p>}</div>;
}
