import React, { useEffect, useState } from 'react';
import { Card } from '../core/Card';
import type { BaseCardData } from '../core/Card';
import { DecisionDeck } from '../core/DecisionDeck';
import './DecisionDeckView.css';

interface DecisionDeckViewProps<T extends BaseCardData> {
  deck: DecisionDeck<T>;
  className?: string;
}

export function DecisionDeckView<T extends BaseCardData>({
  deck,
  className = ''
}: DecisionDeckViewProps<T>) {
  const [currentCard, setCurrentCard] = useState<Card<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingCards, setRemainingCards] = useState(0);

  useEffect(() => {
    const initializeDeck = async () => {
      try {
        await deck.authenticate();
        await deck.initialize();
        setCurrentCard(deck.getCurrentCard());
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize deck:', error);
        setIsLoading(false);
      }
    };

    initializeDeck();
  }, [deck]);

  const handleSwipeLeft = async () => {
    if (currentCard) {
      await deck.swipeLeft();
      setCurrentCard(deck.getCurrentCard());
      setRemainingCards(prev => Math.max(0, prev - 1));
    }
  };

  const handleSwipeRight = async () => {
    if (currentCard) {
      await deck.swipeRight();
      setCurrentCard(deck.getCurrentCard());
      setRemainingCards(prev => Math.max(0, prev - 1));
    }
  };

  if (isLoading) {
    return <div className="decision-deck-loading">Loading...</div>;
  }

  if (!currentCard) {
    return <div className="decision-deck-empty">No more cards!</div>;
  }

  const CardComponent = currentCard.getCardComponent();

  return (
    <div className={`decision-deck-view ${className}`}>
      <div className="decision-deck-counter">Cards remaining: {remainingCards}</div>
      <div className="decision-deck-container">
        <CardComponent />
      </div>
      <div className="decision-deck-controls">
        <button onClick={handleSwipeLeft}>Swipe Left</button>
        <button onClick={handleSwipeRight}>Swipe Right</button>
      </div>
    </div>
  );
} 