import crypto from 'node:crypto';

type MailchimpProviderConfig = {
  provider: 'mailchimp';
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
};

type ConvertKitProviderConfig = {
  provider: 'convertkit';
  apiSecret: string;
  formId: string;
};

type ProviderConfig = MailchimpProviderConfig | ConvertKitProviderConfig;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveProviderConfig(): ProviderConfig {
  const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
  const mailchimpServerPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (mailchimpApiKey && mailchimpServerPrefix && mailchimpAudienceId) {
    return {
      provider: 'mailchimp',
      apiKey: mailchimpApiKey,
      serverPrefix: mailchimpServerPrefix,
      audienceId: mailchimpAudienceId
    };
  }

  const convertkitApiSecret = process.env.CONVERTKIT_API_SECRET;
  const convertkitFormId = process.env.CONVERTKIT_FORM_ID;

  if (convertkitApiSecret && convertkitFormId) {
    return {
      provider: 'convertkit',
      apiSecret: convertkitApiSecret,
      formId: convertkitFormId
    };
  }

  throw new Error(
    'Missing newsletter provider config. Set MAILCHIMP_API_KEY/MAILCHIMP_SERVER_PREFIX/MAILCHIMP_AUDIENCE_ID or CONVERTKIT_API_SECRET/CONVERTKIT_FORM_ID.'
  );
}

function getSubscriberHash(email: string) {
  return crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
}

export async function subscribeConfirmedEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!emailPattern.test(normalizedEmail)) {
    throw new Error('Invalid email address.');
  }

  const config = resolveProviderConfig();

  if (config.provider === 'mailchimp') {
    const subscriberHash = getSubscriberHash(normalizedEmail);
    const response = await fetch(
      `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${config.audienceId}/members/${subscriberHash}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `apikey ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: normalizedEmail,
          status_if_new: 'subscribed',
          status: 'subscribed'
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Unable to subscribe in Mailchimp: ${await response.text()}`);
    }

    return;
  }

  const response = await fetch(`https://api.convertkit.com/v3/forms/${config.formId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_secret: config.apiSecret,
      email: normalizedEmail
    })
  });

  if (!response.ok) {
    throw new Error(`Unable to subscribe in ConvertKit: ${await response.text()}`);
  }
}

type TransactionalConfig = {
  apiKey: string;
  fromEmail: string;
  fromName: string;
};

function getTransactionalConfig(): TransactionalConfig | null {
  const apiKey = process.env.MAILCHIMP_TRANSACTIONAL_API_KEY;
  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL;
  const fromName = process.env.NEWSLETTER_FROM_NAME ?? 'FinanceSite';

  if (!apiKey || !fromEmail) {
    return null;
  }

  return { apiKey, fromEmail, fromName };
}

async function sendTransactionalEmail({ toEmail, subject, html }: { toEmail: string; subject: string; html: string }) {
  const transactionalConfig = getTransactionalConfig();

  if (!transactionalConfig) {
    console.info(`[newsletter] No transactional email provider configured. Confirmation email for ${toEmail}:`);
    console.info(html);
    return;
  }

  const response = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key: transactionalConfig.apiKey,
      message: {
        from_email: transactionalConfig.fromEmail,
        from_name: transactionalConfig.fromName,
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
    throw new Error(`Unable to send transactional email: ${await response.text()}`);
  }
}

export async function sendConfirmationEmail(toEmail: string, confirmationLink: string) {
  await sendTransactionalEmail({
    toEmail,
    subject: 'Confirm your newsletter subscription',
    html: `<p>Thanks for subscribing to FinanceSite.</p><p>Please confirm your subscription by clicking this link:</p><p><a href="${confirmationLink}">Confirm subscription</a></p><p>This link expires in 1 hour.</p>`
  });
}
