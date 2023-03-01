'use client';
import * as i from 'types';
import { createContext, useState } from 'react';

import { type PointArray } from './data';

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
      title:
        index === 1
          ? 'Amsterdam, Netherlands'
          : index === 2
          ? 'Sofia, Bulgaria'
          : 'Kathmandu, Nepal',
      date: 'March 2020 - June 2021',
    };
  });

  return images;
};

export const GalleryContext = createContext<GalleryContextType | null>(null);

export const CanvasGalleryContext = ({ children }: CanvasGalleryContextProps) => {
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | false>(false);

  return (
    <GalleryContext.Provider
      value={{
        gallery: createGallery(),
        galleryActiveIndex,
        setGalleryActiveIndex,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

type Gallery = {
  date: string;
  image: string | null;
  positions: PointArray;
  title: string;
}[];

type GalleryContextType = {
  gallery: Gallery;
  galleryActiveIndex: number | false;
  setGalleryActiveIndex: i.SetState<number | false>;
};

type CanvasGalleryContextProps = {
  children: React.ReactNode;
};
