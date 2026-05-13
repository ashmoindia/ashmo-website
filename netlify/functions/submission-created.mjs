import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const emailShell = ({ eyebrow, heading, body, footer }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0; padding:0; background-color:#070711; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#070711; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#10111d; border-radius:20px; border:1px solid rgba(255,255,255,0.12);">
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 24px; color:#f1b284; font-family:ui-monospace, SFMono-Regular, Consolas, monospace; font-size:12px; letter-spacing:0.08em; text-transform:uppercase;">${eyebrow}</p>
              <h1 style="margin:0 0 20px; color:#f8fafc; font-size:26px; font-weight:700; line-height:1.2;">${heading}</h1>
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px; border-top:1px solid rgba(255,255,255,0.1);">
              <p style="margin:0; color:#8b8ea3; font-size:13px; line-height:1.6;">
                ${footer}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const buildContactReply = ({ formName, name, message }) => {
  const isGrowthAudit = formName === 'restaurant-growth-audit';
  const heading = isGrowthAudit
    ? `Thanks for the growth context, ${escapeHtml(name)}.`
    : `Thanks for reaching out, ${escapeHtml(name)}.`;
  const intro = isGrowthAudit
    ? "I've received your growth audit request and the commercial context you shared. I'll review it and come back with the clearest next step."
    : "I've received your message and appreciate you taking the time to write. I'll get back to you as soon as I can, usually within a day or two.";

  return {
    subject: isGrowthAudit ? 'Growth request received - Ashmo' : 'Thanks for reaching out - Ashmo',
    html: emailShell({
      eyebrow: isGrowthAudit ? 'Ashmo Growth Systems' : 'Ashmo',
      heading,
      body: `
        <p style="margin:0 0 16px; color:#c7c8d5; font-size:16px; font-weight:300; line-height:1.65;">
          ${intro}
        </p>
        <p style="margin:0 0 28px; color:#c7c8d5; font-size:16px; font-weight:300; line-height:1.65;">
          In the meantime, the best place to keep reading is <a href="https://ashmo.io/thinking/" style="color:#f1b284; text-decoration:none;">ashmo.io/thinking</a>.
        </p>
        ${message ? `
          <hr style="border:none; border-top:1px solid rgba(255,255,255,0.1); margin:28px 0;">
          <p style="margin:0 0 8px; color:#8b8ea3; font-size:13px;">Your message:</p>
          <p style="margin:0; color:#a1a1aa; font-size:14px; font-style:italic; line-height:1.55; padding:14px 16px; background-color:#070711; border-radius:12px;">"${escapeHtml(message)}"</p>
        ` : ''}
      `,
      footer: `Ashmo - Founder, Brand Builder, Writer<br>
        <a href="https://ashmo.io" style="color:#f1b284; text-decoration:none;">ashmo.io</a> · <a href="https://linkedin.com/in/iamashmo" style="color:#f1b284; text-decoration:none;">LinkedIn</a> · <a href="https://instagram.com/iam_ashmo" style="color:#f1b284; text-decoration:none;">Instagram</a>`,
    }),
  };
};

const buildNewsletterReply = () => ({
  subject: "You're on the Ashmo notes list",
  html: emailShell({
    eyebrow: 'Ashmo Notes',
    heading: "You're on the list.",
    body: `
      <p style="margin:0 0 16px; color:#c7c8d5; font-size:16px; font-weight:300; line-height:1.65;">
        Thanks for subscribing. I'll send useful notes when there is something worth sending: brand growth, AI workflows, restaurant strategy, and operator-level thinking.
      </p>
      <p style="margin:0; color:#c7c8d5; font-size:16px; font-weight:300; line-height:1.65;">
        A good starting point is the thinking archive: <a href="https://ashmo.io/thinking/" style="color:#f1b284; text-decoration:none;">ashmo.io/thinking</a>.
      </p>
    `,
    footer: `You subscribed at <a href="https://ashmo.io" style="color:#f1b284; text-decoration:none;">ashmo.io</a>.`,
  }),
});

export default async (req) => {
  const { payload } = await req.json();
  const data = payload?.data ?? {};
  const formName = payload?.form_name || data['form-name'] || 'contact';
  const email = data.email?.trim();
  const name = data.name?.trim() || 'there';
  const message = data.message?.trim() || '';

  if (!email) {
    return new Response('No email provided', { status: 400 });
  }

  const reply = formName === 'newsletter'
    ? buildNewsletterReply()
    : buildContactReply({ formName, name, message });

  try {
    await resend.emails.send({
      from: 'Ashmo <hello@ashmo.io>',
      to: email,
      subject: reply.subject,
      html: reply.html,
    });

    return new Response('Auto-reply sent', { status: 200 });
  } catch (error) {
    console.error('Resend error:', error);
    return new Response('Failed to send auto-reply', { status: 500 });
  }
};
