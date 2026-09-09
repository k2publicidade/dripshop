'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
 return <div className="container py-24 text-center"><h1 className="text-3xl mb-4">Não conseguimos carregar esta página.</h1><p className="mb-8 text-gray-500">Tente novamente em alguns instantes.</p><button className="btn-primary" onClick={reset}>Tentar novamente</button></div>;
}
