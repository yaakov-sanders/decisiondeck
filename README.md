# DecisionDeck

A plug-and-play, Tinder-like interface framework for making binary decisions on collections of items. DecisionDeck provides a base architecture and a reusable React component for swipeable interfaces, with a demo implementation using playing cards.

## Features

- **Core OOP Architecture:**
  - `Card<T>`: Abstract base for any card data.
  - `DecisionDeck<T>`: Manages card stack, swipe logic, and preloading.
- **Reusable UI:**
  - `DecisionDeckView`: Generic React component for rendering any deck visually as a swipeable stack.
- **Demo Implementation:**
  - `PlayingCardDeck`: Example deck using standard playing cards.
- **Modern Stack:**
  - React + TypeScript + Vite
  - Strict TypeScript config

## Usage

### 1. Extend the Card and Deck

```typescript
// src/core/Card.ts
export abstract class Card<T> {
  protected data: T;
  constructor(data: T) {
    this.data = data;
  }
  abstract getCardComponent(): React.ComponentType;
  getMetadata() {
    return { id: this.data.id, type: this.data.type, timestamp: this.data.timestamp };
  }
}

// src/core/DecisionDeck.ts
export abstract class DecisionDeck<T> {
  // Handles card stack, swiping, and preloading
  // Implement authenticate, fetchNextPage, handleSwipeLeft, handleSwipeRight
}
```

### 2. Use the Generic UI

```tsx
// src/components/DecisionDeckView.tsx
import { DecisionDeckView } from './components/DecisionDeckView';
import { PlayingCardDeck } from './demo/PlayingCardDeck';

const deck = new PlayingCardDeck();
<DecisionDeckView deck={deck} />;
```

## Customization

- **Create your own Card and Deck** by extending the base classes.
- **Plug into the UI** by passing your deck to `DecisionDeckView`.
- **Style** via `DecisionDeckView.css` and your own card component styles.

## Example Screenshot

![Demo Screenshot](./screenshot.png) <!-- Add your screenshot path here -->

## Getting Started

1. Clone the repo
2. `npm install`
3. `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173)

## License

MIT
