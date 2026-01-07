# Página de Preferências de Notificação - Plano de Implementação

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementar página de gerenciamento de preferências de notificação permitindo usuários controlarem 11 tipos de notificações × 3 canais (in-app, push, email).

**Architecture:** Server component carrega preferências do Supabase → Client component com hook customizado gerencia estado e auto-save → 4 CategoryCards renderizam switches agrupados por categoria.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Supabase, shadcn/ui, Tailwind CSS, use-debounce

---

## Task 1: Criar arquivo de metadados

**Files:**
- Create: `vibeoffice/src/lib/notifications/metadata.ts`

**Step 1: Criar arquivo metadata.ts**

```typescript
import { NotificationType } from '@/types/notifications'

export type NotificationCategory = 'tasks' | 'tickets' | 'chat' | 'general'

export interface NotificationMetadata {
  type: NotificationType
  category: NotificationCategory
  label: string
  description: string
  icon: string
  channels: {
    inApp: { enabled: boolean; locked: boolean }
    push: { enabled: boolean; locked: boolean }
    email: { enabled: boolean; locked: boolean }
  }
}

export const NOTIFICATION_METADATA: Record<NotificationType, NotificationMetadata> = {
  // Tasks
  task_assigned: {
    type: 'task_assigned',
    category: 'tasks',
    label: 'Nova task atribuída',
    description: 'Quando você é atribuído a uma nova task',
    icon: '📋',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: false, locked: false },
      email: { enabled: false, locked: false },
    },
  },
  task_status_changed: {
    type: 'task_status_changed',
    category: 'tasks',
    label: 'Status alterado',
    description: 'Quando o status de uma task muda',
    icon: '📋',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: false, locked: false },
      email: { enabled: false, locked: false },
    },
  },
  task_comment_added: {
    type: 'task_comment_added',
    category: 'tasks',
    label: 'Novo comentário',
    description: 'Quando alguém comenta em uma task',
    icon: '📋',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: false, locked: false },
      email: { enabled: false, locked: false },
    },
  },
  task_due_soon: {
    type: 'task_due_soon',
    category: 'tasks',
    label: 'Prazo próximo',
    description: 'Lembrete de tasks com prazo próximo (24h antes)',
    icon: '📋',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: true, locked: false },
      email: { enabled: false, locked: false },
    },
  },

  // Tickets
  ticket_created: {
    type: 'ticket_created',
    category: 'tickets',
    label: 'Novo ticket criado',
    description: 'Quando um novo ticket é criado',
    icon: '🎫',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: false, locked: false },
      email: { enabled: false, locked: false },
    },
  },
  ticket_assigned: {
    type: 'ticket_assigned',
    category: 'tickets',
    label: 'Ticket atribuído',
    description: 'Quando você é atribuído a um ticket',
    icon: '🎫',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: false, locked: false },
      email: { enabled: false, locked: false },
    },
  },
  ticket_status_changed: {
    type: 'ticket_status_changed',
    category: 'tickets',
    label: 'Status alterado',
    description: 'Quando o status de um ticket muda',
    icon: '🎫',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: false, locked: false },
      email: { enabled: false, locked: false },
    },
  },
  ticket_comment_added: {
    type: 'ticket_comment_added',
    category: 'tickets',
    label: 'Novo comentário',
    description: 'Quando alguém comenta em um ticket',
    icon: '🎫',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: false, locked: false },
      email: { enabled: false, locked: false },
    },
  },

  // Chat (CRITICAL: email locked = true)
  message_received: {
    type: 'message_received',
    category: 'chat',
    label: 'Mensagem recebida',
    description: 'Quando você recebe uma mensagem direta',
    icon: '💬',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: false, locked: false },
      email: { enabled: false, locked: true }, // LOCKED
    },
  },
  mentioned_in_chat: {
    type: 'mentioned_in_chat',
    category: 'chat',
    label: 'Menção no chat',
    description: 'Quando alguém menciona você (@usuario)',
    icon: '💬',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: true, locked: false },
      email: { enabled: false, locked: true }, // LOCKED
    },
  },

  // General
  announcement: {
    type: 'announcement',
    category: 'general',
    label: 'Anúncios',
    description: 'Comunicados importantes da empresa',
    icon: '📢',
    channels: {
      inApp: { enabled: true, locked: false },
      push: { enabled: true, locked: false },
      email: { enabled: true, locked: false },
    },
  },
}

export const CATEGORY_LABELS: Record<NotificationCategory, { label: string; icon: string }> = {
  tasks: { label: 'Tasks', icon: '📋' },
  tickets: { label: 'Tickets', icon: '🎫' },
  chat: { label: 'Chat', icon: '💬' },
  general: { label: 'Geral', icon: '📢' },
}

export const CHANNEL_LABELS = {
  inApp: {
    label: 'In-App',
    icon: '📱',
    tooltip: 'Notificações dentro da plataforma (sino no topo)',
  },
  push: {
    label: 'Push',
    icon: '🔔',
    tooltip: 'Notificações do navegador (mesmo fora da aba)',
  },
  email: {
    label: 'Email',
    icon: '📧',
    tooltip: 'Notificações enviadas para seu email',
  },
}

export function getMetadataByCategory(category: NotificationCategory): NotificationMetadata[] {
  return Object.values(NOTIFICATION_METADATA).filter((m) => m.category === category)
}
```

**Step 2: Commit**

```bash
git add vibeoffice/src/lib/notifications/metadata.ts
git commit -m "feat(notifications): add notification metadata with labels and restrictions"
```

---

## Task 2: Criar hook useNotificationPreferences

**Files:**
- Create: `vibeoffice/src/hooks/useNotificationPreferences.ts`

**Step 1: Instalar dependência use-debounce**

Run: `cd vibeoffice && npm install use-debounce`

**Step 2: Criar hook useNotificationPreferences.ts**

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { createClient } from '@/lib/supabase/client'
import { NotificationType, NotificationPreference } from '@/types/notifications'
import { toast } from 'sonner'
import { createDefaultPreferences } from '@/lib/notifications/defaults'

export type ChannelType = 'inApp' | 'push' | 'email'

interface PreferenceState {
  [key: string]: {
    inApp: boolean
    push: boolean
    email: boolean
  }
}

export function useNotificationPreferences(userId: string, initialPreferences: NotificationPreference[]) {
  const [preferences, setPreferences] = useState<PreferenceState>(() => {
    // Convert array to map for easier access
    const map: PreferenceState = {}
    initialPreferences.forEach((pref) => {
      map[pref.notification_type] = {
        inApp: pref.enable_in_app,
        push: pref.enable_push,
        email: pref.enable_email,
      }
    })
    return map
  })

  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const updatePreferenceInDB = useCallback(
    async (type: NotificationType, channel: ChannelType, value: boolean) => {
      setSaving(true)
      try {
        const columnMap = {
          inApp: 'enable_in_app',
          push: 'enable_push',
          email: 'enable_email',
        }

        const { error } = await supabase
          .from('notification_preferences')
          .update({ [columnMap[channel]]: value })
          .eq('user_id', userId)
          .eq('notification_type', type)

        if (error) throw error

        toast.success('Preferência atualizada', {
          description: 'Suas configurações foram salvas com sucesso',
          duration: 2000,
        })
      } catch (error) {
        console.error('[useNotificationPreferences] Error saving:', error)

        // Rollback optimistic update
        setPreferences((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            [channel]: !value, // Revert
          },
        }))

        toast.error('Erro ao salvar preferência', {
          description: 'Suas alterações não foram salvas. Tente novamente.',
          duration: 4000,
        })
      } finally {
        setSaving(false)
      }
    },
    [userId, supabase]
  )

  // Debounced version (300ms)
  const debouncedUpdate = useDebouncedCallback(updatePreferenceInDB, 300)

  const updatePreference = useCallback(
    (type: NotificationType, channel: ChannelType, value: boolean) => {
      // Optimistic update
      setPreferences((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [channel]: value,
        },
      }))

      // Debounced save
      debouncedUpdate(type, channel, value)
    },
    [debouncedUpdate]
  )

  return {
    preferences,
    updatePreference,
    saving,
  }
}
```

**Step 3: Commit**

```bash
git add vibeoffice/src/hooks/useNotificationPreferences.ts vibeoffice/package.json vibeoffice/package-lock.json
git commit -m "feat(notifications): add useNotificationPreferences hook with auto-save"
```

---

## Task 3: Criar componente NotificationCategoryCard

**Files:**
- Create: `vibeoffice/src/components/settings/NotificationCategoryCard.tsx`

**Step 1: Criar componente NotificationCategoryCard.tsx**

```typescript
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { NotificationMetadata, CHANNEL_LABELS } from '@/lib/notifications/metadata'
import { NotificationType } from '@/types/notifications'
import { Info } from 'lucide-react'
import { ChannelType } from '@/hooks/useNotificationPreferences'

interface NotificationCategoryCardProps {
  title: string
  icon: string
  notifications: NotificationMetadata[]
  preferences: Record<string, { inApp: boolean; push: boolean; email: boolean }>
  onToggle: (type: NotificationType, channel: ChannelType, value: boolean) => void
  saving: boolean
}

export function NotificationCategoryCard({
  title,
  icon,
  notifications,
  preferences,
  onToggle,
  saving,
}: NotificationCategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Tipo</TableHead>
              <TableHead className="w-[20%] text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center gap-1 cursor-help">
                        <span>{CHANNEL_LABELS.inApp.icon}</span>
                        <span className="hidden sm:inline">{CHANNEL_LABELS.inApp.label}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{CHANNEL_LABELS.inApp.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="w-[20%] text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center gap-1 cursor-help">
                        <span>{CHANNEL_LABELS.push.icon}</span>
                        <span className="hidden sm:inline">{CHANNEL_LABELS.push.label}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{CHANNEL_LABELS.push.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="w-[20%] text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center gap-1 cursor-help">
                        <span>{CHANNEL_LABELS.email.icon}</span>
                        <span className="hidden sm:inline">{CHANNEL_LABELS.email.label}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{CHANNEL_LABELS.email.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notif) => {
              const pref = preferences[notif.type]
              if (!pref) return null

              return (
                <TableRow key={notif.type}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{notif.label}</div>
                      <div className="text-sm text-muted-foreground">{notif.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={pref.inApp}
                      onCheckedChange={(checked) => onToggle(notif.type, 'inApp', checked)}
                      disabled={notif.channels.inApp.locked || saving}
                      aria-label={`${notif.label} - In-App`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={pref.push}
                      onCheckedChange={(checked) => onToggle(notif.type, 'push', checked)}
                      disabled={notif.channels.push.locked || saving}
                      aria-label={`${notif.label} - Push`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={pref.email}
                        onCheckedChange={(checked) => onToggle(notif.type, 'email', checked)}
                        disabled={notif.channels.email.locked || saving}
                        className={notif.channels.email.locked ? 'opacity-50 cursor-not-allowed' : ''}
                        aria-label={`${notif.label} - Email`}
                      />
                      {notif.channels.email.locked && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mensagens de chat não enviam notificações por email</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Verificar se Tooltip existe, caso contrário instalar**

Run: `cd vibeoffice && npx shadcn@latest add tooltip`

Expected: Tooltip component installed (se já existir, pular)

**Step 3: Commit**

```bash
git add vibeoffice/src/components/settings/NotificationCategoryCard.tsx
git commit -m "feat(notifications): add NotificationCategoryCard component"
```

---

## Task 4: Criar componente NotificationPreferences (principal)

**Files:**
- Create: `vibeoffice/src/components/settings/NotificationPreferences.tsx`

**Step 1: Criar componente NotificationPreferences.tsx**

```typescript
'use client'

import { NotificationPreference } from '@/types/notifications'
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences'
import { NotificationCategoryCard } from './NotificationCategoryCard'
import { getMetadataByCategory, CATEGORY_LABELS } from '@/lib/notifications/metadata'

interface NotificationPreferencesProps {
  userId: string
  initialPreferences: NotificationPreference[]
}

export function NotificationPreferences({ userId, initialPreferences }: NotificationPreferencesProps) {
  const { preferences, updatePreference, saving } = useNotificationPreferences(userId, initialPreferences)

  const categories: Array<keyof typeof CATEGORY_LABELS> = ['tasks', 'tickets', 'chat', 'general']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Preferências de Notificação</h1>
        <p className="text-muted-foreground mt-2">
          Controle como e quando você recebe notificações no VibeOffice
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => {
          const categoryData = CATEGORY_LABELS[category]
          const notifications = getMetadataByCategory(category)

          return (
            <NotificationCategoryCard
              key={category}
              title={categoryData.label}
              icon={categoryData.icon}
              notifications={notifications}
              preferences={preferences}
              onToggle={updatePreference}
              saving={saving}
            />
          )
        })}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add vibeoffice/src/components/settings/NotificationPreferences.tsx
git commit -m "feat(notifications): add NotificationPreferences main component"
```

---

## Task 5: Criar página /settings/notifications

**Files:**
- Create: `vibeoffice/src/app/(dashboard)/settings/notifications/page.tsx`

**Step 1: Criar página page.tsx**

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NotificationPreferences } from '@/components/settings/NotificationPreferences'
import { createDefaultPreferences } from '@/lib/notifications/defaults'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default async function NotificationsSettingsPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Load user preferences
  const { data: preferences, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('[NotificationsPage] Error loading preferences:', error)
  }

  // If user has no preferences, create defaults
  if (!preferences || preferences.length === 0) {
    console.log('[NotificationsPage] Creating default preferences for user:', user.id)
    await createDefaultPreferences(user.id)

    // Reload preferences
    const { data: newPreferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)

    return (
      <div className="container mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Configurações</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notificações</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <NotificationPreferences userId={user.id} initialPreferences={newPreferences || []} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notificações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <NotificationPreferences userId={user.id} initialPreferences={preferences} />
    </div>
  )
}
```

**Step 2: Verificar se Breadcrumb existe, caso contrário instalar**

Run: `cd vibeoffice && npx shadcn@latest add breadcrumb`

Expected: Breadcrumb component installed (se já existir, pular)

**Step 3: Commit**

```bash
git add vibeoffice/src/app/(dashboard)/settings/notifications/page.tsx
git commit -m "feat(notifications): add notification preferences page route"
```

---

## Task 6: Adicionar link na página de Settings

**Files:**
- Modify: `vibeoffice/src/app/(dashboard)/settings/page.tsx`

**Step 1: Ler página de settings atual**

Run: `cat vibeoffice/src/app/(dashboard)/settings/page.tsx` (para entender estrutura)

**Step 2: Adicionar link para /settings/notifications**

Adicione um Card ou Link apontando para `/settings/notifications` com:
- Título: "Notificações"
- Descrição: "Gerencie suas preferências de notificação"
- Ícone: 🔔

**Exemplo (ajustar conforme estrutura existente):**

```typescript
<Link href="/settings/notifications">
  <Card className="hover:bg-accent cursor-pointer">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <span className="text-2xl">🔔</span>
        Notificações
      </CardTitle>
      <CardDescription>
        Gerencie suas preferências de notificação
      </CardDescription>
    </CardHeader>
  </Card>
</Link>
```

**Step 3: Commit**

```bash
git add vibeoffice/src/app/(dashboard)/settings/page.tsx
git commit -m "feat(notifications): add link to notifications settings"
```

---

## Task 7: Testar fluxo completo

**Step 1: Executar build**

Run: `cd vibeoffice && npm run build`
Expected: Build completes without errors

**Step 2: Iniciar dev server**

Run: `cd vibeoffice && npm run dev`

**Step 3: Testes manuais**

1. **Login** no sistema
2. **Navegar** para `/settings`
3. **Clicar** no card "Notificações"
4. **Verificar:**
   - ✅ Breadcrumb exibe "Configurações > Notificações"
   - ✅ 4 cards aparecem (Tasks, Tickets, Chat, Geral)
   - ✅ Cada card mostra os tipos corretos
   - ✅ Switches refletem preferências do banco

5. **Alterar um switch:**
   - Clicar em qualquer switch
   - Verificar que muda imediatamente (optimistic update)
   - Aguardar 300ms
   - Verificar toast: "Preferência atualizada"

6. **Testar restrição de email para chat:**
   - Ir para card "Chat"
   - Verificar que switch de Email está desabilitado
   - Passar mouse sobre ícone ⓘ
   - Verificar tooltip: "Mensagens de chat não enviam notificações por email"

7. **Verificar no banco:**

```sql
SELECT * FROM notification_preferences WHERE user_id = '[seu-user-id]';
```

Expected: Mudanças refletidas no banco de dados

**Step 4: Testar responsividade**

- Desktop (>1024px): 2 colunas
- Tablet/Mobile (<1024px): 1 coluna

**Step 5: Commit se tudo funcionar**

```bash
git add .
git commit -m "test(notifications): verify preferences page functionality"
```

---

## Task 8: Documentação de testes

**Files:**
- Create: `vibeoffice/docs/testing/notification-preferences-test.md`

**Step 1: Criar documento de testes**

```markdown
# Testes - Página de Preferências de Notificação

## Pré-requisitos

- ✅ Usuário logado no sistema
- ✅ Migration de notificações executada
- ✅ Tabela `notification_preferences` criada

## Testes Funcionais

### 1. Carregamento Inicial

**Cenário 1: Usuário com preferências existentes**
- Navegar para `/settings/notifications`
- Verificar que preferências são carregadas do banco
- Switches refletem estado correto

**Cenário 2: Usuário novo (sem preferências)**
- Criar novo usuário
- Navegar para `/settings/notifications`
- Verificar que defaults são criados automaticamente
- Switches mostram valores default (conforme `defaults.ts`)

### 2. Auto-Save

**Test:** Alterar switch e verificar salvamento
1. Clicar em qualquer switch (ex: task_assigned → Push)
2. Verificar mudança imediata na UI (optimistic)
3. Aguardar 300ms
4. Verificar toast: "Preferência atualizada"
5. Verificar no banco que mudança foi salva

**Test:** Múltiplas mudanças rápidas
1. Clicar em 3 switches diferentes rapidamente (< 300ms entre cliques)
2. Aguardar 600ms
3. Verificar que apenas últimas mudanças foram salvas (debounce)

### 3. Restrições de Canal

**Test:** Chat não pode ter email
1. Ir para card "Chat"
2. Verificar que switches de Email estão desabilitados
3. Verificar que são visualmente diferentes (opacity-50)
4. Passar mouse sobre ícone ⓘ
5. Verificar tooltip: "Mensagens de chat não enviam notificações por email"
6. Tentar clicar → nada acontece (disabled)

### 4. Tratamento de Erros

**Test:** Simular falha de rede
1. Desabilitar conexão (DevTools → Network → Offline)
2. Alterar um switch
3. Verificar toast de erro
4. Verificar que switch reverte ao estado anterior (rollback)

### 5. Responsividade

**Desktop (>1024px):**
- Grid com 2 colunas
- Cards lado a lado

**Mobile (<1024px):**
- Grid com 1 coluna
- Cards empilhados verticalmente

### 6. Acessibilidade

**Teclado:**
- Tab navega entre switches
- Enter/Space ativa switch
- Tooltips aparecem com foco

**Screen Reader:**
- Labels descritivos em cada switch
- Aria-labels presentes

## Queries SQL para Debug

```sql
-- Ver preferências de um usuário
SELECT * FROM notification_preferences WHERE user_id = '[user-id]';

-- Contar preferências (deve ser 11)
SELECT COUNT(*) FROM notification_preferences WHERE user_id = '[user-id]';

-- Ver preferências de email para chat (devem ser false)
SELECT notification_type, enable_email
FROM notification_preferences
WHERE user_id = '[user-id]'
AND notification_type IN ('message_received', 'mentioned_in_chat');
```

## Checklist Final

- [ ] Página carrega sem erros
- [ ] 4 cards aparecem corretamente
- [ ] Breadcrumb funciona
- [ ] Switches refletem estado do banco
- [ ] Auto-save funciona (toast aparece)
- [ ] Email desabilitado para chat
- [ ] Tooltip explica restrição
- [ ] Responsivo em mobile
- [ ] Navegação por teclado funciona
- [ ] Erros tratados com rollback
```

**Step 2: Commit**

```bash
git add vibeoffice/docs/testing/notification-preferences-test.md
git commit -m "docs(notifications): add testing guide for preferences page"
```

---

## Checklist de Implementação

- [ ] Task 1: Metadata criado com labels e restrições
- [ ] Task 2: Hook useNotificationPreferences com auto-save
- [ ] Task 3: NotificationCategoryCard component
- [ ] Task 4: NotificationPreferences component principal
- [ ] Task 5: Página /settings/notifications criada
- [ ] Task 6: Link adicionado em /settings
- [ ] Task 7: Testes manuais completos e funcionando
- [ ] Task 8: Documentação de testes criada

---

## Próximos Passos (Opcional - V2)

1. **Skeleton loading states**
   - Adicionar Skeleton para loading inicial
   - Melhorar UX durante carregamento

2. **Retry automático em falhas**
   - Implementar exponential backoff
   - 3 tentativas antes de desistir

3. **Página de settings melhorada**
   - Design mais moderno para lista de configurações
   - Grid de cards para cada seção

4. **Analytics**
   - Rastrear quais preferências são mais alteradas
   - Identificar padrões de uso
