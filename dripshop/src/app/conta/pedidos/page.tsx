import { requireUser } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

const statuses: Record<string, string> = { PENDING: 'Aguardando pagamento', CONFIRMED: 'Confirmado', PROCESSING: 'Em preparação', SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELLED: 'Cancelado' };

export default async function OrdersPage() {
 const { db, user } = await requireUser();
 const { data: orders, error } = await db.from('orders').select('*,order_items(*),order_status_history(*)').eq('user_id', user.id).order('created_at', { ascending: false });
 if (error) throw new Error('Não foi possível carregar os pedidos.');
 return <div><h2 className="text-3xl mb-8">Meus pedidos</h2>{!orders?.length ? <div className="p-12 bg-gray-50 text-center"><h3 className="text-xl mb-3">Sua história começa no primeiro drip.</h3><p className="text-gray-500 mb-6">Você ainda não tem pedidos.</p><Link className="btn-primary" href="/busca">Explorar a loja</Link></div> : orders.map(o => {
  const history = [...(o.order_status_history || [])].sort((a, b) => a.created_at.localeCompare(b.created_at));
  return <article className="border p-6 mb-5" key={o.id}><div className="flex flex-wrap justify-between gap-3 mb-5"><strong>{o.order_number}</strong><span>{statuses[o.status]}</span><span>{formatPrice(o.total)}</span></div><p className="text-sm text-gray-500 mb-4">{new Date(o.created_at).toLocaleDateString('pt-BR')}</p>{o.order_items.map((i: { id: string; product_name: string; quantity: number; selected_size: string; selected_color: string }) => <p key={i.id} className="text-sm py-2">{i.quantity} × {i.product_name} · {i.selected_size} / {i.selected_color}</p>)}{o.tracking_code && <p className="mt-4">Rastreio: {o.tracking_code}</p>}{history.length > 0 && <details className="border-t mt-5 pt-4"><summary className="text-sm font-medium cursor-pointer">Acompanhar pedido</summary><ol className="mt-4 space-y-3">{history.map((event: { id: string; status: string; note: string; created_at: string }) => <li className="border-l-2 pl-3 text-sm" key={event.id}><p>{statuses[event.status] || event.status}</p><time className="text-xs text-gray-500" dateTime={event.created_at}>{new Date(event.created_at).toLocaleString('pt-BR')}</time>{event.note && <p className="text-gray-600 mt-1">{event.note}</p>}</li>)}</ol></details>}</article>;
 })}</div>;
}
