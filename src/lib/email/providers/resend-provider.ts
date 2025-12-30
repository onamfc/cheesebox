import { Resend } from "resend";
import { EmailProvider, EmailOptions, EmailCredentials } from "../interface";

export class ResendProvider implements EmailProvider {
  private client: Resend;
  private fromEmail: string;
  private fromName?: string;

  constructor(credentials: EmailCredentials) {
    if (!credentials.apiKey) {
      throw new Error("Resend API key is required");
    }

    this.client = new Resend(credentials.apiKey);
    this.fromEmail = credentials.fromEmail;
    this.fromName = credentials.fromName;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const from = this.fromName
      ? `${this.fromName} <${this.fromEmail}>`
      : this.fromEmail;

    await this.client.emails.send({
      from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });
  }

  async validateCredentials(): Promise<boolean> {
    try {
      // Resend doesn't have a dedicated validate endpoint
      // We verify the client was created successfully
      return !!this.client;
    } catch {
      return false;
    }
  }
}
