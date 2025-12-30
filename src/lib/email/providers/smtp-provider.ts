import nodemailer from "nodemailer";
import { EmailProvider, EmailOptions, EmailCredentials } from "../interface";

export class SMTPProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private fromName?: string;

  constructor(credentials: EmailCredentials) {
    if (
      !credentials.smtpHost ||
      !credentials.smtpPort ||
      !credentials.smtpUsername ||
      !credentials.smtpPassword
    ) {
      throw new Error("SMTP credentials are required");
    }

    this.transporter = nodemailer.createTransport({
      host: credentials.smtpHost,
      port: credentials.smtpPort,
      secure: credentials.smtpSecure ?? credentials.smtpPort === 465,
      auth: {
        user: credentials.smtpUsername,
        pass: credentials.smtpPassword,
      },
    });

    this.fromEmail = credentials.fromEmail;
    this.fromName = credentials.fromName;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const from = this.fromName
      ? `${this.fromName} <${this.fromEmail}>`
      : this.fromEmail;

    await this.transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}
