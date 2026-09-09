# DripShop — estado da implementação

## Requisitos confirmados
- E-commerce completo com UX profissional e banco Supabase `pyrmvwpljdsnvhzoeuso`.
- Interface exclusivamente em preto, branco e tons de cinza.
- Administrador indicado: `admin@dripshop.com.br`; promoção condicionada à confirmação do email.
- Gateway e Resend ficam para a etapa final.

## Implementado
- Supabase Auth, sessão, login, cadastro, recuperação e páginas privadas.
- Esquema com RLS, catálogo, variações, pedidos, endereços, favoritos, newsletter, atendimento e configurações.
- Catálogo de 25 produtos migrado do código; imagens ilustrativas e estoque inicial zero.
- APIs e painel migrados para Supabase; dependências e serviços Prisma obsoletos removidos.
- Página inicial editorial monocromática com imagem própria local; navegação e diálogos acessíveis.
- Filtros, detalhes de produto, estoque por variação, favoritos e sacola persistente.
- Endereços com criação/edição/exclusão e endereço padrão; pedidos e dados da conta.
- Preparação do checkout com endereço, entrega e cotação validada no servidor, sem cobrança.
- Workflow de pedidos com histórico auditável, transições administrativas protegidas, guarda de pagamento, rastreio obrigatório e reposição de estoque idempotente.
- Upload de fotos no Storage `product-images`, com validação de conteúdo/tamanho e escrita exclusiva para administradores.
- Painel de pedidos com itens, totais, endereço, rastreio e histórico legíveis.

## Evidência verificada nesta continuação
- Build de produção Next 16.3.4 passou usando webpack após limpeza não destrutiva do cache antigo.
- Lint sem erros (avisos ainda precisam de revisão).
- npm audit: zero vulnerabilidades após remoção do Prisma.
- Supabase: PASS para isolamento de profiles/addresses, bloqueio de autoelevação de role, função admin e bloqueio de checkout.
- Supabase: PASS para guarda de pagamento, sequência de fulfillment, rastreio obrigatório, histórico e reposição de estoque única.
- Supabase: migração de Storage aplicada para fotos de produto; política de leitura pública e escrita administrativa.
- `tests/http-smoke.mjs`: 7 APIs privadas bloqueadas, 3 páginas privadas redirecionadas e 7 páginas públicas disponíveis; catálogo com variações.
- Prévia desktop monocromática conferida no navegador.
- Edição de endereço e novo checkout foram adicionados depois do último build: typecheck passou, lint em verificação; requerem novo build e teste funcional.

## Ainda necessário antes de concluir o objetivo
- Testar cadastro, confirmação, login, recuperação e painel autenticado ponta a ponta, incluindo conta administradora.
- Verificar fluxo completo de produto/estoque/sacola/endereços/cotação com fixtures transacionais ou ambiente apropriado.
- Testar upload de uma foto real pelo painel depois que a conta administradora estiver confirmada.
- Revisar todas as páginas, conteúdo institucional, links, responsividade, avisos de lint e dados estáticos restantes.
- Rever configuração de domínio, URLs do Supabase Auth e publicação Vercel com variáveis corretas.
- Substituir fotos ilustrativas e confirmar estoque/dados comerciais reais.
- Integrar e testar gateway e Resend quando o usuário fornecer as informações, sem marcar o objetivo completo antes disso.

## Ambiente
- Comandos `npm run dev` e `npm run build` usam webpack por falha de acesso do Turbopack no Windows.
- Cache antigo preservado em `.next-cache-before-upgrade` (ignorado por git/TypeScript/ESLint).
- Servidor de produção localhost:3000 iniciado na sessão 92836; verificar se ainda está ativo antes de reiniciar.
- Projeto git está dentro de um repositório pai com outros projetos; limitar operações à pasta dripshop.

Última validação: build final com checkout/quote e PUT de endereços passou; typecheck e lint sem erros. Servidor anterior 92836 foi encerrado intencionalmente para rebuild.
