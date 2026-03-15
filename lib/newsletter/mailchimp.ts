import crypto from 'node:crypto';

type MailchimpConfig = {
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
  transactionalApiKey: string;
  fromEmail: string;
  fromName: string;
};

function getMailchimpConfig(): MailchimpConfig {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const transactionalApiKey = process.env.MAILCHIMP_TRANSACTIONAL_API_KEY;
  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL;
  const fromName = process.env.NEWSLETTER_FROM_NAME ?? 'FinanceSite';

  if (!apiKey || !serverPrefix || !audienceId || !transactionalApiKey || !fromEmail) {
    throw new Error('Mailchimp environment variables are missing.');
  }

  return { apiKey, serverPrefix, audienceId, transactionalApiKey, fromEmail, fromName };
}

function getSubscriberHash(email: string) {
  return crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
}

export async function addSubscriberToAudience(email: string) {
  const config = getMailchimpConfig();
  const subscriberHash = getSubscriberHash(email);

  const response = await fetch(
    `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${config.audienceId}/members/${subscriberHash}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `apikey ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'subscribed',
        status: 'subscribed',
        tags: ['newsletter', 'welcome-trigger']
      })
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Unable to add subscriber to Mailchimp audience: ${body}`);
  }
}

async function sendTransactionalEmail({ toEmail, subject, html }: { toEmail: string; subject: string; html: string }) {
  const config = getMailchimpConfig();

  const response = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key: config.transactionalApiKey,
      message: {
        from_email: config.fromEmail,
        from_name: config.fromName,
        subject,
        html,
        to: [
          {
            email: toEmail,
            type: 'to'
          }
        ]
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Unable to send transactional email: ${body}`);
  }
}

export async function sendConfirmationEmail(toEmail: string, confirmationLink: string) {
  await sendTransactionalEmail({
    toEmail,
    subject: 'Confirm your newsletter subscription',
    html: `<p>Thanks for subscribing to FinanceSite.</p><p>Please confirm your subscription by clicking this link:</p><p><a href="${confirmationLink}">Confirm subscription</a></p><p>This link expires in 24 hours.</p>`
  });
}

export async function sendWelcomeEmail(toEmail: string) {
  await sendTransactionalEmail({
    toEmail,
    subject: 'Welcome to the FinanceSite newsletter',
    html: '<p>You are now subscribed. Welcome aboard! You will start receiving personal finance insights soon.</p>'
  });
}
