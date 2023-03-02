'use client';
import { useContext, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import clamp from 'lodash/clamp';

import { GalleryContext } from 'modules/canvas/GalleryContext';
import { GalleryImage } from './GalleryImage';

export const Gallery = ({ containerRef }: GalleryProps) => {
  const galleryContext = useContext(GalleryContext);

  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    if (!galleryContext || progress >= 1) return;

    if (galleryContext.galleryActiveIndex > 0 && galleryContext.galleryActiveIndex !== false) {
      setProgress((prevProgress) => {
        const animationSpeed = 0.4;
        return THREE.MathUtils.damp(
          clamp((prevProgress += animationSpeed * delta), 0, 1),
          1,
          0.1,
          delta,
        );
      });
    }
  });

  const onNextImage = () => {
    if (!galleryContext || galleryContext.galleryActiveIndex === false) return;

    // Reset progress state when going to new image so useFrame can re-use it
    setProgress(0);

    // Set the next image in the gallery so useFrame above can animate the curve
    const nextPointIndex = galleryContext.galleryActiveIndex + 1;
    galleryContext.setGalleryActiveIndex(nextPointIndex);

    const nextPoint = galleryContext.gallery[nextPointIndex];

    // Animate useSpring to the next point
    const [x, y, z] = nextPoint.positions;
    const newTarget = new THREE.Vector3(-x, -y, z);

    galleryContext.setFocusPoint({
      from: [...galleryContext.focusPoint.to],
      to: [newTarget.x, newTarget.y, newTarget.z],
      isCurve: true, // removes initial delay (from Earth to Gallery) on animation
    });
  };

  return (
    <group>
      {galleryContext?.gallery.map((galleryItem, index) => {
        return (
          <GalleryImage
            key={`gallery-${index}`}
            {...{ galleryItem, index, onNextImage, progress }}
          />
        );
      })}
    </group>
  );
};

type GalleryProps = {
  containerRef: React.MutableRefObject<THREE.Group | null>;
};
