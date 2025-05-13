import type { Card, BaseCardData } from './Card';

export abstract class DecisionDeck<T extends BaseCardData> {
  private cards: Card<T>[] = [];
  private currentIndex: number = 0;
  protected readonly pageSize: number;
  private readonly preloadThreshold: number;

  protected constructor(pageSize: number = 10, preloadThreshold: number = 5) {
    this.pageSize = pageSize;
    this.preloadThreshold = preloadThreshold;
  }

  // Authentication
  abstract authenticate(): Promise<void>;

  // Card Management
  abstract fetchNextPage(): Promise<Card<T>[]>;

  // Decision Handlers
  abstract handleSwipeLeft(card: Card<T>): Promise<void>;

  abstract handleSwipeRight(card: Card<T>): Promise<void>;

  // Get the current card
  getCurrentCard(): Card<T> | null {
    return this.cards[this.currentIndex] || null;
  }

  // Advance to the next card
  protected advance(): void {
    this.currentIndex++;
    this.checkPreload();
  }

  // Add new cards to the stack
  protected addCards(newCards: Card<T>[]): void {
    this.cards.push(...newCards);
  }

  // Check if we need to preload more cards
  private checkPreload(): void {
    const remainingCards = this.cards.length - this.currentIndex;
    if (remainingCards <= this.preloadThreshold) {
      this.onPreloadNeeded();
    }
  }

  // Handle preloading of cards
  protected async onPreloadNeeded(): Promise<void> {
    const nextCards = await this.fetchNextPage();
    if (nextCards.length > 0) {
      this.addCards(nextCards);
    }
  }

  // Initialize the deck with the first page of cards
  async initialize(): Promise<void> {
    const initialCards = await this.fetchNextPage();
    this.addCards(initialCards);
  }

  // Swipe handlers
  async swipeLeft(): Promise<void> {
    const currentCard = this.getCurrentCard();
    if (currentCard) {
      await this.handleSwipeLeft(currentCard);
      this.advance();
    }
  }

  async swipeRight(): Promise<void> {
    const currentCard = this.getCurrentCard();
    if (currentCard) {
      await this.handleSwipeRight(currentCard);
      this.advance();
    }
  }
}
