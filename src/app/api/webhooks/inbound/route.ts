import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { sendEmail, candidateNotificationEmail } from "@/lib/email";

// Inbound email webhook — handles hiring manager replies
// The reply-to address format: reply+{outreachId}@quietly.app
// Your email provider forwards inbound mail to this endpoint

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract outreach ID from the reply-to address
    // Adapt this parsing to your email provider's webhook format
    const to: string = body.to || body.recipient || "";
    const outreachIdMatch = to.match(/reply\+([a-f0-9-]+)@/i);

    if (!outreachIdMatch) {
      return NextResponse.json({ error: "No outreach ID in recipient" }, { status: 400 });
    }

    const outreachId = outreachIdMatch[1];
    const messageText = body.text || body.body || body["stripped-text"] || "";

    const supabase = getServerSupabase();

    // Find the outreach entry
    const { data: outreach, error: fetchErr } = await supabase
      .from("outreach_log")
      .select("*, matches(*)")
      .eq("id", outreachId)
      .single();

    if (fetchErr || !outreach) {
      console.error("Outreach not found:", outreachId);
      return NextResponse.json({ error: "Outreach not found" }, { status: 404 });
    }

    // Build response summary (first 500 chars)
    const responseSummary = messageText.slice(0, 500);

    // Update outreach status
    await supabase
      .from("outreach_log")
      .update({
        status: "responded",
        responded_at: new Date().toISOString(),
        response_summary: responseSummary,
      })
      .eq("id", outreachId);

    // Update match status
    await supabase
      .from("matches")
      .update({ status: "responded" })
      .eq("id", outreach.match_id);

    // Notify the candidate
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", outreach.user_id)
      .single();

    if (profile?.email) {
      const match = outreach.matches;
      const notification = candidateNotificationEmail(
        profile.full_name || "there",
        match?.title || "a role",
        match?.company || "a company",
        responseSummary
      );
      notification.to = profile.email;
      await sendEmail(notification);
    }

    return NextResponse.json({ success: true, outreachId });
  } catch (err) {
    console.error("Inbound webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
