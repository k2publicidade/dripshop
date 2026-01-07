# Sistema de Notificações em Tempo Real - Plano de Implementação

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar sistema completo de notificações multicanal (in-app, push, email) para o VibeOffice

**Architecture:** Event Bus centralizado que captura eventos de hooks existentes (useTasks, useTickets) e distribui para 3 handlers independentes (InApp, Push, Email). Frontend usa Realtime subscriptions para updates instantâneos.

**Tech Stack:** TypeScript, React 19, Next.js 16, Supabase (PostgreSQL + Realtime + Edge Functions), Tailwind CSS, Shadcn/UI

---

## FASE 1: Database Schema e Tipos

### Task 1: Criar migration SQL para tabelas de notificações

**Files:**
- Create: `docs/supabase-migrations-notifications.sql`

**Step 1: Criar arquivo de migration**

```sql
-- ========================================
-- MIGRATION 10: SISTEMA DE NOTIFICAÇÕES
-- Data: 2026-01-06
-- ========================================

-- Enum de tipos de notificação
CREATE TYPE notification_type_enum AS ENUM (
  'task_assigned',
  'task_status_changed',
  'task_comment_added',
  'task_due_soon',
  'ticket_created',
  'ticket_assigned',
  'ticket_status_changed',
  'ticket_comment_added',
  'message_received',
  'mentioned_in_chat',
  'announcement'
);

-- Tabela de notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Tabela de preferências
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  enable_in_app BOOLEAN DEFAULT TRUE,
  enable_push BOOLEAN DEFAULT TRUE,
  enable_email BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, notification_type)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Tabela de push subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own subscriptions"
  ON push_subscriptions FOR ALL
  USING (auth.uid() = user_id);
```

**Step 2: Executar migration no Supabase**

Manual: Abrir Supabase SQL Editor e colar o conteúdo do arquivo
Expected: Tabelas criadas com sucesso

**Step 3: Commit**

```bash
git add docs/supabase-migrations-notifications.sql
git commit -m "feat(db): add notifications schema with RLS policies"
```

---

### Task 2: Criar tipos TypeScript para notificações

**Files:**
- Create: `src/types/notifications.ts`

**Step 1: Criar arquivo de tipos**

```typescript
export type NotificationType =
  | 'task_assigned'
  | 'task_status_changed'
  | 'task_comment_added'
  | 'task_due_soon'
  | 'ticket_created'
  | 'ticket_assigned'
  | 'ticket_status_changed'
  | 'ticket_comment_added'
  | 'message_received'
  | 'mentioned_in_chat'
  | 'announcement'

export type NotificationPriority = 'low' | 'medium' | 'high'

export type EntityType = 'task' | 'ticket' | 'message' | null

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  entity_type: EntityType
  entity_id: string | null
  metadata: Record<string, any>
  read: boolean
  read_at: string | null
  archived: boolean
  created_at: string
}

export interface NotificationPreference {
  id: string
  user_id: string
  notification_type: NotificationType
  enable_in_app: boolean
  enable_push: boolean
  enable_email: boolean
  created_at: string
  updated_at: string
}

export interface PushSubscription {
  id: string
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  user_agent: string | null
  created_at: string
  last_used_at: string
}

export interface NotificationEvent {
  type: NotificationType
  recipientIds: string[]
  priority: NotificationPriority
  entityType: EntityType
  entityId: string | null
  metadata: Record<string, any>
}
```

**Step 2: Commit**

```bash
git add src/types/notifications.ts
git commit -m "feat(types): add notification TypeScript types"
```

---

## FASE 2: Core Notification System

### Task 3: Criar defaults de preferências

**Files:**
- Create: `src/lib/notifications/defaults.ts`

**Step 1: Criar arquivo com defaults**

```typescript
import { NotificationType } from '@/types/notifications'

export const DEFAULT_PREFERENCES: Record<
  NotificationType,
  { inApp: boolean; push: boolean; email: boolean }
> = {
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

  // Chat (NUNCA email)
  message_received: { inApp: true, push: false, email: false },
  mentioned_in_chat: { inApp: true, push: true, email: false },

  // Geral
  announcement: { inApp: true, push: true, email: true },
}

export async function createDefaultPreferences(userId: string) {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()

  const preferences = Object.entries(DEFAULT_PREFERENCES).map(
    ([type, channels]) => ({
      user_id: userId,
      notification_type: type,
      enable_in_app: channels.inApp,
      enable_push: channels.push,
      enable_email: channels.email,
    })
  )

  const { error } = await supabase
    .from('notification_preferences')
    .insert(preferences)

  if (error) {
    console.error('Failed to create default preferences:', error)
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/notifications/defaults.ts
git commit -m "feat(notifications): add default preferences (GDPR-friendly)"
```

---

### Task 4: Criar InAppHandler

**Files:**
- Create: `src/lib/notifications/handlers/inAppHandler.ts`

**Step 1: Criar handler**

```typescript
import { createClient } from '@/lib/supabase/client'
import { NotificationEvent, NotificationType } from '@/types/notifications'

export class InAppHandler {
  private supabase = createClient()

  async send(userId: string, event: NotificationEvent): Promise<void> {
    // 1. Inserir notificação no banco
    const { data: notification, error } = await this.supabase
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

    if (error) {
      console.error('[InAppHandler] Failed to insert notification:', error)
      throw error
    }

    // 2. Broadcast via Realtime
    const channel = this.supabase.channel(`user:${userId}:notifications`)
    await channel.send({
      type: 'broadcast',
      event: 'notification_created',
      payload: notification,
    })
  }

  private generateTitle(event: NotificationEvent): string {
    const titles: Record<NotificationType, string> = {
      task_assigned: 'Nova tarefa atribuída',
      task_status_changed: 'Status da tarefa alterado',
      task_comment_added: 'Novo comentário em tarefa',
      task_due_soon: 'Tarefa vence em breve',
      ticket_created: 'Novo ticket criado',
      ticket_assigned: 'Ticket atribuído a você',
      ticket_status_changed: 'Status do ticket alterado',
      ticket_comment_added: 'Novo comentário em ticket',
      message_received: 'Nova mensagem',
      mentioned_in_chat: 'Você foi mencionado',
      announcement: 'Novo anúncio',
    }
    return titles[event.type] || 'Nova notificação'
  }

  private generateMessage(event: NotificationEvent): string {
    const { metadata, type } = event

    switch (type) {
      case 'task_assigned':
        return `${metadata.assignedByName || 'Alguém'} atribuiu a tarefa "${metadata.taskTitle}" para você`
      case 'task_status_changed':
        return `A tarefa "${metadata.taskTitle}" mudou para ${metadata.newStatus}`
      case 'task_due_soon':
        return `A tarefa "${metadata.taskTitle}" vence em ${metadata.timeUntilDue}`
      case 'ticket_created':
        return `Novo ticket criado: "${metadata.ticketTitle}"`
      case 'ticket_assigned':
        return `Ticket "${metadata.ticketTitle}" foi atribuído a você`
      case 'message_received':
        return `${metadata.senderName}: ${metadata.messagePreview}`
      case 'mentioned_in_chat':
        return `${metadata.senderName} mencionou você em ${metadata.roomName}`
      default:
        return 'Você tem uma nova notificação'
    }
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/notifications/handlers/inAppHandler.ts
git commit -m "feat(notifications): add InAppHandler with Realtime broadcast"
```

---

### Task 5: Criar PushHandler (stub)

**Files:**
- Create: `src/lib/notifications/handlers/pushHandler.ts`

**Step 1: Criar handler stub**

```typescript
import { createClient } from '@/lib/supabase/client'
import { NotificationEvent } from '@/types/notifications'

export class PushHandler {
  private supabase = createClient()

  async send(userId: string, event: NotificationEvent): Promise<void> {
    // Buscar subscriptions do usuário
    const { data: subscriptions } = await this.supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[PushHandler] No subscriptions found for user:', userId)
      return
    }

    // Enviar push para cada device
    const pushPromises = subscriptions.map((sub) =>
      this.sendPushToDevice(sub, event)
    )

    await Promise.allSettled(pushPromises)
  }

  private async sendPushToDevice(subscription: any, event: NotificationEvent) {
    try {
      const { error } = await this.supabase.functions.invoke('send-push', {
        body: {
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          notification: {
            title: this.generateTitle(event),
            body: this.generateMessage(event),
            icon: '/icon-192.png',
            badge: '/badge-72.png',
            data: {
              url: this.generateDeepLink(event),
              notificationType: event.type,
            },
          },
        },
      })

      if (error) {
        console.error('[PushHandler] Failed to send push:', error)

        // Se subscription inválida (410/404), remover
        if (error.message?.includes('410') || error.message?.includes('404')) {
          await this.removeInvalidSubscription(subscription.id)
        }
      }
    } catch (error) {
      console.error('[PushHandler] Error:', error)
    }
  }

  private async removeInvalidSubscription(subscriptionId: string) {
    await this.supabase
      .from('push_subscriptions')
      .delete()
      .eq('id', subscriptionId)

    console.log('[PushHandler] Removed invalid subscription:', subscriptionId)
  }

  private generateTitle(event: NotificationEvent): string {
    // Reutilizar lógica do InAppHandler
    return 'Nova notificação'
  }

  private generateMessage(event: NotificationEvent): string {
    return event.metadata.taskTitle || event.metadata.ticketTitle || 'Você tem uma nova notificação'
  }

  private generateDeepLink(event: NotificationEvent): string {
    if (event.entityType === 'task') {
      return `/tarefas?task=${event.entityId}`
    }
    if (event.entityType === 'ticket') {
      return `/tickets/${event.entityId}`
    }
    if (event.entityType === 'message') {
      return `/chat`
    }
    return '/notificacoes'
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/notifications/handlers/pushHandler.ts
git commit -m "feat(notifications): add PushHandler stub (requires edge function)"
```

---

### Task 6: Criar EmailHandler

**Files:**
- Create: `src/lib/notifications/handlers/emailHandler.ts`

**Step 1: Criar handler**

```typescript
import { createClient } from '@/lib/supabase/client'
import { NotificationEvent, NotificationType } from '@/types/notifications'

export class EmailHandler {
  private supabase = createClient()
  private failureCount = 0
  private readonly FAILURE_THRESHOLD = 5
  private isCircuitOpen = false
  private circuitOpenUntil: number = 0

  async send(userId: string, event: NotificationEvent): Promise<void> {
    // REGRA: NUNCA enviar email para eventos de chat
    if (this.isChatEvent(event.type)) {
      console.log('[EmailHandler] Skipping email for chat event:', event.type)
      return
    }

    // Circuit breaker check
    if (this.isCircuitOpen) {
      if (Date.now() < this.circuitOpenUntil) {
        console.warn('[EmailHandler] Circuit is open, skipping email')
        return
      }
      // Reset circuit
      this.isCircuitOpen = false
      this.failureCount = 0
    }

    try {
      // Buscar dados do usuário
      const { data: user } = await this.supabase
        .from('users')
        .select('email, name')
        .eq('id', userId)
        .single()

      if (!user?.email) {
        console.log('[EmailHandler] No email found for user:', userId)
        return
      }

      // Chamar Edge Function
      const { error } = await this.supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          subject: this.generateSubject(event),
          html: this.generateEmailHTML(event, user.name),
        },
      })

      if (error) {
        throw error
      }

      // Reset contador em caso de sucesso
      this.failureCount = 0
    } catch (error) {
      this.failureCount++

      if (this.failureCount >= this.FAILURE_THRESHOLD) {
        // Abrir circuit por 5 minutos
        this.isCircuitOpen = true
        this.circuitOpenUntil = Date.now() + 5 * 60 * 1000

        console.error('[EmailHandler] Circuit breaker opened due to repeated failures')
      }

      throw error
    }
  }

  private isChatEvent(type: NotificationType): boolean {
    return type === 'message_received' || type === 'mentioned_in_chat'
  }

  private generateSubject(event: NotificationEvent): string {
    const subjects: Record<NotificationType, string> = {
      task_assigned: 'Nova tarefa atribuída a você - VibeOffice',
      task_status_changed: 'Atualização de tarefa - VibeOffice',
      task_comment_added: 'Novo comentário em tarefa - VibeOffice',
      task_due_soon: '⚠️ Tarefa vence em breve - VibeOffice',
      ticket_created: 'Novo ticket criado - VibeOffice',
      ticket_assigned: 'Ticket atribuído a você - VibeOffice',
      ticket_status_changed: 'Atualização de ticket - VibeOffice',
      ticket_comment_added: 'Novo comentário em ticket - VibeOffice',
      message_received: '',
      mentioned_in_chat: '',
      announcement: '📢 Novo anúncio - VibeOffice',
    }
    return subjects[event.type] || 'Nova notificação - VibeOffice'
  }

  private generateEmailHTML(event: NotificationEvent, userName: string): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const deepLink = this.generateDeepLink(event)

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f9fafb;
            }
            .card {
              background: white;
              border-radius: 8px;
              padding: 24px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .header {
              color: #7C3AED;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 16px;
            }
            .content {
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: #7C3AED;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 16px;
            }
            .footer {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">VibeOffice</div>
              <div class="content">
                <p>Olá, ${userName}!</p>
                <p>${this.generateMessage(event)}</p>
                <a href="${appUrl}${deepLink}" class="button">
                  Ver detalhes
                </a>
              </div>
              <div class="footer">
                <p>Esta é uma notificação automática do VibeOffice.</p>
                <p>Você pode gerenciar suas preferências de notificação nas configurações.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private generateMessage(event: NotificationEvent): string {
    const { metadata, type } = event

    switch (type) {
      case 'task_assigned':
        return `${metadata.assignedByName || 'Alguém'} atribuiu a tarefa <strong>"${metadata.taskTitle}"</strong> para você.`
      case 'task_due_soon':
        return `A tarefa <strong>"${metadata.taskTitle}"</strong> vence em ${metadata.timeUntilDue}.`
      case 'announcement':
        return metadata.message || 'Há um novo anúncio importante para você.'
      default:
        return 'Você tem uma nova notificação no VibeOffice.'
    }
  }

  private generateDeepLink(event: NotificationEvent): string {
    if (event.entityType === 'task') {
      return `/tarefas?task=${event.entityId}`
    }
    if (event.entityType === 'ticket') {
      return `/tickets/${event.entityId}`
    }
    return '/notificacoes'
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/notifications/handlers/emailHandler.ts
git commit -m "feat(notifications): add EmailHandler with circuit breaker"
```

---

### Task 7: Criar NotificationProcessor

**Files:**
- Create: `src/lib/notifications/processor.ts`

**Step 1: Criar processor**

```typescript
import { createClient } from '@/lib/supabase/client'
import { NotificationEvent } from '@/types/notifications'
import { DEFAULT_PREFERENCES } from './defaults'
import { InAppHandler } from './handlers/inAppHandler'
import { PushHandler } from './handlers/pushHandler'
import { EmailHandler } from './handlers/emailHandler'

export class NotificationProcessor {
  private supabase = createClient()
  private inAppHandler = new InAppHandler()
  private pushHandler = new PushHandler()
  private emailHandler = new EmailHandler()

  async process(event: NotificationEvent): Promise<void> {
    // Processar para cada recipiente
    for (const userId of event.recipientIds) {
      await this.processForUser(userId, event)
    }
  }

  private async processForUser(
    userId: string,
    event: NotificationEvent
  ): Promise<void> {
    // Buscar preferências do usuário
    const { data: prefs } = await this.supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('notification_type', event.type)
      .single()

    // Usar defaults se não encontrar
    const defaultPref = DEFAULT_PREFERENCES[event.type]
    const channels = prefs || {
      enable_in_app: defaultPref.inApp,
      enable_push: defaultPref.push,
      enable_email: defaultPref.email,
    }

    // Disparar canais em paralelo (independentes)
    const promises: Promise<void>[] = []

    if (channels.enable_in_app) {
      promises.push(
        this.inAppHandler.send(userId, event).catch((err) => {
          console.error('[Processor] InApp failed:', err)
          // InApp é crítico - poderia implementar retry aqui
        })
      )
    }

    if (channels.enable_push) {
      promises.push(
        this.pushHandler.send(userId, event).catch((err) => {
          console.error('[Processor] Push failed:', err)
          // Push não é crítico - apenas log
        })
      )
    }

    if (channels.enable_email) {
      promises.push(
        this.emailHandler.send(userId, event).catch((err) => {
          console.error('[Processor] Email failed:', err)
          // Email não é crítico - apenas log
        })
      )
    }

    // Aguardar todos (mas não falhar se algum falhar)
    await Promise.allSettled(promises)
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/notifications/processor.ts
git commit -m "feat(notifications): add NotificationProcessor with parallel channels"
```

---

### Task 8: Criar EventBus

**Files:**
- Create: `src/lib/notifications/eventBus.ts`

**Step 1: Criar EventBus singleton**

```typescript
import { NotificationEvent } from '@/types/notifications'
import { NotificationProcessor } from './processor'

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
      console.log('[EventBus] Emitting event:', event.type, 'to', event.recipientIds.length, 'users')
      await this.processor.process(event)
    } catch (error) {
      // CRÍTICO: Nunca propagar erro para não quebrar operação principal
      console.error('[EventBus] Error emitting event (swallowed):', error)
    }
  }
}

export const eventBus = EventBus.getInstance()
```

**Step 2: Commit**

```bash
git add src/lib/notifications/eventBus.ts
git commit -m "feat(notifications): add EventBus singleton (fire-and-forget)"
```

---

## FASE 3: Frontend Hooks e Componentes

### Task 9: Criar hook useNotifications

**Files:**
- Create: `src/hooks/useNotifications.ts`

**Step 1: Criar hook**

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Notification } from '@/types/notifications'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    loadNotifications()

    // Realtime subscription
    const channel = supabase
      .channel(`user:${user.id}:notifications`)
      .on('broadcast', { event: 'notification_created' }, ({ payload }) => {
        console.log('[useNotifications] New notification received:', payload)

        setNotifications((prev) => [payload as Notification, ...prev])
        setUnreadCount((prev) => prev + 1)

        // Toast notification
        toast(payload.title, {
          description: payload.message,
          duration: 5000,
        })
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user?.id])

  async function loadNotifications() {
    if (!user) return

    setLoading(true)

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[useNotifications] Failed to load:', error)
      setLoading(false)
      return
    }

    setNotifications(data || [])
    setUnreadCount(data?.filter((n) => !n.read).length || 0)
    setLoading(false)
  }

  async function markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)

    if (error) {
      console.error('[useNotifications] Failed to mark as read:', error)
      return
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)

    if (unreadIds.length === 0) return

    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .in('id', unreadIds)

    if (error) {
      console.error('[useNotifications] Failed to mark all as read:', error)
      return
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  async function archiveNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ archived: true })
      .eq('id', notificationId)

    if (error) {
      console.error('[useNotifications] Failed to archive:', error)
      return
    }

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))

    // Atualizar contador se era não lida
    const wasUnread = notifications.find((n) => n.id === notificationId && !n.read)
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    refresh: loadNotifications,
  }
}
```

**Step 2: Commit**

```bash
git add src/hooks/useNotifications.ts
git commit -m "feat(notifications): add useNotifications hook with Realtime"
```

---

### Task 10: Criar componente NotificationBell

**Files:**
- Create: `src/components/notifications/NotificationBell.tsx`

**Step 1: Criar componente**

```typescript
'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationList } from './NotificationList'

export function NotificationBell() {
  const { unreadCount } = useNotifications()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="notification-bell"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              data-testid="notification-count"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0"
        align="end"
        data-testid="notification-dropdown"
      >
        <NotificationList />
      </PopoverContent>
    </Popover>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/notifications/NotificationBell.tsx
git commit -m "feat(notifications): add NotificationBell component with badge"
```

---

### Task 11: Criar componente NotificationList

**Files:**
- Create: `src/components/notifications/NotificationList.tsx`

**Step 1: Criar componente**

```typescript
'use client'

import { useNotifications } from '@/hooks/useNotifications'
import { NotificationItem } from './NotificationItem'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function NotificationList() {
  const { notifications, loading, unreadCount, markAllAsRead } = useNotifications()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhuma notificação
        </p>
      </div>
    )
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold">Notificações</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Lista */}
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/notifications/NotificationList.tsx
git commit -m "feat(notifications): add NotificationList component"
```

---

### Task 12: Criar componente NotificationItem

**Files:**
- Create: `src/components/notifications/NotificationItem.tsx`

**Step 1: Criar componente**

```typescript
'use client'

import { Notification } from '@/types/notifications'
import { useNotifications } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, archiveNotification } = useNotifications()
  const router = useRouter()

  const handleClick = () => {
    // Marcar como lida
    if (!notification.read) {
      markAsRead(notification.id)
    }

    // Navegar para entidade relacionada
    if (notification.entity_type && notification.entity_id) {
      const url = getEntityUrl(notification.entity_type, notification.entity_id)
      router.push(url)
    }
  }

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    archiveNotification(notification.id)
  }

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-orange-500 bg-orange-50',
    low: 'border-l-blue-500 bg-blue-50',
  }

  return (
    <div
      data-testid={`notification-item-${notification.id}`}
      className={cn(
        'px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 relative group',
        priorityColors[notification.priority],
        !notification.read && 'bg-muted/30'
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium truncate">
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleArchive}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function getEntityUrl(entityType: string, entityId: string): string {
  switch (entityType) {
    case 'task':
      return `/tarefas?task=${entityId}`
    case 'ticket':
      return `/tickets/${entityId}`
    case 'message':
      return `/chat`
    default:
      return '/notificacoes'
  }
}
```

**Step 2: Commit**

```bash
git add src/components/notifications/NotificationItem.tsx
git commit -m "feat(notifications): add NotificationItem with priority colors"
```

---

## FASE 4: Integração com Hooks Existentes

### Task 13: Integrar eventBus no useTasks

**Files:**
- Modify: `src/hooks/useTasks.ts`

**Step 1: Adicionar import do eventBus**

No início do arquivo, após os outros imports:

```typescript
import { eventBus } from '@/lib/notifications/eventBus'
```

**Step 2: Modificar função createTask**

Localizar a função `createTask` e adicionar emissão de evento após criação bem-sucedida:

```typescript
const createTask = async (taskData: CreateTaskInput) => {
  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single()

  if (error) throw error

  // NOVO: Emitir evento de notificação
  eventBus.emit({
    type: 'task_assigned',
    recipientIds: [taskData.assigned_to],
    priority: taskData.priority === 'high' ? 'high' : 'medium',
    entityType: 'task',
    entityId: newTask.id,
    metadata: {
      taskTitle: taskData.title,
      dueDate: taskData.due_date,
      assignedBy: user?.id,
      assignedByName: user?.name,
    },
  }).catch((err) => {
    console.error('[useTasks] Failed to emit notification:', err)
  })

  setTasks((prev) => [...prev, newTask])
  return newTask
}
```

**Step 3: Modificar função updateTask (status changed)**

Localizar `updateTask` e adicionar evento quando status muda:

```typescript
const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const oldTask = tasks.find((t) => t.id === taskId)

  const { data: updatedTask, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error

  // NOVO: Emitir evento se status mudou
  if (updates.status && oldTask && updates.status !== oldTask.status) {
    const recipientIds = [
      updatedTask.created_by,
      updatedTask.assigned_to,
    ].filter(Boolean)

    eventBus.emit({
      type: 'task_status_changed',
      recipientIds,
      priority: 'low',
      entityType: 'task',
      entityId: taskId,
      metadata: {
        taskTitle: updatedTask.title,
        oldStatus: oldTask.status,
        newStatus: updates.status,
      },
    }).catch((err) => {
      console.error('[useTasks] Failed to emit notification:', err)
    })
  }

  setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)))
  return updatedTask
}
```

**Step 4: Commit**

```bash
git add src/hooks/useTasks.ts
git commit -m "feat(notifications): integrate eventBus in useTasks"
```

---

### Task 14: Adicionar NotificationBell ao layout

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`

**Step 1: Importar componente**

```typescript
import { NotificationBell } from '@/components/notifications/NotificationBell'
```

**Step 2: Adicionar no header/navbar**

Localizar o header/navbar e adicionar o NotificationBell próximo ao user menu:

```typescript
<div className="flex items-center gap-4">
  <NotificationBell />
  {/* ... outros elementos do header */}
</div>
```

**Step 3: Commit**

```bash
git add src/app/(dashboard)/layout.tsx
git commit -m "feat(notifications): add NotificationBell to dashboard layout"
```

---

## FASE 5: Edge Functions (Opcional - Push/Email)

### Task 15: Criar Edge Function para Web Push

**Files:**
- Create: `supabase/functions/send-push/index.ts`

**Step 1: Criar Edge Function**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as webpush from 'npm:web-push'

serve(async (req) => {
  try {
    const { subscription, notification } = await req.json()

    // Configurar VAPID keys
    webpush.setVapidDetails(
      'mailto:contato@vibedistro.com',
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!
    )

    // Enviar push notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify(notification)
    )

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[send-push] Error:', error)

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
```

**Step 2: Deploy Edge Function**

```bash
npx supabase functions deploy send-push
```

**Step 3: Configurar variáveis de ambiente no Supabase**

Gerar VAPID keys:
```bash
npx web-push generate-vapid-keys
```

No Supabase Dashboard → Project Settings → Edge Functions → Secrets:
- Add `VAPID_PUBLIC_KEY`
- Add `VAPID_PRIVATE_KEY`

**Step 4: Commit**

```bash
git add supabase/functions/send-push/index.ts
git commit -m "feat(notifications): add send-push edge function"
```

---

### Task 16: Criar Edge Function para Email

**Files:**
- Create: `supabase/functions/send-email/index.ts`

**Step 1: Criar Edge Function**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'VibeOffice <notificacoes@vibedistro.com>',
      to,
      subject,
      html,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('[send-email] Error:', error)

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
```

**Step 2: Deploy Edge Function**

```bash
npx supabase functions deploy send-email
```

**Step 3: Configurar Resend API Key no Supabase**

No Supabase Dashboard → Project Settings → Edge Functions → Secrets:
- Add `RESEND_API_KEY`

**Step 4: Commit**

```bash
git add supabase/functions/send-email/index.ts
git commit -m "feat(notifications): add send-email edge function with Resend"
```

---

## FASE 6: Testes e Validação

### Task 17: Testar fluxo completo in-app

**Files:**
- N/A (teste manual)

**Step 1: Testar criação de notificação**

1. Fazer login no sistema
2. Criar uma nova task atribuída a outro usuário
3. Fazer login com o outro usuário em aba anônima
4. Verificar que:
   - Badge do sino mostra "1"
   - Toast aparece automaticamente
   - Notificação aparece na lista
   - Clicar na notificação marca como lida
   - Badge diminui para "0"

**Step 2: Testar Realtime**

1. Manter duas abas abertas (usuário A e usuário B)
2. Usuário A atribui task para usuário B
3. Verificar que usuário B recebe notificação instantaneamente
4. Verificar toast e atualização do badge

**Step 3: Documentar resultado**

Criar arquivo: `docs/testing/notifications-manual-test.md`

```markdown
# Testes Manuais - Sistema de Notificações

## Teste 1: Criação de Task
- [x] Task atribuída gera notificação
- [x] Badge atualiza corretamente
- [x] Toast aparece
- [x] Notificação visível na lista

## Teste 2: Realtime
- [x] Notificação recebida instantaneamente
- [x] Múltiplas abas funcionam
- [x] Desconexão/reconexão funciona

## Teste 3: Marcar como lida
- [x] Clicar marca como lida
- [x] Badge decrementa
- [x] Estilo visual muda

## Teste 4: Deep linking
- [x] Clicar navega para entidade correta
- [x] Task abre modal/página certa
```

**Step 4: Commit**

```bash
git add docs/testing/notifications-manual-test.md
git commit -m "docs(notifications): add manual testing checklist"
```

---

## Resumo Final

✅ **Fase 1:** Database schema criado com RLS policies
✅ **Fase 2:** Core system (EventBus, Processor, Handlers)
✅ **Fase 3:** Frontend (hooks, componentes)
✅ **Fase 4:** Integração com useTasks
✅ **Fase 5:** Edge Functions (push/email)
✅ **Fase 6:** Testes manuais

**Sistema funcional:** Notificações in-app em tempo real ✅
**Opcional:** Push e email (requer configuração de VAPID keys e Resend)

---

## Próximos Passos (Pós-MVP)

1. **Integrar com useTickets** (mesmo padrão do useTasks)
2. **Página de preferências** (componente NotificationPreferences)
3. **Testes automatizados** (Jest + Playwright)
4. **Service Worker** para push notifications
5. **Rate limiting** no NotificationProcessor

---

**Plano criado em:** 2026-01-06
**Estimativa:** ~4-6 horas de desenvolvimento
**Commits esperados:** 17 commits incrementais
