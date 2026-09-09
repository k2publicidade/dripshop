import { formatPrice } from '@/lib/utils';

type Item = { id: string; product_name: string; quantity: number; selected_size: string; selected_color: string; price: number };
type Event = { id: string; status: string; note: string; created_at: string };
export const orderLabels: Record<string, string> = { PENDING: 'Aguardando pagamento', CONFIRMED: 'Confirmado', PROCESSING: 'Em preparação', SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELLED: 'Cancelado' };
const paymentLabels: Record<string, string> = { PENDING: 'Pagamento pendente', PAID: 'Pagamento confirmado', FAILED: 'Pagamento não aprovado', REFUNDED: 'Reembolsado' };

export default function OrderDetails({ row }: { row: Record<string, unknown> }) {
 const items = (row.order_items || []) as Item[];
 const address = row.shipping_address as Record<string, string> | null;
 const history = [...((row.order_status_history || []) as Event[])].sort((a, b) => a.created_at.localeCompare(b.created_at));
 return <>
  <p className="mt-2 text-sm">{formatPrice(Number(row.total))} · {paymentLabels[String(row.payment_status)] || String(row.payment_status)}</p>
  <details className="mt-4 text-sm">
   <summary className="cursor-pointer font-medium py-2">Itens, entrega e histórico</summary>
   <ul className="divide-y my-3">{items.map(item => <li key={item.id} className="py-3 flex justify-between gap-4"><div><p>{item.quantity} × {item.product_name}</p><p className="text-gray-500 text-xs mt-1">{item.selected_size} · {item.selected_color}</p></div><span className="whitespace-nowrap">{formatPrice(Number(item.price) * item.quantity)}</span></li>)}</ul>
   <dl className="space-y-2 py-3 border-t">{[['Produtos', row.subtotal], ['Entrega', row.shipping_cost], ['Desconto', row.discount], ['Total', row.total]].map(([label, value]) => <div className="flex justify-between" key={String(label)}><dt>{String(label)}</dt><dd>{formatPrice(Number(value))}</dd></div>)}</dl>
   <div className="py-4 border-t"><h3 className="font-medium mb-2">Endereço de entrega</h3>{address ? <address className="not-italic text-gray-600 leading-6">{address.street}, {address.number}{address.complement && ` · ${address.complement}`}<br />{address.neighborhood} · {address.city} / {address.state}<br />CEP {address.zip_code}</address> : <p className="text-gray-500">Endereço não registrado.</p>}{!!row.tracking_code && <p className="mt-3">Rastreio: <strong>{String(row.tracking_code)}</strong></p>}</div>
   {!!history.length && <div className="py-4 border-t"><h3 className="font-medium mb-3">Histórico do pedido</h3><ol className="space-y-3">{history.map(event => <li key={event.id} className="border-l-2 pl-3"><p>{orderLabels[event.status] || event.status} <time className="text-xs text-gray-500" dateTime={event.created_at}>{new Date(event.created_at).toLocaleString('pt-BR')}</time></p>{event.note && <p className="text-gray-600 mt-1 whitespace-pre-wrap">{event.note}</p>}</li>)}</ol></div>}
  </details>
 </>;
}
