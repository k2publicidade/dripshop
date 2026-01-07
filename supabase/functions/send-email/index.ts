import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // CRITICAL: Never send email for chat events
    const chatEventTypes = ['message_received', 'mentioned_in_chat']
    if (chatEventTypes.includes(notification.type)) {
      console.log('[send-email] Skipping email for chat event:', notification.type)
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: 'Chat events do not send emails' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Get user details
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
      notification.user_id
    )

    if (userError || !userData.user) {
      console.error('[send-email] Error fetching user:', userError)
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userEmail = userData.user.email
    if (!userEmail) {
      console.log('[send-email] User has no email address:', notification.user_id)
      return new Response(JSON.stringify({ success: true, sent: false, reason: 'No email address' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('[send-email] RESEND_API_KEY not configured')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build email HTML
    const html = generateEmailHtml(notification)

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'VibeOffice <notificacoes@vibedistro.com>',
        to: [userEmail],
        subject: notification.title,
        html,
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('[send-email] Resend API error:', resendData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: resendData }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('[send-email] Email sent successfully:', resendData.id)

    return new Response(
      JSON.stringify({
        success: true,
        sent: true,
        email_id: resendData.id,
        recipient: userEmail,
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
    console.error('[send-email] Unexpected error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

/**
 * Generate HTML email template
 */
function generateEmailHtml(notification: any): string {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f97316',
    low: '#3b82f6',
  }

  const priorityLabels = {
    high: 'Alta Prioridade',
    medium: 'Prioridade Média',
    low: 'Prioridade Baixa',
  }

  const color = priorityColors[notification.priority as keyof typeof priorityColors] || '#6b7280'
  const priorityLabel = priorityLabels[notification.priority as keyof typeof priorityLabels] || ''

  // Build action button
  let actionButton = ''
  if (notification.entity_type && notification.entity_id) {
    const baseUrl = Deno.env.get('APP_URL') || 'https://vibeoffice.vibedistro.com'
    const url = `${baseUrl}/${notification.entity_type}s/${notification.entity_id}`

    actionButton = `
      <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
        <tr>
          <td style="background-color: ${color}; border-radius: 6px; text-align: center;">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
              Ver Detalhes
            </a>
          </td>
        </tr>
      </table>
    `
  }

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${notification.title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

              <!-- Header with priority bar -->
              <tr>
                <td style="background-color: ${color}; height: 6px;"></td>
              </tr>

              <!-- Logo/Brand -->
              <tr>
                <td style="padding: 30px 40px 20px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">
                    VibeOffice
                  </h1>
                </td>
              </tr>

              <!-- Priority Badge -->
              <tr>
                <td style="padding: 0 40px;">
                  <span style="display: inline-block; background-color: ${color}; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${priorityLabel}
                  </span>
                </td>
              </tr>

              <!-- Title -->
              <tr>
                <td style="padding: 20px 40px 10px;">
                  <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">
                    ${notification.title}
                  </h2>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 10px 40px 20px;">
                  <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                    ${notification.message}
                  </p>
                </td>
              </tr>

              <!-- Action Button -->
              ${actionButton ? `
              <tr>
                <td style="padding: 0 40px;">
                  ${actionButton}
                </td>
              </tr>
              ` : ''}

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">
                    Você está recebendo esta notificação porque está inscrito no sistema VibeOffice.
                  </p>
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    Para gerenciar suas preferências de notificação, <a href="${Deno.env.get('APP_URL') || 'https://vibeoffice.vibedistro.com'}/settings/notifications" style="color: ${color}; text-decoration: none;">clique aqui</a>.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
