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
