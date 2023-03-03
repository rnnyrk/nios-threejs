'use client';
import * as i from 'types';
import { createContext, useMemo, useState } from 'react';

import { type PointArray } from './data';

const getRandomArbitrary = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const galleryData = [
  {
    title: 'Amsterdam, Netherlands',
    date: 'January 2019 - March 2019',
    image: '/images/netherlands.png',
  },
  {
    title: 'Pristina, Kosovo',
    date: 'February 2020 - March 2020',
    image: '/images/albania.png',
  },
  {
    title: 'Sofia, Bulgaria',
    date: 'March 2020 - October 2020',
    image: '/images/bulgaria.png',
  },
  {
    title: 'Islamabad, Pakistan Nepal',
    date: 'October 2020 - April 2021',
    image: '/images/iran.png',
  },
  {
    title: 'Kathmandu, Nepal',
    date: 'May 2021 - September 2022',
    image: '/images/nepal.png',
  },
];

export const createGallery = (): GalleryItem[] => {
  let previousOffsetX = 0;
  let previousOffsetY = 0;

  const images = Array.from({ length: 5 }).map((_, index) => {
    const offsetX = getRandomArbitrary(0, 8) + previousOffsetX ?? 0;
    const offsetY = getRandomArbitrary(4, 6) + previousOffsetY ?? 0;

    previousOffsetX = offsetX - 4;
    previousOffsetY = offsetY + 6;

    return {
      positions: [offsetX, -offsetY, 0] as PointArray,
      ...galleryData[index],
    };
  });

  return images;
};

export const GalleryContext = createContext<GalleryContextType | null>(null);

export const CanvasGalleryContext = ({ children }: CanvasGalleryContextProps) => {
  const [galleryActiveIndex, setGalleryActiveIndex] = useState<number | false>(false);
  const [animComplete, setAnimComplete] = useState(false);

  const [focusPoint, setFocusPoint] = useState<FocusPoints>({
    from: [0, 0, 4],
    to: [0, 0, 0],
    isCurve: false,
  });

  const gallery = useMemo(createGallery, []);

  return (
    <GalleryContext.Provider
      value={{
        gallery,
        galleryActiveIndex,
        setGalleryActiveIndex,

        animComplete,
        setAnimComplete,

        focusPoint,
        setFocusPoint,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export type GalleryItem = {
  date: string;
  image: string;
  positions: PointArray;
  title: string;
};

type FocusPoints = {
  from: PointArray;
  to: PointArray;
  isCurve: boolean;
};

type GalleryContextType = {
  animComplete: boolean;
  setAnimComplete: i.SetState<boolean>;

  focusPoint: FocusPoints;
  setFocusPoint: i.SetState<FocusPoints>;

  gallery: GalleryItem[];
  galleryActiveIndex: number | false;
  setGalleryActiveIndex: i.SetState<number | false>;
};

type CanvasGalleryContextProps = {
  children: React.ReactNode;
};
