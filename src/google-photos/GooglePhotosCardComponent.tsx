import React from 'react';
import type { FC } from 'react';
import type { GooglePhotoData } from './GooglePhotosDeck.ts';

export const GooglePhotosCardComponent: FC<{ cardData: GooglePhotoData }> = ({ cardData }) => (
  <div className="playing-card">
    <img src={cardData.url} alt={cardData.filename} />
  </div>
);
