import React from 'react';
import { Card } from '../core/Card';
import type { BaseCardData } from '../core/Card';
import { DecisionDeck } from '../core/DecisionDeck';
import type { FC } from 'react';

// Define the playing card data structure
interface PlayingCardData extends BaseCardData {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  color: 'red' | 'black';
}

// Create the playing card component
class PlayingCard extends Card<PlayingCardData> {
  getCardComponent(): FC {
    const CardComponent: FC = () => (
      <div className="playing-card" style={{ color: this.data.color }}>
        <div className="card-value">{this.data.value}</div>
        <div className="card-suit">{this.data.suit}</div>
      </div>
    );
    return CardComponent;
  }
}

// Create a demo deck implementation
export class PlayingCardDeck extends DecisionDeck<PlayingCardData> {
  private currentPage: number = 0;
  private readonly suits: PlayingCardData['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
  private readonly values: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  constructor(pageSize: number = 5) {
    super(pageSize);
  }
  
  async authenticate(): Promise<void> {
    // No authentication needed for demo
    return Promise.resolve();
  }
  
  async fetchNextPage(): Promise<PlayingCard[]> {
    // Generate a page of cards
    const cards: PlayingCard[] = [];
    const startIndex = this.currentPage * this.pageSize;
    
    for (let i = 0; i < this.pageSize; i++) {
      const index = startIndex + i;
      if (index >= 52) break; // Standard deck has 52 cards
      
      const suit = this.suits[Math.floor(index / 13)];
      const value = this.values[index % 13];
      const color = suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
      
      cards.push(new PlayingCard({
        id: `${suit}-${value}`,
        type: 'playing-card',
        timestamp: Date.now(),
        suit,
        value,
        color
      }));
    }
    
    this.currentPage++;
    return cards;
  }
  
  async handleSwipeLeft(card: Card<PlayingCardData>): Promise<void> {
    // Just advance to next card
    this.advance();
  }
  
  async handleSwipeRight(card: Card<PlayingCardData>): Promise<void> {
    // Just advance to next card
    this.advance();
  }
} 