# Design: Página de Preferências de Notificação

**Data:** 2026-01-06
**Autor:** Claude Code (via brainstorming)
**Status:** Aprovado

---

## 📋 Resumo

Implementação de uma página dedicada para usuários gerenciarem suas preferências de notificação no VibeOffice, permitindo controle granular por tipo de evento e canal de comunicação (in-app, push, email).

---

## 🎯 Objetivos

1. Permitir usuários controlarem quais notificações desejam receber
2. Oferecer controle granular: 11 tipos × 3 canais = 33 opções
3. Interface intuitiva e organizada por categoria
4. Auto-save para UX moderna
5. Respeitar restrições críticas (ex: chat não envia email)

---

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
vibeoffice/src/
├── app/(dashboard)/settings/notifications/
│   └── page.tsx                          # Server component (carrega dados)
├── components/settings/
│   ├── NotificationPreferences.tsx       # Client component principal
│   └── NotificationCategoryCard.tsx      # Card por categoria
├── hooks/
│   └── useNotificationPreferences.ts     # Hook de gerenciamento
└── lib/notifications/
    └── metadata.ts                        # Labels e metadados
```

### Fluxo de Dados

```
Server Component (page.tsx)
    ↓ carrega preferências do Supabase
Client Component (NotificationPreferences.tsx)
    ↓ usa hook useNotificationPreferences
    ↓ renderiza 4 CategoryCards
User altera Switch
    ↓ optimistic update (estado local)
    ↓ debounce 300ms
    ↓ UPDATE no Supabase
    ↓ toast de confirmação
```

---

## 🎨 Design Visual

### Layout da Página

**Rota:** `/settings/notifications`

**Header:**
- Breadcrumb: "Configurações > Notificações"
- Título: "Preferências de Notificação"
- Descrição: "Controle como e quando você recebe notificações no VibeOffice"

**Grid de Cards:**
- Layout responsivo: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- 4 cards: Tasks, Tickets, Chat, Geral

### Estrutura de Cada Card

```
┌─────────────────────────────────────┐
│ 📋 Tasks                      [ícone] │
│ ───────────────────────────────────  │
│                                       │
│ Tipo              In-App  Push  Email│
│ ───────────────────────────────────  │
│ Nova task         ✓       ○     ○    │
│ Status alterado   ✓       ○     ○    │
│ Comentário        ✓       ○     ○    │
│ Prazo próximo     ✓       ✓     ○    │
│                                       │
└─────────────────────────────────────┘
```

**Componentes shadcn/ui:**
- `Card` (CardHeader, CardTitle, CardContent)
- `Switch` para toggles
- `Table` para layout organizado
- `Badge` para labels dos canais
- `Tooltip` para explicações
- `Separator` entre categorias

**Tabela interna:**
- 4 colunas: Tipo (40%) | In-App (20%) | Push (20%) | Email (20%)
- Headers com ícones: 📱 In-App | 🔔 Push | 📧 Email
- Tooltip em cada header explicando o canal

---

## 🔧 Funcionalidades

### Auto-Save

**Comportamento:**
1. Usuário altera switch
2. Estado local atualiza imediatamente (optimistic update)
3. Debounce de 300ms
4. Update no Supabase
5. Toast de confirmação: "Preferência atualizada ✓"
6. Se erro: rollback + toast de erro

**Vantagens:**
- UX moderna e fluida
- Feedback imediato
- Sem necessidade de botão "Salvar"

### Restrições de Canal

**Regra crítica:** Chat events NUNCA enviam email

**Implementação:**
- Switch de Email **desabilitado** para:
  - `message_received`
  - `mentioned_in_chat`
- Visual: `opacity-50 cursor-not-allowed`
- Tooltip: "Mensagens de chat não enviam notificações por email"
- Ícone ⓘ cinza ao lado

---

## 📝 Textos e Labels

### Metadados por Tipo

**Tasks (📋):**
- `task_assigned` → "Nova task atribuída" / "Quando você é atribuído a uma nova task"
- `task_status_changed` → "Status alterado" / "Quando o status de uma task muda"
- `task_comment_added` → "Novo comentário" / "Quando alguém comenta em uma task"
- `task_due_soon` → "Prazo próximo" / "Lembrete de tasks com prazo próximo (24h antes)"

**Tickets (🎫):**
- `ticket_created` → "Novo ticket criado" / "Quando um novo ticket é criado"
- `ticket_assigned` → "Ticket atribuído" / "Quando você é atribuído a um ticket"
- `ticket_status_changed` → "Status alterado" / "Quando o status de um ticket muda"
- `ticket_comment_added` → "Novo comentário" / "Quando alguém comenta em um ticket"

**Chat (💬):**
- `message_received` → "Mensagem recebida" / "Quando você recebe uma mensagem direta"
- `mentioned_in_chat` → "Menção no chat" / "Quando alguém menciona você (@usuario)"

**Geral (📢):**
- `announcement` → "Anúncios" / "Comunicados importantes da empresa"

### Tooltips dos Canais

- **In-App:** "Notificações dentro da plataforma (sino no topo)"
- **Push:** "Notificações do navegador (mesmo fora da aba)"
- **Email:** "Notificações enviadas para seu email"

---

## 🔐 Segurança e Validação

### Row Level Security (RLS)

**Policy existente no Supabase:**
```sql
CREATE POLICY "Users manage their own preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);
```

- Usuário só pode ler/atualizar suas próprias preferências
- Backend valida restrições (chat não pode email)

### Validação Client-Side

1. Previne ativar email para chat events
2. Valida tipos de notificação contra enum `NotificationType`
3. TypeScript garante type-safety em todo fluxo

---

## 🚀 Performance

### Otimizações

1. **Debounce:** 300ms para evitar múltiplas chamadas ao Supabase
2. **Optimistic Updates:** UI responde imediatamente
3. **PATCH seletivo:** Atualiza só o campo alterado, não todo registro
4. **Skeleton loading:** Previne layout shift durante carregamento inicial

### Estados de Loading

- **Initial load:** Skeleton cards
- **Saving:** Spinner sutil ao lado do switch
- **Error:** Alert com botão "Tentar novamente"

---

## 🛡️ Tratamento de Erros

### Cenários e Soluções

**1. Falha ao carregar preferências:**
- Mostra estado de erro amigável
- Botão "Tentar novamente"
- Fallback para `DEFAULT_PREFERENCES` em modo read-only
- Alert: "Não foi possível carregar suas preferências. Tente novamente."

**2. Falha ao salvar preferência:**
- Reverte estado local (optimistic rollback)
- Toast vermelho: "Erro ao salvar. Suas alterações não foram salvas."
- Botão "Tentar novamente" no toast
- Log do erro no console para debug

**3. Usuário sem preferências (primeiro acesso):**
- Detecta query vazia
- Cria preferências default automaticamente via `createDefaultPreferences(userId)`
- Mostra skeleton durante criação
- Após criação, exibe normalmente

**4. Perda de conexão durante save:**
- Detecta erro de rede
- Mantém mudanças em memória
- Toast: "Sem conexão. Tentando novamente..."
- Retry automático com exponential backoff (3 tentativas)

---

## ♿ Acessibilidade

### WCAG 2.1 Compliance

- ✅ Switches com labels descritivos
- ✅ Tooltips acessíveis via teclado
- ✅ Foco visível em todos os controles
- ✅ ARIA labels para screen readers
- ✅ Contraste adequado em todos os estados
- ✅ Navegação completa via teclado

---

## 🧪 Casos de Teste

### Testes Funcionais

1. **Carregamento inicial:**
   - ✅ Usuário com preferências existentes → carrega corretamente
   - ✅ Usuário novo → cria defaults e exibe

2. **Auto-save:**
   - ✅ Alterar switch → salva após 300ms
   - ✅ Alterar múltiplos switches rapidamente → salva apenas última mudança
   - ✅ Toast de confirmação aparece

3. **Restrições:**
   - ✅ Email desabilitado para chat events
   - ✅ Tooltip explica a restrição
   - ✅ Impossível ativar via UI

4. **Erros:**
   - ✅ Falha ao carregar → estado de erro + retry
   - ✅ Falha ao salvar → rollback + toast de erro
   - ✅ Sem conexão → retry automático

5. **Responsividade:**
   - ✅ Desktop: 2 colunas
   - ✅ Mobile: 1 coluna, cards empilhados
   - ✅ Switches funcionam em touch

---

## 📊 Métricas de Sucesso

1. **Taxa de adoção:** % de usuários que acessam a página
2. **Alterações por usuário:** Média de preferências alteradas
3. **Taxa de erro:** % de saves que falham
4. **Tempo médio:** Quanto tempo usuário passa na página

---

## 🔮 Futuras Melhorias

### V2 (Não incluídas nesta versão)

1. **Agrupamento personalizado:**
   - Permitir usuário criar seus próprios grupos
   - Drag & drop para reorganizar

2. **Perfis de preferência:**
   - "Modo Foco" (desativa tudo exceto urgente)
   - "Modo Disponível" (ativa tudo)
   - "Modo Fim de Semana" (só emergências)

3. **Agendamento:**
   - Definir horários de silêncio (ex: 22h-8h)
   - Dias da semana diferentes

4. **Preview de notificação:**
   - Botão "Testar" ao lado de cada tipo
   - Envia notificação de teste

5. **Analytics:**
   - Mostrar quantas notificações recebeu por tipo
   - "Você recebeu 45 notificações de tasks este mês"

---

## 🎯 Decisões de Design

### Por que página separada?
- 33 toggles precisam de espaço
- Permite breadcrumb claro
- Escalável para futuras features (agendamento, etc.)

### Por que auto-save?
- UX moderna (Gmail, Notion usam)
- Feedback imediato
- Evita perder mudanças

### Por que cards agrupados?
- Contexto claro (usuário sabe onde procurar)
- Visual organizado
- Escalável (fácil adicionar novas categorias)

### Por que desabilitar switches em vez de ocultar?
- Transparência (usuário entende a restrição)
- Layout consistente
- Previne confusão

---

## ✅ Validação

- ✅ Design aprovado pelo usuário
- ✅ Alinhado com sistema de notificações existente
- ✅ Respeita restrições críticas (chat não envia email)
- ✅ Usa componentes shadcn/ui já disponíveis
- ✅ Compatível com Supabase Auth e RLS
- ✅ Segue padrões do projeto VibeOffice

---

**Próximo passo:** Criar plano de implementação detalhado
