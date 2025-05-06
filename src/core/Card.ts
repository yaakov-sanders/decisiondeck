import type { ComponentType } from 'react';

export interface CardMetadata {
  id: string;
  type: string;
  timestamp: number;
}

export interface BaseCardData {
  id: string;
  type: string;
  timestamp: number;
}

export abstract class Card<T extends BaseCardData> {
  protected data: T;
  
  constructor(data: T) {
    this.data = data;
  }
  
  // Get the React component that renders this card
  abstract getCardComponent(): ComponentType;
  
  // Get card metadata for animations/transitions
  getMetadata(): CardMetadata {
    return {
      id: this.data.id,
      type: this.data.type,
      timestamp: this.data.timestamp
    };
  }

  // Get the raw data
  getData(): T {
    return this.data;
  }
} 