import React from 'react';
import { PlayingCardDeck } from './PlayingCardDeck';
import { DecisionDeckView } from '../components/DecisionDeckView';

export const DemoPage: React.FC = () => {
  const [deck] = React.useState(() => new PlayingCardDeck());
  return <DecisionDeckView deck={deck} />;
}; 