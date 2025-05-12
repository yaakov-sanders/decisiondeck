import React, { useEffect, useState, useCallback } from 'react';
import { Card } from '../core/Card';
import type { BaseCardData } from '../core/Card';
import { DecisionDeck } from '../core/DecisionDeck';
import { SwipeButton, type SwipeDirection } from './SwipeButton';
import './DecisionDeckView.css';
import EmptyState from './EmptyState';

interface DecisionDeckViewProps<T extends BaseCardData> {
  deck: DecisionDeck<T>;
}

interface DragState {
  isDragging: boolean;
  position: { x: number; y: number };
  overZone: SwipeDirection | null;
}

export function DecisionDeckView<T extends BaseCardData>({ deck }: DecisionDeckViewProps<T>) {
  const [currentCard, setCurrentCard] = useState<Card<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    position: { x: 0, y: 0 },
    overZone: null,
  });

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
    setDragState(prev => ({ ...prev, isDragging: true }));
    // Set the drag image to be the card itself
    const cardElement = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(
      cardElement,
      cardElement.offsetWidth / 2,
      cardElement.offsetHeight / 2
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      position: { x: 0, y: 0 },
      overZone: null,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate position relative to the center of the card
    const newPosition = {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };

    // Determine which zone we're over
    const x = e.clientX - rect.left;
    let newOverZone: SwipeDirection | null = null;
    if (x < rect.width * 0.33) {
      newOverZone = 'left';
    } else if (x > rect.width * 0.67) {
      newOverZone = 'right';
    }

    setDragState(prev => ({
      ...prev,
      position: newPosition,
      overZone: newOverZone,
    }));
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (dragState.overZone === 'left') {
      await handleSwipeLeft();
    } else if (dragState.overZone === 'right') {
      await handleSwipeRight();
    }

    setDragState({
      isDragging: false,
      position: { x: 0, y: 0 },
      overZone: null,
    });
  };

  // Extracted render function for stack cards
  const renderStackCard = useCallback(
    (card: Card<T>, idx: number) => {
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
      const dragStyle =
        isTopCard && dragState.isDragging
          ? {
              transform: `translate(${dragState.position.x}px, ${dragState.position.y}px)`,
              cursor: 'grabbing',
              transition: 'none',
            }
          : {};

      return (
        <div
          key={card.getMetadata().id}
          className={`stack-card ${isTopCard ? 'draggable' : ''}`}
          style={{
            zIndex: z,
            transform: t,
            ...dragStyle,
          }}
          draggable={isTopCard}
          onDragStart={isTopCard ? handleDragStart : undefined}
          onDragEnd={isTopCard ? handleDragEnd : undefined}
        >
          <CardComponent cardData={card.getData()} />
        </div>
      );
    },
    [dragState]
  );

  let content;
  if (isLoading) {
    content = <div className="decision-deck-loading">Loading...</div>;
  } else if (!currentCard) {
    content = <EmptyState />;
  } else {
    content = (
      <>
        <div
          className={`modern-deck-stack ${dragState.overZone ? `drag-over-${dragState.overZone}` : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Render up to 3 cards for the stack effect, last card visually on top */}
          {topCards.map(renderStackCard)}
        </div>
        <div className="modern-deck-controls">
          <SwipeButton direction="left" onClick={handleSwipeLeft} />
          <SwipeButton direction="right" onClick={handleSwipeRight} />
        </div>
      </>
    );
  }

  return (
    <div className="modern-deck-bg">
      <div className="modern-deck-center-col">{content}</div>
    </div>
  );
}
