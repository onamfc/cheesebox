/**
 * Deep Link Service using LinkForty
 *
 * This service generates universal links that:
 * - Open in the mobile app if installed
 * - Fall back to the web app if not installed
 */

interface DeepLinkOptions {
  videoId: string;
  recipientEmail?: string;
}

export class DeepLinkService {
  private readonly linkFortyBaseUrl: string;
  private readonly webAppUrl: string;

  constructor() {
    // LinkForty custom domain (e.g., https://go.cheesebox.io)
    this.linkFortyBaseUrl = process.env.LINKFORTY_BASE_URL || 'https://go.cheesebox.io';

    // Web app URL for fallback
    this.webAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.cheesebox.io';
  }

  /**
   * Generate a universal link for a shared video
   * This link will:
   * 1. Open the video in the mobile app if installed
   * 2. Open the video on the web if app is not installed
   * 3. Support deferred deep linking (install then open to video)
   */
  generateVideoShareLink(options: DeepLinkOptions): string {
    const { videoId, recipientEmail } = options;

    // Build the deep link path
    // The mobile app will handle this path: cheesebox://video/{videoId}
    const path = `video/${videoId}`;

    // Web fallback URL
    const webFallbackUrl = `${this.webAppUrl}/watch/${videoId}`;

    // LinkForty link with query parameters
    // LinkForty will handle the routing logic:
    // - If app is installed: open deep link
    // - If not: redirect to web fallback
    const deepLinkUrl = new URL(`${this.linkFortyBaseUrl}/${path}`);

    // Add fallback URL as query parameter
    deepLinkUrl.searchParams.set('$fallback_url', webFallbackUrl);

    // Add custom data for analytics and attribution
    deepLinkUrl.searchParams.set('video_id', videoId);

    if (recipientEmail) {
      deepLinkUrl.searchParams.set('recipient', recipientEmail);
    }

    return deepLinkUrl.toString();
  }

  /**
   * Generate a universal link for dashboard
   */
  generateDashboardLink(): string {
    const webFallbackUrl = `${this.webAppUrl}/dashboard`;
    const deepLinkUrl = new URL(`${this.linkFortyBaseUrl}/dashboard`);
    deepLinkUrl.searchParams.set('$fallback_url', webFallbackUrl);

    return deepLinkUrl.toString();
  }
}

// Export singleton instance
export const deepLinkService = new DeepLinkService();
