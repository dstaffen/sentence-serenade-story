
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TurnNotificationRequest {
  gameId: string;
  participantEmail: string;
  participantId: string;
  gameTitle: string;
  previousSentence: string;
  turnNumber: number;
  maxParticipants: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      gameId, 
      participantEmail, 
      participantId, 
      gameTitle, 
      previousSentence, 
      turnNumber, 
      maxParticipants 
    }: TurnNotificationRequest = await req.json();

    // Use the frontend application URL instead of Supabase URL
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://lovable.dev";
    const participationLink = `${frontendUrl}/game/${gameId}/${participantId}`;

    const emailResponse = await resend.emails.send({
      from: "Exquisite Corpse <onboarding@resend.dev>",
      to: [participantEmail],
      subject: `Your turn in "${gameTitle}" - Collaborative Story`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">📖 Your Turn!</h1>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e293b; margin-top: 0;">"${gameTitle}"</h2>
            <p style="color: #64748b;">Turn ${turnNumber} of ${maxParticipants}</p>
          </div>

          <div style="background: #f1f5f9; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-style: italic; color: #475569;">
              "${previousSentence}"
            </p>
          </div>

          <p style="color: #1e293b;">
            It's your turn to continue the story! Click the button below to add your sentence and keep the narrative flowing.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${participationLink}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Continue the Story
            </a>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              💡 <strong>Tip:</strong> Build naturally on the previous sentence and add intrigue or surprise for the next writer!
            </p>
          </div>

          <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 40px;">
            This is an automated message from Exquisite Corpse collaborative storytelling game.
          </p>
        </div>
      `,
    });

    console.log("Turn notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-turn-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
