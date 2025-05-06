# DecisionDeck

A plug-and-play Tinder-like interface framework for making binary decisions on collections of items. DecisionDeck provides a base architecture that can be extended to create swipeable interfaces for various use cases.

## Project Goal

DecisionDeck aims to simplify the creation of Tinder-like interfaces by providing an abstract base class that handles the core swipe mechanics, while allowing developers to focus on their specific use case implementation.

## Core Architecture

### Base Card Structure

```typescript
abstract class Card<T> {
  protected data: T;
  
  constructor(data: T) {
    this.data = data;
  }
  
  // Get the React component that renders this card
  abstract getCardComponent(): React.ComponentType;
  
  // Optional: Get card metadata for animations/transitions
  getMetadata(): CardMetadata {
    return {
      id: this.data.id,
      type: this.data.type,
      timestamp: this.data.timestamp
    };
  }
}

interface CardMetadata {
  id: string;
  type: string;
  timestamp: number;
}
```

### Card Stack Management

```typescript
class CardStack<T> {
  private cards: Card<T>[] = [];
  private currentIndex: number = 0;
  private readonly pageSize: number;
  private readonly preloadThreshold: number;
  
  constructor(pageSize: number = 5, preloadThreshold: number = 2) {
    this.pageSize = pageSize;
    this.preloadThreshold = preloadThreshold;
  }
  
  // Get the current card
  getCurrentCard(): Card<T> | null {
    return this.cards[this.currentIndex] || null;
  }
  
  // Get the next card without advancing
  peekNextCard(): Card<T> | null {
    return this.cards[this.currentIndex + 1] || null;
  }
  
  // Advance to the next card
  advance(): void {
    this.currentIndex++;
    this.checkPreload();
  }
  
  // Add new cards to the stack
  addCards(newCards: Card<T>[]): void {
    this.cards.push(...newCards);
  }
  
  // Check if we need to preload more cards
  private checkPreload(): void {
    const remainingCards = this.cards.length - this.currentIndex;
    if (remainingCards <= this.preloadThreshold) {
      this.onPreloadNeeded();
    }
  }
  
  // Override this in the deck implementation
  protected onPreloadNeeded(): void {
    // To be implemented by the deck
  }
}
```

### Base Deck Structure

```typescript
abstract class DecisionDeck<T> {
  protected cardStack: CardStack<T>;
  
  constructor(pageSize: number = 5) {
    this.cardStack = new CardStack<T>(pageSize);
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
    return this.cardStack.getCurrentCard();
  }
  
  // Initialize the deck with the first page of cards
  async initialize(): Promise<void> {
    const initialCards = await this.fetchNextPage();
    this.cardStack.addCards(initialCards);
  }
}
```

### Example Implementation: Google Photos Cleanup

```typescript
interface PhotoData {
  id: string;
  url: string;
  timestamp: number;
  metadata: {
    location?: string;
    people?: string[];
  };
}

class PhotoCard extends Card<PhotoData> {
  getCardComponent() {
    return () => (
      <div className="photo-card">
        <img src={this.data.url} alt="Photo" />
        <div className="metadata">
          {this.data.metadata.location && (
            <span>📍 {this.data.metadata.location}</span>
          )}
          {this.data.metadata.people?.map(person => (
            <span key={person}>👤 {person}</span>
          ))}
        </div>
      </div>
    );
  }
}

class GooglePhotosDeck extends DecisionDeck<PhotoData> {
  private currentPage: number = 0;
  
  async authenticate() {
    // Implement Google OAuth
  }
  
  async fetchNextPage(): Promise<PhotoCard[]> {
    const photos = await this.fetchPhotosFromGoogle(this.currentPage);
    this.currentPage++;
    return photos.map(photo => new PhotoCard(photo));
  }
  
  async handleSwipeLeft(card: PhotoCard) {
    // Archive/delete the photo
    this.cardStack.advance();
  }
  
  async handleSwipeRight(card: PhotoCard) {
    // Keep the photo
    this.cardStack.advance();
  }
}
```

## Use Cases

1. **Photo Management**
   - Google Photos cleanup
   - Local photo organization
   - Social media content moderation

2. **Content Curation**
   - Article reading list
   - Video playlist creation
   - Music playlist building

3. **Task Management**
   - Email inbox processing
   - Task prioritization
   - Document review

## Getting Started

1. Extend the `Card` base class for your content type
2. Extend the `DecisionDeck` base class
3. Implement the required abstract methods
4. Add your custom UI components
5. Deploy and start making decisions!

## Technical Stack

- React + TypeScript
- Vite for build tooling
- Modern ES2020+ features
- Strict TypeScript configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your own projects!
