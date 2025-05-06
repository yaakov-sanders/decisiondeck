import React from 'react';
import type { FC } from 'react';
import type { PlayingCardData } from './PlayingCardDeck';

export const PlayingCardComponent: FC<{ cardData: PlayingCardData }> = ({ cardData }) => (
  <div className="playing-card">
    <img src={cardData.image} alt={`${cardData.value} of ${cardData.suit}`} />
  </div>
); 