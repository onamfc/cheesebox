import {
  SESClient,
  SendEmailCommand,
  GetSendQuotaCommand,
} from "@aws-sdk/client-ses";
import { EmailProvider, EmailOptions, EmailCredentials } from "../interface";

export class SESProvider implements EmailProvider {
  private client: SESClient;
  private fromEmail: string;
  private fromName?: string;

  constructor(credentials: EmailCredentials) {
    if (
      !credentials.awsAccessKeyId ||
      !credentials.awsSecretKey ||
      !credentials.awsRegion
    ) {
      throw new Error("AWS SES credentials are required");
    }

    this.client = new SESClient({
      region: credentials.awsRegion,
      credentials: {
        accessKeyId: credentials.awsAccessKeyId,
        secretAccessKey: credentials.awsSecretKey,
      },
    });

    this.fromEmail = credentials.fromEmail;
    this.fromName = credentials.fromName;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const from = this.fromName
      ? `${this.fromName} <${this.fromEmail}>`
      : this.fromEmail;

    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
      },
      Message: {
        Subject: {
          Data: options.subject,
        },
        Body: {
          Html: {
            Data: options.html,
          },
          ...(options.text && {
            Text: {
              Data: options.text,
            },
          }),
        },
      },
      ...(options.replyTo && {
        ReplyToAddresses: [options.replyTo],
      }),
    });

    await this.client.send(command);
  }

  async validateCredentials(): Promise<boolean> {
    try {
      // Try to get sending quota to validate credentials
      await this.client.send(new GetSendQuotaCommand({}));
      return true;
    } catch {
      return false;
    }
  }
}
