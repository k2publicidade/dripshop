# Guia de Testes - Sistema de Notificações em Tempo Real

## 📋 Pré-requisitos

Antes de iniciar os testes, certifique-se de que:

1. ✅ A migration SQL foi executada no Supabase (`docs/supabase-migrations-notifications.sql`)
2. ✅ As Edge Functions foram deployadas:
   ```bash
   supabase functions deploy send-push
   supabase functions deploy send-email
   ```
3. ✅ Variáveis de ambiente configuradas no Supabase:
   - `VAPID_PUBLIC_KEY` - Chave pública para Web Push
   - `VAPID_PRIVATE_KEY` - Chave privada para Web Push
   - `RESEND_API_KEY` - API key do Resend para emails
   - `APP_URL` - URL da aplicação (ex: https://vibeoffice.vibedistro.com)

4. ✅ Build e deploy da aplicação executados

---

## 🧪 Teste 1: Notificação In-App ao Criar Task

**Objetivo:** Verificar se notificações in-app são criadas e exibidas em tempo real.

### Passos:

1. **Login** com dois usuários diferentes em navegadores separados:
   - Usuário A (criador)
   - Usuário B (responsável)

2. **Com Usuário A**, criar uma nova task atribuída ao Usuário B:
   - Ir para página de Tasks
   - Clicar em "Nova Task"
   - Preencher:
     - Título: "Task de Teste - Notificação"
     - Descrição: "Testando sistema de notificações"
     - Responsável: Usuário B
     - Prioridade: Alta
     - Data de vencimento: Amanhã
   - Salvar

### Resultados Esperados:

- ✅ **Usuário B** deve ver o sino de notificação com badge vermelho (contador: 1)
- ✅ Ao clicar no sino, ver a notificação:
  - Título: "Nova task atribuída"
  - Mensagem: "Você foi atribuído à task 'Task de Teste - Notificação'"
  - Borda esquerda vermelha (prioridade alta)
  - Status: não lida
- ✅ Toast (sonner) deve aparecer no canto da tela com a notificação
- ✅ Console do navegador deve mostrar: `[EventBus] Emitting event: task_assigned`

---

## 🧪 Teste 2: Notificação de Mudança de Status

**Objetivo:** Verificar notificações ao alterar status de uma task.

### Passos:

1. **Com Usuário B**, alterar status da task criada no Teste 1:
   - Abrir a task
   - Alterar status de "Pendente" para "Em Progresso"
   - Salvar

### Resultados Esperados:

- ✅ **Usuário A** (criador) deve receber notificação:
  - Título: "Status da task alterado"
  - Mensagem: "A task 'Task de Teste - Notificação' mudou de Pendente para Em Progresso"
  - Borda esquerda azul (prioridade baixa)
- ✅ **Usuário B** (responsável) também deve receber a mesma notificação
- ✅ Badge do sino deve atualizar

---

## 🧪 Teste 3: Marcar como Lida e Arquivar

**Objetivo:** Verificar funcionalidades de marcar como lida e arquivar.

### Passos:

1. **Com Usuário B**, abrir lista de notificações:
   - Clicar no sino
   - Verificar 2 notificações não lidas

2. **Marcar primeira notificação como lida:**
   - Clicar na notificação

### Resultados Esperados:

- ✅ Notificação muda para cor cinza (estado lida)
- ✅ Badge do sino decrementa de 2 para 1
- ✅ Navegação para página da task (deep linking)

3. **Marcar todas como lidas:**
   - Clicar em "Marcar todas como lidas"

### Resultados Esperados:

- ✅ Todas as notificações ficam cinza
- ✅ Badge do sino desaparece (contador: 0)

4. **Arquivar notificação:**
   - Clicar no ícone de arquivo em uma notificação

### Resultados Esperados:

- ✅ Notificação desaparece da lista
- ✅ Registro permanece no banco de dados com `archived: true`

---

## 🧪 Teste 4: Preferências de Notificação (Futuro)

**Objetivo:** Verificar que usuários podem controlar quais notificações recebem.

> ⚠️ **Nota:** Esta funcionalidade ainda não foi implementada no frontend.
> Por enquanto, todas as notificações usam os defaults de `src/lib/notifications/defaults.ts`.

### Quando Implementado:

1. Ir para Configurações → Notificações
2. Desabilitar "In-App" para "task_assigned"
3. Criar nova task atribuída ao usuário
4. Verificar que notificação **não** aparece

---

## 🧪 Teste 5: Web Push Notifications (Requer Configuração)

**Objetivo:** Verificar notificações push no navegador.

### Pré-requisitos Adicionais:

1. Gerar chaves VAPID:
   ```bash
   npx web-push generate-vapid-keys
   ```

2. Configurar no Supabase Dashboard → Edge Functions → send-push:
   - `VAPID_PUBLIC_KEY`: [sua chave pública]
   - `VAPID_PRIVATE_KEY`: [sua chave privada]

3. Implementar registro de push subscription no frontend (ainda não implementado)

### Passos (Quando Implementado):

1. Permitir notificações no navegador
2. Registrar push subscription
3. Criar nova task atribuída ao usuário
4. Verificar notificação push do navegador

---

## 🧪 Teste 6: Email Notifications (Requer Configuração)

**Objetivo:** Verificar envio de emails.

### Pré-requisitos Adicionais:

1. Criar conta no [Resend](https://resend.com)
2. Gerar API Key
3. Verificar domínio `vibedistro.com` no Resend
4. Configurar no Supabase Dashboard → Edge Functions → send-email:
   - `RESEND_API_KEY`: [sua api key]
   - `APP_URL`: https://vibeoffice.vibedistro.com

### Passos:

1. Criar task de **Alta Prioridade** atribuída ao usuário
2. Verificar email recebido na caixa de entrada do Usuário B

### Resultados Esperados:

- ✅ Email recebido com:
  - Assunto: "Nova task atribuída"
  - Barra colorida vermelha no topo (prioridade alta)
  - Badge de "Alta Prioridade"
  - Título e mensagem da notificação
  - Botão "Ver Detalhes" com link para a task
  - Footer com link para gerenciar preferências

### ⚠️ Teste Crítico: Chat NÃO Envia Emails

1. Criar notificação de tipo `message_received` ou `mentioned_in_chat`
2. Verificar que:
   - ✅ Notificação **aparece** in-app
   - ✅ Notificação **NÃO** envia email
   - ✅ Logs mostram: `[EmailHandler] Skipping email for chat event`

---

## 🧪 Teste 7: Circuit Breaker de Email

**Objetivo:** Verificar que falhas de email não quebram o sistema.

### Passos:

1. **Simular falha:** Configurar `RESEND_API_KEY` inválida
2. Criar task com prioridade alta (tentará enviar email)
3. Verificar logs

### Resultados Esperados:

- ✅ Notificação in-app **continua funcionando**
- ✅ Console mostra: `[EmailHandler] Circuit is open, skipping email` (após 3 falhas)
- ✅ Task é criada normalmente (sistema não bloqueia)

---

## 🧪 Teste 8: Múltiplas Notificações Simultâneas

**Objetivo:** Verificar performance com várias notificações.

### Passos:

1. Criar 10 tasks rapidamente, todas atribuídas ao mesmo usuário
2. Observar comportamento do sistema

### Resultados Esperados:

- ✅ Todas as 10 notificações aparecem na lista
- ✅ Badge mostra "10"
- ✅ Sistema não trava ou apresenta lag
- ✅ Notificações aparecem em ordem cronológica reversa (mais recente primeiro)

---

## 🧪 Teste 9: Realtime Subscription

**Objetivo:** Verificar que notificações aparecem sem refresh.

### Passos:

1. **Usuário B** mantém página aberta no dashboard
2. **Usuário A** cria task atribuída ao Usuário B
3. **NÃO fazer refresh** da página

### Resultados Esperados:

- ✅ Notificação aparece automaticamente (sem F5)
- ✅ Toast aparece instantaneamente
- ✅ Badge atualiza em tempo real

---

## 🧪 Teste 10: Deep Linking

**Objetivo:** Verificar navegação para entidade relacionada.

### Passos:

1. Receber notificação de task
2. Clicar na notificação

### Resultados Esperados:

- ✅ Navega para `/tasks/[id]` (página de detalhes da task)
- ✅ Notificação marcada como lida automaticamente
- ✅ URL correto na barra de endereços

---

## 📊 Verificações de Banco de Dados

### Consultar notificações no Supabase SQL Editor:

```sql
-- Ver todas as notificações
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;

-- Ver notificações não lidas por usuário
SELECT * FROM notifications
WHERE user_id = '[user-id-here]'
AND read = false
ORDER BY created_at DESC;

-- Ver preferências (quando implementado)
SELECT * FROM notification_preferences
WHERE user_id = '[user-id-here]';

-- Ver push subscriptions (quando implementado)
SELECT * FROM push_subscriptions
WHERE user_id = '[user-id-here]';
```

---

## 🐛 Troubleshooting

### Notificação não aparece:

1. Verificar console do navegador:
   - Erros de RLS no Supabase?
   - Erros no EventBus?

2. Verificar logs do Supabase:
   - Dashboard → Logs → Edge Functions

3. Verificar políticas RLS:
   ```sql
   -- Verificar se usuário tem permissão
   SELECT * FROM notifications WHERE user_id = auth.uid();
   ```

### Toast não aparece:

1. Verificar se Sonner está configurado no layout
2. Verificar console para erros do toast

### Edge Function falha:

1. Verificar variáveis de ambiente no Supabase
2. Verificar logs: Dashboard → Edge Functions → [function] → Logs
3. Testar manualmente:
   ```bash
   curl -X POST https://[project-ref].supabase.co/functions/v1/send-push \
     -H "Authorization: Bearer [anon-key]" \
     -H "Content-Type: application/json" \
     -d '{"notification_id": "[uuid-here]"}'
   ```

---

## ✅ Checklist Final

Antes de marcar o sistema como completo:

- [ ] Migration executada com sucesso
- [ ] Notificações in-app funcionando
- [ ] Realtime subscription ativa
- [ ] Badge contador correto
- [ ] Marcar como lida funciona
- [ ] Arquivar funciona
- [ ] Deep linking navega corretamente
- [ ] Chat NÃO envia emails
- [ ] Circuit breaker protege contra falhas
- [ ] Edge Functions deployadas
- [ ] Variáveis de ambiente configuradas
- [ ] Testes com múltiplos usuários simultâneos
- [ ] Performance aceitável com 10+ notificações

---

## 📝 Notas de Implementação Futura

Funcionalidades planejadas mas ainda não implementadas:

1. **Frontend de Preferências:**
   - Página `/settings/notifications`
   - Toggle por tipo de notificação
   - Ativar/desativar in-app, push, email

2. **Push Subscription Registration:**
   - Service Worker registration
   - Solicitação de permissão do navegador
   - Salvar subscription no banco

3. **Notificações para Tickets:**
   - Integração com sistema de tickets
   - Eventos: `ticket_created`, `ticket_assigned`, `ticket_status_changed`, `ticket_comment_added`

4. **Notificações para Chat:**
   - `message_received` (já tem tipo, falta integração)
   - `mentioned_in_chat` (já tem tipo, falta integração)

5. **Sistema de Anúncios:**
   - `announcement` (já tem tipo, falta UI admin)
   - Enviar para todos os usuários ou grupos específicos

6. **Limpeza Automática:**
   - Cron job para arquivar notificações antigas (90+ dias)
   - Deletar push subscriptions inativas (180+ dias)

---

## 🎯 Status Atual do Sistema

**Componentes Completos (100%):**
- ✅ Banco de dados e migrations
- ✅ Tipos TypeScript
- ✅ Handlers (InApp, Push, Email)
- ✅ NotificationProcessor
- ✅ EventBus
- ✅ Hook useNotifications
- ✅ Componentes frontend (Bell, List, Item)
- ✅ Integração com useTasks
- ✅ Edge Functions
- ✅ Realtime subscriptions

**Componentes Pendentes:**
- ⏳ Frontend de preferências
- ⏳ Push subscription registration
- ⏳ Integração com Tickets
- ⏳ Integração com Chat
- ⏳ Sistema de anúncios

**Pronto para Produção:** 🟢 Sim (para notificações in-app de Tasks)
