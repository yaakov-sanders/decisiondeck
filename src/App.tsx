import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation.tsx';
import { ThemeToggle } from './components/ThemeToggle.tsx';
import { DecisionDeckView } from './components/deck-view/DecisionDeckView.tsx';
import { GooglePhotosDeck } from './google-photos/GooglePhotosDeck.ts';
import { PlayingCardDeck } from './demo/PlayingCardDeck.ts';
import './App.css';
function App() {
  return (
    <div className="app">
      <ThemeToggle />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/google-photos" element={<GooglePhotosView />} />
        <Route path="/playing-cards" element={<PlayingCardsView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// Home component
function Home() {
  return (
    <div className="home">
      <h1>Welcome to Card Deck App</h1>
      <p>Choose a deck type from the navigation menu</p>
    </div>
  );
}

// Google Photos view component
function GooglePhotosView() {
  const [deck] = useState(() => new GooglePhotosDeck());

  return <DecisionDeckView deck={deck} />;
}

// Playing Cards view component
function PlayingCardsView() {
  const [deck] = useState(() => new PlayingCardDeck());

  return <DecisionDeckView deck={deck} />;
}

// Not Found component
function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
    </div>
  );
}

export default App;
