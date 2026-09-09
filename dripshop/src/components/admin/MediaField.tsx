'use client';
import ImageUpload from './ImageUpload';

export default function MediaField({label,value,onChange,disabled=false}:{label:string;value:string;onChange:(value:string)=>void;disabled?:boolean}) {
 return <fieldset className="border p-4 space-y-3"><legend className="px-2 font-medium text-sm">{label}</legend>{value&&<><img src={value} alt={label} className="h-32 w-full object-contain bg-gray-100"/><button type="button" disabled={disabled} className="text-sm underline" onClick={()=>onChange('')}>Remover imagem</button></>}<ImageUpload disabled={disabled} onUploaded={onChange}/></fieldset>;
}
