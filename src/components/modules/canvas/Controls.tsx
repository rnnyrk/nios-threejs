'use client';
import { useContext } from 'react';
import { useThree } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { GalleryContext } from './GalleryContext';
import { PerspectiveCamera } from 'three';

export const Controls = () => {
  const galleryContext = useContext(GalleryContext);
  const { gl, camera } = useThree();

  return (
    <group>
      {/* <PerspectiveCamera /> */}
      {/* <Stats /> */}
      {/* <OrbitControls
        enabled={!galleryContext?.galleryActive}
        // minDistance={1.5}
        // maxDistance={2.8}
        // target={[0, 0, 0]}
      /> */}
    </group>
  );
};
