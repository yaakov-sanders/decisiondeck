import { Card } from '../core/Card';
import type { BaseCardData } from '../core/Card';
import { DecisionDeck } from '../core/DecisionDeck';
import { GooglePhotosCardComponent } from './GooglePhotosCardComponent';

const GOOGLE_OAUTH_CONFIG = {
  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Should be defined in .env file
  scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
  response_type: 'token',
};

// Define the Google Photos card data structure
export interface GooglePhotoData extends BaseCardData {
  url: string;
  filename: string;
  mimeType: string;
  metadata: {
    creationTime: string;
    width: number;
    height: number;
  };
}

// Create the Google Photos card class
class GooglePhotoCard extends Card<GooglePhotoData> {
  getCardComponent() {
    return GooglePhotosCardComponent;
  }
}

// Create the Google Photos deck implementation
export class GooglePhotosDeck extends DecisionDeck<GooglePhotoData> {
  private pageToken: string | null = null;
  private accessToken: string | null = null;
  private tokenExpirationTime: number | null = null;
  private isAuthenticated: boolean = false;

  constructor(pageSize: number = 10) {
    super(pageSize);
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    // Check if we have a stored token and it's still valid
    const storedToken = localStorage.getItem('google_photos_access_token');
    const storedExpiration = localStorage.getItem('google_photos_token_expiration');

    if (storedToken && storedExpiration) {
      const expirationTime = parseInt(storedExpiration, 10);
      if (expirationTime > Date.now()) {
        this.accessToken = storedToken;
        this.tokenExpirationTime = expirationTime;
        this.isAuthenticated = true;
      }
    }
  }

  private handleAuthResponse(): void {
    // Parse the hash fragment from the URL
    const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = fragmentParams.get('access_token');
    const expiresIn = fragmentParams.get('expires_in');

    if (accessToken && expiresIn) {
      const expirationTime = Date.now() + parseInt(expiresIn, 10) * 1000;

      // Store the token and expiration
      this.accessToken = accessToken;
      this.tokenExpirationTime = expirationTime;
      this.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem('google_photos_access_token', accessToken);
      localStorage.setItem('google_photos_token_expiration', expirationTime.toString());

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  async authenticate(): Promise<void> {
    // Check if we're returning from auth flow
    if (window.location.hash.includes('access_token')) {
      this.handleAuthResponse();
      return;
    }

    // Check if we have a valid stored token
    if (this.accessToken && this.tokenExpirationTime && this.tokenExpirationTime > Date.now()) {
      this.isAuthenticated = true;
      return;
    }

    // Start OAuth flow
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', GOOGLE_OAUTH_CONFIG.client_id);
    authUrl.searchParams.append('scope', GOOGLE_OAUTH_CONFIG.scope);
    authUrl.searchParams.append('response_type', GOOGLE_OAUTH_CONFIG.response_type);
    authUrl.searchParams.append('redirect_uri', window.location.href);

    // Redirect to Google's OAuth page
    window.location.href = authUrl.toString();
  }

  async fetchNextPage(): Promise<GooglePhotoCard[]> {
    if (!this.isAuthenticated || !this.accessToken) {
      throw new Error('Not authenticated with Google Photos');
    }

    try {
      const url = new URL('https://photoslibrary.googleapis.com/v1/mediaItems');
      if (this.pageToken) {
        url.searchParams.append('pageToken', this.pageToken);
      }
      url.searchParams.append('pageSize', this.pageSize.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }

      const data = await response.json();
      this.pageToken = data.nextPageToken || null;

      return data.mediaItems.map(
        (item: any) =>
          new GooglePhotoCard({
            id: item.id,
            url: item.baseUrl,
            filename: item.filename,
            mimeType: item.mimeType,
            metadata: {
              creationTime: item.mediaMetadata.creationTime,
              width: parseInt(item.mediaMetadata.width, 10),
              height: parseInt(item.mediaMetadata.height, 10),
            },
          })
      );
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  }

  async handleSwipeLeft(card: Card<GooglePhotoData>): Promise<void> {
    // Implementation for rejecting/archiving photos
    console.log('Swiped left on photo:', card.getData().filename);
  }

  async handleSwipeRight(card: Card<GooglePhotoData>): Promise<void> {
    // Implementation for keeping/favouring photos
    console.log('Swiped right on photo:', card.getData().filename);
  }
}
