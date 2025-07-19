import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log("GetResponse API function started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, apiKey, listId, emails } = await req.json()
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const baseHeaders = {
      'X-Auth-Token': `api-key ${apiKey}`,
      'Content-Type': 'application/json',
    }

    let response
    let result

    switch (action) {
      case 'getCampaigns':
        response = await fetch('https://api.getresponse.com/v3/campaigns', {
          method: 'GET',
          headers: baseHeaders,
        })
        result = await response.json()
        break

      case 'addContacts':
        if (!listId || !emails || !Array.isArray(emails)) {
          return new Response(
            JSON.stringify({ error: 'List ID and emails array are required for adding contacts' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        const contactPromises = emails.map(email => 
          fetch('https://api.getresponse.com/v3/contacts', {
            method: 'POST',
            headers: baseHeaders,
            body: JSON.stringify({
              email: email,
              campaign: {
                campaignId: listId
              }
            })
          })
        )

        const results = await Promise.allSettled(contactPromises)
        const successful = results.filter(result => 
          result.status === 'fulfilled' && result.value.ok
        ).length

        result = {
          total: emails.length,
          successful,
          failed: emails.length - successful
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

    if (!response || !response.ok) {
      throw new Error(`GetResponse API error: ${response?.status} ${response?.statusText}`)
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in GetResponse API function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})