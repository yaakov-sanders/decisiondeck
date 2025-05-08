/**
 * Test suite for the DecisionDeckView component
 * Tests the rendering and interaction behavior of the card deck interface
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DecisionDeckView } from '../DecisionDeckView';
import { DecisionDeck } from '../../core/DecisionDeck';
import { Card } from '../../core/Card';

// Define the shape of our mock card data
interface MockCardData {
  id: string;
  content: string;
}

/**
 * Mock implementation of DecisionDeck for testing
 * Extends the base DecisionDeck class to provide test-specific functionality
 */
class MockDecisionDeck extends DecisionDeck<MockCardData> {
  constructor(
    initialCards: MockCardData[] = [
      { id: '1', content: 'Card 1' },
      { id: '2', content: 'Card 2' },
      { id: '3', content: 'Card 3' },
    ]
  ) {
    super();
    // Initialize with mock cards
    // Using bracket notation to access private properties from parent class
    this['cards'] = initialCards.map(data => new MockCard(data));
    this['currentIndex'] = 0;
  }

  // Required abstract method implementations
  async authenticate(): Promise<void> {}
  async initialize(): Promise<void> {}
  async fetchNextPage(): Promise<Card<MockCardData>[]> {
    return [];
  }
  async handleSwipeLeft(card: Card<MockCardData>): Promise<void> {}
  async handleSwipeRight(card: Card<MockCardData>): Promise<void> {}

  // Override swipe methods to properly handle advancement
  async swipeLeft(): Promise<void> {
    const currentCard = this.getCurrentCard();
    if (currentCard) {
      await this.handleSwipeLeft(currentCard);
      this['currentIndex']++;
    }
  }

  async swipeRight(): Promise<void> {
    const currentCard = this.getCurrentCard();
    if (currentCard) {
      await this.handleSwipeRight(currentCard);
      this['currentIndex']++;
    }
  }
}

/**
 * Mock implementation of Card for testing
 * Provides a simple card component that renders the card's content
 */
class MockCard extends Card<MockCardData> {
  getCardComponent() {
    return ({ cardData }: { cardData: MockCardData }) => (
      <div data-testid={`card-${cardData.id}`}>{cardData.content}</div>
    );
  }
}

describe('DecisionDeckView', () => {
  let mockDeck: MockDecisionDeck;

  beforeEach(() => {
    mockDeck = new MockDecisionDeck();
  });

  it('renders loading state initially', () => {
    render(<DecisionDeckView deck={mockDeck} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty state when no cards are available', async () => {
    const emptyDeck = new MockDecisionDeck([]);
    render(<DecisionDeckView deck={emptyDeck} />);

    // Wait for initialization to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await screen.findByTestId('empty-state');
  });

  it('renders the current card', async () => {
    render(<DecisionDeckView deck={mockDeck} />);

    // Wait for initialization to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await screen.findByTestId('card-1');
  });

  it('handles swipe left button click', async () => {
    render(<DecisionDeckView deck={mockDeck} />);

    // Wait for initialization to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card1 = await screen.findByTestId('card-1');
    expect(card1).toBeInTheDocument();

    const leftButton = await screen.findByLabelText('Swipe Left');

    await act(async () => {
      fireEvent.click(leftButton);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card2 = await screen.findByTestId('card-2');
    expect(card2).toBeInTheDocument();
  });

  it('handles swipe right button click', async () => {
    render(<DecisionDeckView deck={mockDeck} />);

    // Wait for initialization to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card1 = await screen.findByTestId('card-1');
    expect(card1).toBeInTheDocument();

    const rightButton = await screen.findByLabelText('Swipe Right');

    await act(async () => {
      fireEvent.click(rightButton);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card2 = await screen.findByTestId('card-2');
    expect(card2).toBeInTheDocument();
  });

  it('handles drag and drop to left', async () => {
    render(<DecisionDeckView deck={mockDeck} />);

    // Wait for initialization to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card1 = await screen.findByTestId('card-1');
    expect(card1).toBeInTheDocument();

    const stack = card1.parentElement?.parentElement;
    if (!stack) throw new Error('Stack element not found');

    await act(async () => {
      // Start drag
      fireEvent.dragStart(card1, {
        dataTransfer: {
          setDragImage: () => {},
          effectAllowed: 'move',
        },
      });

      // Drag to left side
      fireEvent.dragOver(stack, {
        clientX: 50, // Left side of the stack
        clientY: 200,
      });

      // Drop
      fireEvent.drop(stack);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card2 = await screen.findByTestId('card-2');
    expect(card2).toBeInTheDocument();
  });

  it('handles drag and drop to right', async () => {
    render(<DecisionDeckView deck={mockDeck} />);

    // Wait for initialization to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card1 = await screen.findByTestId('card-1');
    expect(card1).toBeInTheDocument();

    const stack = card1.parentElement?.parentElement;
    if (!stack) throw new Error('Stack element not found');

    await act(async () => {
      // Start drag
      fireEvent.dragStart(card1, {
        dataTransfer: {
          setDragImage: () => {},
          effectAllowed: 'move',
        },
      });

      // Drag to right side
      fireEvent.dragOver(stack, {
        clientX: 270, // Right side of the stack
        clientY: 200,
      });

      // Drop
      fireEvent.drop(stack);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card2 = await screen.findByTestId('card-2');
    expect(card2).toBeInTheDocument();
  });
});
