import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '../core/Card';
import type { BaseCardData } from '../core/Card';
import { DecisionDeck } from '../core/DecisionDeck';
import './DecisionDeckView.css';
import EmptyState from './EmptyState';

interface DecisionDeckViewProps<T extends BaseCardData> {
  deck: DecisionDeck<T>;
}

export function DecisionDeckView<T extends BaseCardData>({
  deck
}: DecisionDeckViewProps<T>) {
  const [currentCard, setCurrentCard] = useState<Card<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOverZone, setDragOverZone] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const initializeDeck = async () => {
      try {
        await deck.authenticate();
        await deck.initialize();
        // Batch state updates together
        const card = deck.getCurrentCard();
        setCurrentCard(card);
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
    return deck['cards']?.slice(deck['currentIndex'], deck['currentIndex'] + 3) || [];
  };

  const topCards = getTopCards();

  const handleSwipeLeft = async () => {
    if (currentCard) {
      await deck.swipeLeft();
      setCurrentCard(deck.getCurrentCard());
    }
  };

  const handleSwipeRight = async () => {
    if (currentCard) {
      await deck.swipeRight();
      setCurrentCard(deck.getCurrentCard());
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    // Set the drag image to be the card itself
    const cardElement = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(cardElement, cardElement.offsetWidth / 2, cardElement.offsetHeight / 2);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });
    setDragOverZone(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Calculate position relative to the center of the card
    setDragPosition({
      x: e.clientX - rect.left - (rect.width / 2),
      y: e.clientY - rect.top - (rect.height / 2)
    });

    // Determine which zone we're over
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.33) {
      setDragOverZone('left');
    } else if (x > rect.width * 0.67) {
      setDragOverZone('right');
    } else {
      setDragOverZone(null);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragPosition({ x: 0, y: 0 });
    
    if (dragOverZone === 'left') {
      await handleSwipeLeft();
    } else if (dragOverZone === 'right') {
      await handleSwipeRight();
    }
    
    setDragOverZone(null);
  };

  // Extracted render function for stack cards
  const renderStackCard = useCallback((card: Card<T>, idx: number) => {
    const CardComponent = card.getCardComponent();
    // Stack offsets: bottom card is furthest back
    const offsets = [
      { z: 3, t: 'translate(0, 0) scale(1)' },
      { z: 2, t: 'translate(-16px, 8px) scale(0.98)' },
      { z: 1, t: 'translate(-32px, 16px) scale(0.96)' },
    ];
    const { z, t } = offsets[idx] || offsets[2];
    
    // Only make the top card draggable
    const isTopCard = idx === 0;
    const dragStyle = isTopCard && isDragging ? {
      transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
      cursor: 'grabbing',
      transition: 'none'
    } : {};

    return (
      <div
        key={card.getMetadata().id}
        className={`stack-card ${isTopCard ? 'draggable' : ''}`}
        style={{
          zIndex: z,
          transform: t,
          ...dragStyle
        }}
        draggable={isTopCard}
        onDragStart={isTopCard ? handleDragStart : undefined}
        onDragEnd={isTopCard ? handleDragEnd : undefined}
      >
        <CardComponent cardData={card.getData()} />
      </div>
    );
  }, [isDragging, dragPosition]);

  let content;
  if (isLoading) {
    content = <div className="decision-deck-loading">Loading...</div>;
  } else if (!currentCard) {
    content = <EmptyState />;
  } else {
    content = (
      <>
        <div 
          className={`modern-deck-stack ${dragOverZone ? `drag-over-${dragOverZone}` : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Render up to 3 cards for the stack effect, last card visually on top */}
          {topCards.map(renderStackCard)}
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
      </>
    );
  }

  return (
    <div className="modern-deck-bg">
      <div className="modern-deck-center-col">
        {content}
      </div>
    </div>
  );
} 