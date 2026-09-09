export default function Loading() {
 return <div role="status" aria-label="Carregando" className="container py-16"><div className="h-12 w-60 bg-gray-100 animate-pulse mb-10"/><div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{[1,2,3,4].map(i=><div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse"/>)}</div><span className="sr-only">Carregando...</span></div>;
}
