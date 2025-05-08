import React from "react";
import './EmptyState.css';

const EmptyState: React.FC = () => (
  <div data-testid="empty-state" className="empty-state">
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="80" height="80" rx="16" stroke="#E57373" strokeWidth="6" fill="none" />
      <rect x="50" y="50" width="20" height="20" rx="4" transform="rotate(45 60 60)" stroke="#E57373" strokeWidth="6" fill="none" />
    </svg>
    <h2 className="empty-state-title">No cards</h2>
    <p className="empty-state-desc">
      There are no cards to display.
    </p>
  </div>
);

export default EmptyState; 