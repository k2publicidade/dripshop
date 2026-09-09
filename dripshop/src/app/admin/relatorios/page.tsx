import Link from 'next/link';
import {requireUser} from '@/lib/auth';
import {formatPrice} from '@/lib/utils';

const periods={semana:7,mes:30,trimestre:90,semestre:180,ano:365} as const;
const labels={semana:'Semana',mes:'Mês',trimestre:'Trimestre',semestre:'Semestre',ano:'Ano'};
export default async function Reports({searchParams}:{searchParams:Promise<{periodo?:string}>}){
 const params=await searchParams;
 const period=Object.hasOwn(periods,params.periodo||'')?params.periodo as keyof typeof periods:'mes';
 const days=periods[period];const end=new Date();const start=new Date(end.getTime()-days*86400000);
 const {db}=await requireUser(true);
 const rows:{total:number;created_at:string;payment_status:string}[]=[];
 let failed=false;
 for(let offset=0;;offset+=1000){
  const {data,error}=await db.from('orders').select('total,created_at,payment_status').gte('created_at',start.toISOString()).lte('created_at',end.toISOString()).order('created_at').order('id').range(offset,offset+999);
  if(error){failed=true;break;}rows.push(...(data||[]));if(!data||data.length<1000)break;
 }
 const paid=rows.filter(r=>r.payment_status==='PAID');const total=paid.reduce((sum,r)=>sum+Number(r.total),0);
 const buckets=Array.from({length:Math.min(days,12)},(_,i)=>{const from=new Date(start.getTime()+(end.getTime()-start.getTime())*i/Math.min(days,12));const to=new Date(start.getTime()+(end.getTime()-start.getTime())*(i+1)/Math.min(days,12));return {from,to,total:paid.filter(r=>new Date(r.created_at)>=from&&(i===Math.min(days,12)-1?new Date(r.created_at)<=to:new Date(r.created_at)<to)).reduce((s,r)=>s+Number(r.total),0)};});
 const date=(d:Date)=>d.toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit'});
 return <div><p className="eyebrow">Acompanhe sua evolução</p><h1 className="text-4xl mt-3">Os números da sua loja.</h1><p className="text-sm text-gray-600 mt-4">Últimos {days} dias · {date(start)} a {date(end)}. Períodos móveis, por data de criação do pedido.</p><nav className="report-filters" aria-label="Período do relatório">{Object.keys(periods).map(key=><Link key={key} href={'/admin/relatorios?periodo='+key} aria-current={period===key?'page':undefined}>{labels[key as keyof typeof labels]}</Link>)}</nav>{failed?<p role="alert">Não foi possível carregar os relatórios. Atualize a página para tentar novamente.</p>:<><div className="report-metrics">{[['Valor dos pedidos pagos',formatPrice(total)],['Pedidos no período',String(rows.length)],['Ticket médio pago',formatPrice(paid.length?total/paid.length:0)]].map(([label,value])=><article key={label}><p className="text-sm text-gray-600">{label}</p><strong>{value}</strong></article>)}</div><section className="report-chart"><h2 className="text-xl">Pedidos pagos ao longo do período</h2><p className="text-sm text-gray-600 mt-2">Totais incluem frete. Não representam lucro nem data de recebimento.</p>{!paid.length?<p className="py-10 text-gray-600">Nenhum pedido pago neste período.</p>:<ol>{buckets.map((b,i)=><li key={i}><span>{date(b.from)}–{date(b.to)}</span><meter min={0} max={Math.max(1,...buckets.map(x=>x.total))} value={b.total} aria-label={`${date(b.from)} a ${date(b.to)}: ${formatPrice(b.total)}`}/><span>{formatPrice(b.total)}</span></li>)}</ol>}</section></>}</div>;
}
