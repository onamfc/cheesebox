export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface EmailProvider {
  sendEmail(options: EmailOptions): Promise<void>;
  validateCredentials(): Promise<boolean>;
}

export interface EmailCredentials {
  provider: EmailProviderType;
  fromEmail: string;
  fromName?: string;

  // API-based providers
  apiKey?: string;

  // AWS SES
  awsAccessKeyId?: string;
  awsSecretKey?: string;
  awsRegion?: string;

  // SMTP
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
}

export type EmailProviderType = "RESEND" | "AWS_SES" | "SENDGRID" | "SMTP";
