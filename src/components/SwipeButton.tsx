import React, { useEffect } from 'react';

export type SwipeDirection = 'left' | 'right';

interface SwipeButtonProps {
  direction: SwipeDirection;
  onClick: () => void;
}

export const SwipeButton: React.FC<SwipeButtonProps> = ({ direction, onClick }) => {
  const isLeft = direction === 'left';
  const color = isLeft ? '#F44336' : '#4CAF50';
  const ariaLabel = `Swipe ${direction}`;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === `arrow${direction}`) {
        onClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, onClick]);

  return (
    <button
      className={`modern-swipe-btn swipe-${direction}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="28" cy="28" r="28" fill={color} />
        {isLeft ? (
          <>
            <path d="M36 20L20 36" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M20 20L36 36" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : (
          <path
            d="M18 28L26 36L38 22"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
};
