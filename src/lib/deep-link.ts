import { VideoVisibility } from "@/types/video";

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
  visibility?: VideoVisibility;
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
   * Generate a link for a shared video
   * TEMPORARY: Returns direct web portal link until mobile app is ready
   * TODO: Switch back to universal deep links when mobile app launches
   */
  generateVideoShareLink(options: DeepLinkOptions): string {
    const { videoId, visibility = VideoVisibility.PUBLIC } = options;

    // Public videos can be viewed via /embed (no authentication required)
    if (visibility === VideoVisibility.PUBLIC) {
      return `${this.webAppUrl}/embed/${videoId}`;
    }

    // Private videos require authentication - direct to watch page
    // The watch page will check access and display the video if authorized
    return `${this.webAppUrl}/watch/${videoId}`;
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
