'use client';
import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function ImageUpload({ onUploaded, disabled }: { onUploaded: (url: string) => void; disabled?: boolean }) {
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState('');
 async function upload(file?: File) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { setError('A imagem deve ter no máximo 5 MB.'); return; }
  setBusy(true); setError('');
  try {
   const form = new FormData(); form.set('file', file);
   const response = await fetch('/api/admin/upload', { method: 'POST', body: form });
   const result = await response.json();
   if (!response.ok) throw new Error(result.error?.message || 'Não foi possível enviar a imagem.');
   onUploaded(result.data.url);
  } catch (error) { setError((error as Error).message); } finally { setBusy(false); }
 }
 return <div><label className="inline-flex items-center gap-2 border px-4 py-3 text-sm cursor-pointer focus-within:outline-2"><Upload size={16}/>{busy ? 'Enviando imagem...' : 'Enviar imagem do computador'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || disabled} className="sr-only" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }}/></label><p className="text-xs text-gray-500 mt-2">JPG, PNG ou WebP, até 5 MB.</p>{error && <p role="alert" className="text-sm mt-2">{error}</p>}</div>;
}
