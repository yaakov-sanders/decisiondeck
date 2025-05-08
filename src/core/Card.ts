import type { ComponentType } from 'react';

export interface CardMetadata {
  id: string;
}

export interface BaseCardData {
  id: string;
}

export abstract class Card<T extends BaseCardData> {
  protected data: T;

  constructor(data: T) {
    this.data = data;
  }

  // Get the React component that renders this card
  abstract getCardComponent(): ComponentType<{ cardData: T }>;

  // Get card metadata for animations/transitions
  getMetadata(): CardMetadata {
    return {
      id: this.data.id,
    };
  }

  // Get the raw data
  getData(): T {
    return this.data;
  }
}
