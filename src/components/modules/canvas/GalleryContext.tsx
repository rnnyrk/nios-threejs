'use client';
import * as i from 'types';
import { createContext, useMemo, useState } from 'react';

import { type PointArray } from './data';

const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const createGallery = (): Gallery => {
  let previousOffsetX = 0;
  let previousOffsetY = 0;

  const images = Array.from({ length: 3 }).map((_, index) => {
    const offsetX = getRandomArbitrary(-3, 3) + previousOffsetX ?? 0 / 2;
    const offsetY = getRandomArbitrary(4, 8) + previousOffsetY ?? 0;

    previousOffsetX = offsetX;
    previousOffsetY = offsetY;

    let title = 'Kathmandu, Nepal';
    let date = 'March 2020 - October 2021';

    if (index === 1) {
      title = 'Amsterdam, Netherlands';
      date = 'January 2019 - March 2019';
    } else if (index === 2) {
      title = 'Sofia, Bulgaria';
      date = 'February 2020 - March 2020';
    }

    return {
      positions: [offsetX, -offsetY, 0] as PointArray,
      image: null,
      title,
      date,
    };
  });

  return images;
};

export const GalleryContext = createContext<GalleryContextType | null>(null);

export const CanvasGalleryContext = ({ children }: CanvasGalleryContextProps) => {
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | false>(false);
  const [focusPoint, setFocusPoint] = useState<FocusPoints>({
    from: [0, 0, 4],
    to: [0, 0, 0],
    isCurve: false,
  });

  const gallery = useMemo(() => {
    return createGallery();
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        gallery,
        galleryActiveIndex,
        setGalleryActiveIndex,
        focusPoint,
        setFocusPoint,
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

type FocusPoints = {
  from: PointArray;
  to: PointArray;
  isCurve: boolean;
};

type GalleryContextType = {
  gallery: Gallery;
  galleryActiveIndex: number | false;
  setGalleryActiveIndex: i.SetState<number | false>;
  focusPoint: FocusPoints;
  setFocusPoint: i.SetState<FocusPoints>;
};

type CanvasGalleryContextProps = {
  children: React.ReactNode;
};
