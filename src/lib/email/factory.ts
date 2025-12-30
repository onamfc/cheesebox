import { EmailProvider, EmailCredentials, EmailProviderType } from "./interface";
import { ResendProvider } from "./providers/resend-provider";
import { SESProvider } from "./providers/ses-provider";
import { SMTPProvider } from "./providers/smtp-provider";

export function createEmailProvider(
  type: EmailProviderType,
  credentials: EmailCredentials,
): EmailProvider {
  switch (type) {
    case "RESEND":
      return new ResendProvider(credentials);

    case "AWS_SES":
      return new SESProvider(credentials);

    case "SMTP":
      return new SMTPProvider(credentials);

    case "SENDGRID":
      // TODO: Implement SendGrid provider
      throw new Error(`Provider ${type} not yet implemented`);

    default:
      throw new Error(`Unsupported email provider: ${type}`);
  }
}
