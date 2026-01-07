# Design: Sistema de Notificações em Tempo Real

**Data:** 2026-01-06
**Projeto:** VibeOffice - Sistema de Gestão Interna
**Tipo:** Nova Funcionalidade (Feature)
**Autenticação:** Supabase Auth (não NextAuth)

---

## Resumo Executivo

Implementação de um sistema completo de notificações em tempo real multicanal para o VibeOffice, abrangendo todos os módulos (Tarefas, Tickets, Chat, etc.) com suporte a:

- **In-app notifications** (dentro do sistema)
- **Web Push notifications** (alertas do navegador)
- **Email notifications** (para eventos importantes, exceto chat)

O sistema permite que cada usuário configure preferências granulares por tipo de evento e canal, com priorização visual, histórico completo e tratamento robusto de erros.

---

## 1. Arquitetura Geral

### Camadas do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Components                       │
│  <NotificationBell> | <NotificationList> | <Preferences>    │
└─────────────────────────────────────────────────────────────┘
                              ↑
┌─────────────────────────────────────────────────────────────┐
│                    Event Emitters Layer                      │
│         useTasks | useTickets | useChat | outros...         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Event Bus Central                       │
│              eventBus.emit(eventType, payload)               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Notification Processor                      │
│    - Consulta preferências do usuário                       │
│    - Filtra por prioridade e tipo                           │
│    - Roteia para canais apropriados                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────┬──────────────────┬──────────────────────┐
│  InAppHandler    │   PushHandler    │   EmailHandler       │
│  (Realtime DB)   │   (Web Push)     │   (Edge Function)    │
└──────────────────┴──────────────────┴──────────────────────┘
```

### Princípios Arquiteturais

1. **Fire and Forget:** Notificações nunca devem bloquear operações principais
2. **Fail Independently:** Falha em um canal não afeta outros
3. **User Control:** Usuários controlam o que recebem e como
4. **Privacy First:** Defaults conservadores (GDPR-friendly)

---

## 2. Schema do Banco de Dados

### Tabela: `notifications`

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Destinatário (usa Supabase Auth)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Tipo e conteúdo
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Prioridade
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),

  -- Entidade relacionada (deep linking)
  entity_type TEXT,
  entity_id UUID,

  -- Metadata adicional
  metadata JSONB DEFAULT '{}',

  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  archived BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Row Level Security (Supabase Auth)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
```

### Tabela: `notification_preferences`

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Tipo de notificação
  notification_type TEXT NOT NULL,

  -- Canais habilitados
  enable_in_app BOOLEAN DEFAULT TRUE,
  enable_push BOOLEAN DEFAULT TRUE,
  enable_email BOOLEAN DEFAULT FALSE,

  -- Constraint
  UNIQUE(user_id, notification_type),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);
```

### Tabela: `push_subscriptions`

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Push subscription data
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,

  -- Metadata
  user_agent TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, endpoint)
);

-- RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own subscriptions"
  ON push_subscriptions FOR ALL
  USING (auth.uid() = user_id);
```

### Enum: Tipos de Notificação

```sql
CREATE TYPE notification_type_enum AS ENUM (
  -- Tasks
  'task_assigned',
  'task_status_changed',
  'task_comment_added',
  'task_due_soon',

  -- Tickets
  'ticket_created',
  'ticket_assigned',
  'ticket_status_changed',
  'ticket_comment_added',

  -- Chat
  'message_received',
  'mentioned_in_chat',

  -- Geral
  'announcement'
);
```

---

## 3. Event Bus e Fluxo de Eventos

### Implementação do Event Bus

**Arquivo:** `src/lib/notifications/eventBus.ts`

```typescript
export type NotificationEvent = {
  type: NotificationType
  recipientIds: string[]
  priority: 'low' | 'medium' | 'high'
  entityType: 'task' | 'ticket' | 'message' | null
  entityId: string | null
  metadata: Record<string, any>
}

class EventBus {
  private static instance: EventBus
  private processor: NotificationProcessor

  private constructor() {
    this.processor = new NotificationProcessor()
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  async emit(event: NotificationEvent): Promise<void> {
    try {
      console.log('[EventBus] Emitting event:', event.type)
      await this.processor.process(event)
    } catch (error) {
      console.error('[EventBus] Error emitting event:', error)
      // Não propaga erro
    }
  }
}

export const eventBus = EventBus.getInstance()
```

### Integração nos Hooks

**Exemplo:** `src/hooks/useTasks.ts`

```typescript
import { eventBus } from '@/lib/notifications/eventBus'

const createTask = async (taskData: CreateTaskInput) => {
  // 1. Operação original
  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single()

  if (error) throw error

  // 2. Emitir evento (non-blocking)
  eventBus.emit({
    type: 'task_assigned',
    recipientIds: [taskData.assigned_to],
    priority: taskData.priority === 'high' ? 'high' : 'medium',
    entityType: 'task',
    entityId: newTask.id,
    metadata: {
      taskTitle: taskData.title,
      dueDate: taskData.due_date,
      assignedBy: currentUser.id
    }
  }).catch(err => console.error('Notification failed:', err))

  // 3. Atualizar state
  setTasks(prev => [...prev, newTask])

  return newTask
}
```

---

## 4. Preferências do Usuário

### Defaults (GDPR-friendly)

```typescript
export const DEFAULT_PREFERENCES = {
  // Tasks
  task_assigned: { inApp: true, push: false, email: false },
  task_status_changed: { inApp: true, push: false, email: false },
  task_comment_added: { inApp: true, push: false, email: false },
  task_due_soon: { inApp: true, push: true, email: false },

  // Tickets
  ticket_created: { inApp: true, push: false, email: false },
  ticket_assigned: { inApp: true, push: false, email: false },
  ticket_status_changed: { inApp: true, push: false, email: false },
  ticket_comment_added: { inApp: true, push: false, email: false },

  // Chat (NUNCA enviar por email)
  message_received: { inApp: true, push: false, email: false },
  mentioned_in_chat: { inApp: true, push: true, email: false },

  // Geral
  announcement: { inApp: true, push: true, email: true },
}
```

---

## 5. Implementação dos Canais

### Canal 1: In-App

**Handler:** `src/lib/notifications/handlers/inAppHandler.ts`

```typescript
export class InAppHandler {
  async send(userId: string, event: NotificationEvent): Promise<void> {
    // 1. Inserir no banco
    const { data: notification } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: event.type,
        title: this.generateTitle(event),
        message: this.generateMessage(event),
        priority: event.priority,
        entity_type: event.entityType,
        entity_id: event.entityId,
        metadata: event.metadata,
      })
      .select()
      .single()

    // 2. Broadcast via Realtime
    const channel = supabase.channel(`user:${userId}:notifications`)
    await channel.send({
      type: 'broadcast',
      event: 'notification_created',
      payload: notification,
    })
  }
}
```

**Hook Frontend:** `src/hooks/useNotifications.ts`

```typescript
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    loadNotifications()

    // Realtime subscription
    const channel = supabase
      .channel(`user:${user.id}:notifications`)
      .on('broadcast', { event: 'notification_created' }, ({ payload }) => {
        setNotifications(prev => [payload, ...prev])
        setUnreadCount(prev => prev + 1)
        toast(payload.title, { description: payload.message })
      })
      .subscribe()

    return () => channel.unsubscribe()
  }, [user])

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return { notifications, unreadCount, markAsRead }
}
```

### Canal 2: Web Push

**Handler:** `src/lib/notifications/handlers/pushHandler.ts`

```typescript
export class PushHandler {
  async send(userId: string, event: NotificationEvent): Promise<void> {
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (!subscriptions?.length) return

    await Promise.allSettled(
      subscriptions.map(sub => this.sendPushToDevice(sub, event))
    )
  }

  private async sendPushToDevice(subscription, event) {
    await supabase.functions.invoke('send-push', {
      body: {
        subscription: {
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth }
        },
        notification: {
          title: this.generateTitle(event),
          body: this.generateMessage(event),
          icon: '/icon-192.png',
          data: { url: this.generateDeepLink(event) }
        }
      }
    })
  }
}
```

**Edge Function:** `supabase/functions/send-push/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as webpush from 'npm:web-push'

serve(async (req) => {
  const { subscription, notification } = await req.json()

  webpush.setVapidDetails(
    'mailto:contato@vibedistro.com',
    Deno.env.get('VAPID_PUBLIC_KEY')!,
    Deno.env.get('VAPID_PRIVATE_KEY')!
  )

  try {
    await webpush.sendNotification(subscription, JSON.stringify(notification))
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
```

### Canal 3: Email

**Handler:** `src/lib/notifications/handlers/emailHandler.ts`

```typescript
export class EmailHandler {
  async send(userId: string, event: NotificationEvent): Promise<void> {
    // NUNCA enviar email para eventos de chat
    if (this.isChatEvent(event.type)) {
      return
    }

    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single()

    if (!user?.email) return

    await supabase.functions.invoke('send-email', {
      body: {
        to: user.email,
        subject: this.generateSubject(event),
        html: this.generateEmailHTML(event, user.name),
      },
    })
  }

  private isChatEvent(type: NotificationType): boolean {
    return type === 'message_received' || type === 'mentioned_in_chat'
  }
}
```

**Edge Function:** `supabase/functions/send-email/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  const { to, subject, html } = await req.json()

  try {
    const { data } = await resend.emails.send({
      from: 'VibeOffice <notificacoes@vibedistro.com>',
      to,
      subject,
      html,
    })

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    })
  }
})
```

---

## 6. Tratamento de Erros

### Fire and Forget

```typescript
// Notificações NUNCA quebram operações principais
try {
  await eventBus.emit(event)
} catch (error) {
  console.error('Notification failed, but operation continues')
}
```

### Retry Strategy (In-App)

```typescript
export class InAppHandler {
  private readonly MAX_RETRIES = 3

  async sendWithRetry(userId, event, attempt = 1): Promise<void> {
    try {
      await this.send(userId, event)
    } catch (error) {
      if (attempt >= this.MAX_RETRIES) {
        await this.saveToDeadLetterQueue(userId, event)
        throw error
      }

      await new Promise(resolve =>
        setTimeout(resolve, 1000 * attempt)
      )

      return this.sendWithRetry(userId, event, attempt + 1)
    }
  }
}
```

### Circuit Breaker (Email)

```typescript
export class EmailHandler {
  private failureCount = 0
  private isCircuitOpen = false

  async send(userId, event) {
    if (this.isCircuitOpen) {
      console.warn('[Email] Circuit is open, skipping')
      return
    }

    try {
      await this.sendEmailViaEdgeFunction(userId, event)
      this.failureCount = 0
    } catch (error) {
      this.failureCount++
      if (this.failureCount >= 5) {
        this.isCircuitOpen = true
        // Reabrir após 5 minutos
      }
    }
  }
}
```

---

## 7. Componentes Frontend

### NotificationBell

```tsx
export function NotificationBell() {
  const { unreadCount } = useNotifications()

  return (
    <button data-testid="notification-bell">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span data-testid="notification-count">
          {unreadCount}
        </span>
      )}
    </button>
  )
}
```

### NotificationList

```tsx
export function NotificationList() {
  const { notifications, markAsRead } = useNotifications()

  return (
    <div data-testid="notification-dropdown">
      {notifications.map(notif => (
        <NotificationItem
          key={notif.id}
          notification={notif}
          onRead={() => markAsRead(notif.id)}
        />
      ))}
    </div>
  )
}
```

---

## 8. Tipos de Eventos

| Evento | Prioridade | Recipientes | Canais Padrão |
|--------|-----------|-------------|---------------|
| `task_assigned` | medium/high | assigned_to | in-app |
| `task_status_changed` | low | created_by, assigned_to | in-app |
| `task_due_soon` | high | assigned_to | in-app + push |
| `ticket_created` | medium | equipe do setor | in-app |
| `message_received` | low | participantes | in-app (SEM email) |
| `mentioned_in_chat` | medium | mencionado | in-app + push (SEM email) |
| `announcement` | high | todos | in-app + push + email |

---

## 9. Arquivos Críticos

### Criar

```
src/lib/notifications/
├── eventBus.ts
├── processor.ts
├── defaults.ts
└── handlers/
    ├── inAppHandler.ts
    ├── pushHandler.ts
    └── emailHandler.ts

src/hooks/
├── useNotifications.ts
└── useNotificationPreferences.ts

src/components/
├── NotificationBell.tsx
├── NotificationList.tsx
└── NotificationPreferences.tsx

supabase/functions/
├── send-push/index.ts
└── send-email/index.ts
```

### Modificar

```
src/hooks/useTasks.ts (adicionar eventBus.emit)
src/hooks/useTickets.ts (adicionar eventBus.emit)
src/app/(dashboard)/layout.tsx (adicionar <NotificationBell>)
```

---

## 10. Checklist de Implementação

### Fase 1: Infraestrutura
- [ ] Criar tabelas no Supabase
- [ ] Configurar RLS policies
- [ ] Criar Event Bus
- [ ] Criar Notification Processor

### Fase 2: Handlers
- [ ] Implementar InAppHandler
- [ ] Implementar PushHandler
- [ ] Implementar EmailHandler
- [ ] Criar Edge Functions

### Fase 3: Frontend
- [ ] Hook useNotifications
- [ ] Componente NotificationBell
- [ ] Componente NotificationList
- [ ] Página de preferências

### Fase 4: Integração
- [ ] Modificar useTasks
- [ ] Modificar useTickets
- [ ] Modificar useChat (se necessário)

### Fase 5: Testes
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Testes E2E (Playwright)

---

## Conclusão

Sistema robusto de notificações multicanal usando **Supabase Auth** para autenticação e autorização, com arquitetura Event Bus escalável, preferências granulares por usuário, e tratamento robusto de erros.

**Regra importante:** Mensagens de chat NUNCA são enviadas por email.

---

**Design validado em:** 2026-01-06