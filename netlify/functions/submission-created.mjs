import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req) => {
  const { payload } = await req.json();
  const { name, email, message } = payload.data;

  if (!email) {
    return new Response('No email provided', { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Ashmo <hello@ashmo.io>',
      to: email,
      subject: 'Thanks for reaching out — Ashmo',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#111111; border-radius:12px; border:1px solid #222222;">
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 24px; color:#c8a87e; font-size:14px; letter-spacing:0.1em; text-transform:uppercase;">Ashmo</p>
              <h1 style="margin:0 0 20px; color:#f0f0f0; font-size:24px; font-weight:600; line-height:1.3;">Thanks for reaching out, ${name}.</h1>
              <p style="margin:0 0 16px; color:#b0b0b0; font-size:16px; font-weight:300; line-height:1.6;">
                I've received your message and appreciate you taking the time to write. I'll get back to you as soon as I can — usually within a day or two.
              </p>
              <p style="margin:0 0 28px; color:#b0b0b0; font-size:16px; font-weight:300; line-height:1.6;">
                In the meantime, feel free to explore my latest thinking on brand building and strategy at <a href="https://ashmo.io/thinking" style="color:#c8a87e; text-decoration:none;">ashmo.io/thinking</a>.
              </p>
              <hr style="border:none; border-top:1px solid #222222; margin:28px 0;">
              <p style="margin:0 0 8px; color:#666666; font-size:13px;">Your message:</p>
              <p style="margin:0; color:#999999; font-size:14px; font-style:italic; line-height:1.5; padding:12px 16px; background-color:#0a0a0a; border-radius:8px;">"${message}"</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px; border-top:1px solid #222222;">
              <p style="margin:0; color:#666666; font-size:13px; line-height:1.5;">
                Ashmo — Founder, Brand Builder, Writer<br>
                <a href="https://ashmo.io" style="color:#c8a87e; text-decoration:none;">ashmo.io</a> · <a href="https://linkedin.com/in/iamashmo" style="color:#c8a87e; text-decoration:none;">LinkedIn</a> · <a href="https://instagram.com/iam_ashmo" style="color:#c8a87e; text-decoration:none;">Instagram</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return new Response('Auto-reply sent', { status: 200 });
  } catch (error) {
    console.error('Resend error:', error);
    return new Response('Failed to send auto-reply', { status: 500 });
  }
};
