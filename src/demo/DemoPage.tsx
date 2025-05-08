import React from 'react';
import { PlayingCardDeck } from './PlayingCardDeck';
import { DecisionDeckView } from '../components/DecisionDeckView';
import { ThemeToggle } from '../components/ThemeToggle';

export const DemoPage: React.FC = () => {
  const [deck] = React.useState(() => new PlayingCardDeck());
  return (
    <>
      <ThemeToggle />
      <DecisionDeckView deck={deck} />
    </>
  );
};
