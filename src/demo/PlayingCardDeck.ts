import { Card } from '../core/Card';
import type { BaseCardData } from '../core/Card';
import { DecisionDeck } from '../core/DecisionDeck';
import { PlayingCardComponent } from './PlayingCardComponent';

// Define the playing card data structure based on the API response
export interface PlayingCardData extends BaseCardData {
  code: string;
  suit: string;
  value: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
}

// Create the playing card class
class PlayingCard extends Card<PlayingCardData> {
  getCardComponent() {
    return PlayingCardComponent;
  }
}

// Create a demo deck implementation
export class PlayingCardDeck extends DecisionDeck<PlayingCardData> {
  private deckId: string | null = null;
  private remaining: number = 0;

  constructor(pageSize: number = 5) {
    super(pageSize);
  }

  async authenticate(): Promise<void> {
    // Initialize a new deck
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to initialize deck');
    }

    this.deckId = data.deck_id;
    this.remaining = data.remaining;
  }

  async fetchNextPage(): Promise<PlayingCard[]> {
    if (!this.deckId) {
      throw new Error('Deck not initialized');
    }

    // If we're out of cards, return an empty array
    if (this.remaining === 0) {
      return [];
    }

    // Calculate how many cards to draw (either pageSize or remaining cards, whichever is smaller)
    const drawCount = Math.min(this.pageSize, this.remaining);

    // Draw cards from the deck
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${drawCount}`
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to draw cards');
    }

    this.remaining = data.remaining;

    // Convert API response to PlayingCard instances
    return data.cards.map(
      (card: any) =>
        new PlayingCard({
          id: card.code,
          code: card.code,
          suit: card.suit,
          value: card.value,
          image: card.image,
          images: card.images,
        })
    );
  }

  async handleSwipeLeft(card: Card<PlayingCardData>): Promise<void> {
    // No additional action needed
  }

  async handleSwipeRight(card: Card<PlayingCardData>): Promise<void> {
    // No additional action needed
  }
}
