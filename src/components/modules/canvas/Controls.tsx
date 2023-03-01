'use client';
import { useContext } from 'react';
import { OrbitControls } from '@react-three/drei';
import { GalleryContext } from './GalleryContext';

export const Controls = () => {
  const galleryContext = useContext(GalleryContext);
  const isGalleryActive = galleryContext?.galleryActiveIndex !== false;

  return (
    <group>
      <OrbitControls
        enabled={!isGalleryActive}
        enableZoom={!isGalleryActive}
        enablePan={!isGalleryActive}
        minDistance={2}
        maxDistance={4}
      />
    </group>
  );
};
