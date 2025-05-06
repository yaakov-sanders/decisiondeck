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
        setRemainingCards(deck.getRemainingCards());
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize deck:', error);
        setIsLoading(false);
      }
    };

    initializeDeck();
  }, [deck]);

  // Get the top 3 cards for the stack effect
  const getTopCards = () => {
    // Just take the next 3 cards in order
    return deck['cards']?.slice(deck['currentIndex'], deck['currentIndex'] + 3) || [];
  };

  const topCards = getTopCards();

  const handleSwipeLeft = async () => {
    if (currentCard) {
      await deck.swipeLeft();
      setCurrentCard(deck.getCurrentCard());
      setRemainingCards(deck.getRemainingCards());
    }
  };

  const handleSwipeRight = async () => {
    if (currentCard) {
      await deck.swipeRight();
      setCurrentCard(deck.getCurrentCard());
      setRemainingCards(deck.getRemainingCards());
    }
  };

  if (isLoading) {
    return <div className="decision-deck-loading">Loading...</div>;
  }

  if (!currentCard) {
    return <div className="decision-deck-empty">No more cards!</div>;
  }

  // Modern, pixel-perfect rendering
  return (
    <div className="modern-deck-bg">
      <div className="modern-deck-center-col">
        <div className="modern-deck-stack">
          {/* Render up to 3 cards for the stack effect, last card visually on top */}
          {topCards.map((card, idx) => {
            const CardComponent = card.getCardComponent();
            // Stack offsets: bottom card is furthest back
            const offsets = [
              { z: 3, t: 'translate(0, 0) scale(1)' },
              { z: 2, t: 'translate(-16px, 8px) scale(0.98)' },
              { z: 1, t: 'translate(-32px, 16px) scale(0.96)' },
            ];
            const { z, t } = offsets[idx] || offsets[2];
            return (
              <div
                key={card.getMetadata().id}
                className={`modern-deck-card ${idx === topCards.length - 1 ? 'card-front' : 'card-back'}`}
                style={{
                  zIndex: z,
                  transform: t,
                  width: 320,
                  height: 440,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: idx === topCards.length - 1 ? '#fff' : '#f5f5f5',
                  borderRadius: 20
                }}
              >
                <div className="modern-card-content">
                  <CardComponent />
                </div>
              </div>
            );
          })}
        </div>
        <div className="modern-deck-controls">
          <button className="modern-swipe-btn swipe-left" onClick={handleSwipeLeft} aria-label="Swipe Left">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="#F44336"/>
              <path d="M36 20L20 36" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M20 20L36 36" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="modern-swipe-btn swipe-right" onClick={handleSwipeRight} aria-label="Swipe Right">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="#4CAF50"/>
              <path d="M18 28L26 36L38 22" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 