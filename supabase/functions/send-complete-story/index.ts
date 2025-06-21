
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CompleteStoryRequest {
  gameId: string;
  gameTitle: string;
  sentences: Array<{
    sentence_text: string;
    turn_number: number;
    participant_email: string;
  }>;
  participantEmails: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      gameId, 
      gameTitle, 
      sentences, 
      participantEmails 
    }: CompleteStoryRequest = await req.json();

    // Sort sentences by turn number to ensure correct order
    const sortedSentences = sentences.sort((a, b) => a.turn_number - b.turn_number);
    
    // Create the complete story text
    const completeStory = sortedSentences.map(s => s.sentence_text).join(' ');
    
    // Create the story with attribution
    const storyWithAttribution = sortedSentences.map((s, index) => 
      `<p style="margin: 10px 0; line-height: 1.6;"><strong>Turn ${index + 1}:</strong> ${s.sentence_text}</p>`
    ).join('');

    const emailPromises = participantEmails.map(email => 
      resend.emails.send({
        from: "Exquisite Corpse <onboarding@resend.dev>",
        to: [email],
        subject: `"${gameTitle}" - Complete Story Revealed! 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">🎉 Story Complete!</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h2 style="color: #1e293b; margin-top: 0;">"${gameTitle}"</h2>
              <p style="color: #64748b;">A collaborative creation by ${participantEmails.length} writers</p>
            </div>

            <div style="background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">The Complete Story</h3>
              <div style="font-size: 16px; line-height: 1.8; color: #374151; font-style: italic;">
                ${completeStory}
              </div>
            </div>

            <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">Story Breakdown by Turn</h3>
              ${storyWithAttribution}
            </div>

            <div style="background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="margin: 0; color: #047857; text-align: center;">
                <strong>🎊 Congratulations!</strong><br>
                You've successfully created a collaborative masterpiece together!
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #64748b;">Want to create another story?</p>
              <a href="${Deno.env.get("SUPABASE_URL")?.replace('/auth/v1', '')}/" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Start New Game
              </a>
            </div>

            <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 40px;">
              This is an automated message from Exquisite Corpse collaborative storytelling game.
            </p>
          </div>
        `,
      })
    );

    const emailResults = await Promise.allSettled(emailPromises);
    
    const successCount = emailResults.filter(result => result.status === 'fulfilled').length;
    const failureCount = emailResults.filter(result => result.status === 'rejected').length;

    console.log(`Complete story emails sent: ${successCount} successful, ${failureCount} failed`);

    return new Response(JSON.stringify({
      success: true,
      emailsSent: successCount,
      emailsFailed: failureCount
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-complete-story function:", error);
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
