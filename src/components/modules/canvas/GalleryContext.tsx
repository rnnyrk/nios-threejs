'use client';
import * as i from 'types';
import { createContext, useState } from 'react';

import { type PointArray } from './data';

type Gallery = {
  positions: PointArray;
  image: string | null;
}[];

const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const createGallery = (): Gallery => {
  let previousOffsetX = 0;
  let previousOffsetY = 0;

  const images = Array.from({ length: 3 }).map((_, index) => {
    const offsetX = getRandomArbitrary(2, -2) + previousOffsetX / 2 ?? 0;
    const offsetY = getRandomArbitrary(4, 6) + previousOffsetY ?? 0;

    previousOffsetX = offsetX;
    previousOffsetY = offsetY;

    return {
      positions: [offsetX, -offsetY, 0] as PointArray,
      image: null,
    };
  });

  return images;
};

export const GalleryContext = createContext<GalleryContextType | null>(null);

export const CanvasGalleryContext = ({ children }: CanvasGalleryContextProps) => {
  const [galleryActive, setGalleryActive] = useState(false);

  return (
    <GalleryContext.Provider
      value={{
        gallery: createGallery(),
        galleryActive,
        setGalleryActive,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

type GalleryContextType = {
  gallery: Gallery;
  galleryActive: boolean;
  setGalleryActive: i.SetState<boolean>;
};

type CanvasGalleryContextProps = {
  children: React.ReactNode;
};
