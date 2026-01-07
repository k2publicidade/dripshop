import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Web Push library for VAPID authentication
// @ts-ignore
import * as webpush from 'npm:web-push'

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    const { notification_id } = await req.json()

    if (!notification_id) {
      return new Response(JSON.stringify({ error: 'notification_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get notification details
    const { data: notification, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notification_id)
      .single()

    if (notifError || !notification) {
      return new Response(JSON.stringify({ error: 'Notification not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get user's push subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', notification.user_id)

    if (subsError) {
      console.error('[send-push] Error fetching subscriptions:', subsError)
      return new Response(JSON.stringify({ error: 'Failed to fetch subscriptions' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[send-push] No push subscriptions found for user:', notification.user_id)
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No subscriptions' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Configure VAPID
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('[send-push] VAPID keys not configured')
      return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    webpush.setVapidDetails(
      'mailto:contato@vibedistro.com',
      vapidPublicKey,
      vapidPrivateKey
    )

    // Prepare notification payload
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.message,
      icon: '/logo.png',
      badge: '/badge.png',
      tag: notification.id,
      data: {
        notificationId: notification.id,
        entityType: notification.entity_type,
        entityId: notification.entity_id,
        url: notification.entity_type && notification.entity_id
          ? `/${notification.entity_type}s/${notification.entity_id}`
          : '/notifications',
      },
    })

    // Send to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          )

          // Update last_used_at
          await supabase
            .from('push_subscriptions')
            .update({ last_used_at: new Date().toISOString() })
            .eq('id', sub.id)

          return { success: true, subscription_id: sub.id }
        } catch (error: any) {
          console.error('[send-push] Error sending to subscription:', sub.id, error)

          // If subscription is invalid (410 Gone), delete it
          if (error.statusCode === 410) {
            console.log('[send-push] Deleting invalid subscription:', sub.id)
            await supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }

          return { success: false, subscription_id: sub.id, error: error.message }
        }
      })
    )

    const successCount = results.filter((r) => r.status === 'fulfilled' && r.value.success).length
    const failureCount = results.length - successCount

    console.log(`[send-push] Sent ${successCount}/${results.length} notifications for notification_id=${notification_id}`)

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        failed: failureCount,
        total: results.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error: any) {
    console.error('[send-push] Unexpected error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
