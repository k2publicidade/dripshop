'use client';
import type {Appearance} from '@/lib/appearance';

export default function AppearanceFields({value,onChange}:{value:Appearance;onChange:(value:Appearance)=>void}){
 const fields=[['background','Fundo'],['text','Textos'],['button','Fundo dos botões'],['buttonText','Texto dos botões']] as const;
 return <fieldset className="border p-5 space-y-5"><legend className="px-2 text-lg">Aparência da seção</legend><p className="text-sm text-gray-500">Escolha cores ou use o padrão do layout.</p><div className="grid sm:grid-cols-2 gap-4">{fields.map(([key,label])=><div key={key}><label className="flex items-center justify-between gap-3 text-sm">{label}<input aria-label={label} type="color" value={value[key]||'#ffffff'} onChange={e=>onChange({...value,[key]:e.target.value})}/></label><button type="button" className="text-xs underline" onClick={()=>onChange({...value,[key]:''})}>{value[key]?'Restaurar padrão':'Usando padrão'}</button></div>)}</div><div className="p-6 border rounded" style={{background:value.background||'#f5f4f1',color:value.text||'#080808'}}><p className="text-xl mb-2">Prévia das cores</p><p className="text-sm mb-4">Confira a leitura do texto e do botão.</p><span className="inline-block px-4 py-2" style={{background:value.button||'#080808',color:value.buttonText||'#ffffff'}}>Explorar coleção</span></div></fieldset>;
}
