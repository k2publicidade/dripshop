# DripShop

E-commerce editorial da DripShop, construído com Next.js, TypeScript, Tailwind CSS e Supabase. A experiência visual usa somente preto, branco e tons de cinza.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. Para produção local, use `npm run build` e `npm run start`.

## Configuração

Copie `.env.example` para `.env.local` e informe a URL e a chave pública do projeto Supabase. O schema e os dados iniciais ficam em `supabase/migrations` e `supabase/seed.sql`.

O checkout permanece controlado por `store_settings.checkout_enabled` até que o gateway seja configurado. O email de administração previsto é `admin@dripshop.com.br`; a conta só recebe acesso após confirmação do email.

## Verificações

```bash
npm run typecheck
npm run lint
npm run build
node tests/http-smoke.mjs
```

As integrações de pagamento e Resend são a etapa comercial final e devem ser configuradas com as credenciais reais antes da abertura das compras.
