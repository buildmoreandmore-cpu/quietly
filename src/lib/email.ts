// Email abstraction — provider-agnostic
// Swap the sendEmail implementation when you pick a provider (Resend, SES, Composio, etc.)

export interface EmailMessage {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// --- Provider implementation ---
// Currently logs to console. Replace with your email provider.

export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  // TODO: Replace with actual email provider
  // Examples:
  //   Resend:   await resend.emails.send(message)
  //   Composio: await composio.tools.execute("GMAIL_SEND_EMAIL", { ... })
  //   SES:      await ses.sendEmail(message)

  console.log("[EMAIL STUB] Would send:", {
    to: message.to,
    subject: message.subject,
    from: message.from,
  });

  // Return success so the rest of the pipeline continues
  return {
    success: true,
    messageId: `stub-${Date.now()}`,
  };
}

// --- Email templates ---

export function outreachEmail(
  subject: string,
  messageBody: string,
  replyToAddress: string
): EmailMessage {
  return {
    to: "", // Set by caller (hiring manager email)
    from: "Quietly <outreach@quietly.app>",
    replyTo: replyToAddress,
    subject,
    html: `<div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
      ${messageBody.split("\n").map((p) => `<p style="margin: 0 0 12px;">${p}</p>`).join("")}
    </div>`,
    text: messageBody,
  };
}

export function candidateNotificationEmail(
  candidateName: string,
  jobTitle: string,
  company: string,
  responseSummary: string
): EmailMessage {
  return {
    to: "", // Set by caller
    from: "Quietly <notifications@quietly.app>",
    subject: `Someone wants to talk — ${jobTitle} at ${company}`,
    html: `<div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
      <p>Hey ${candidateName.split(" ")[0]},</p>
      <p>A hiring manager at <strong>${company}</strong> responded to our outreach about the <strong>${jobTitle}</strong> role.</p>
      <p style="background: #f7f5f2; padding: 16px; border-radius: 8px; border-left: 3px solid #6366f1;">
        ${responseSummary}
      </p>
      <p>Log in to your dashboard to review and respond.</p>
      <p style="margin-top: 24px;">— Quietly</p>
    </div>`,
    text: `Hey ${candidateName.split(" ")[0]}, a hiring manager at ${company} responded about the ${jobTitle} role. "${responseSummary}" Log in to your dashboard to review.`,
  };
}
