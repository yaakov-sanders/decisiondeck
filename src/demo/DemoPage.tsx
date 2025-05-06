import React, { useEffect, useState } from 'react';
import { PlayingCardDeck } from './PlayingCardDeck';
import { Card } from '../core/Card';
import type { BaseCardData } from '../core/Card';

interface PlayingCardData extends BaseCardData {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  color: 'red' | 'black';
}

export const DemoPage: React.FC = () => {
  const [deck] = useState(() => new PlayingCardDeck());
  const [currentCard, setCurrentCard] = useState<Card<PlayingCardData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingCards, setRemainingCards] = useState(52);

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
      await deck.handleSwipeLeft(currentCard);
      setCurrentCard(deck.getCurrentCard());
      setRemainingCards(prev => Math.max(0, prev - 1));
    }
  };

  const handleSwipeRight = async () => {
    if (currentCard) {
      await deck.handleSwipeRight(currentCard);
      setCurrentCard(deck.getCurrentCard());
      setRemainingCards(prev => Math.max(0, prev - 1));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentCard) {
    return <div>No more cards!</div>;
  }

  const CardComponent = currentCard.getCardComponent();

  return (
    <div className="demo-page">
      <div className="card-counter">Cards remaining: {remainingCards}</div>
      <div className="card-container">
        <CardComponent />
      </div>
      <div className="controls">
        <button onClick={handleSwipeLeft}>Swipe Left</button>
        <button onClick={handleSwipeRight}>Swipe Right</button>
      </div>
    </div>
  );
}; 