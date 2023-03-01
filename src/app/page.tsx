'use client';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { Controls } from 'modules/canvas/Controls';
import { Earth } from 'modules/canvas/Earth';
import { Gallery } from 'modules/canvas/Gallery';
import { CanvasGalleryContext } from 'modules/canvas/GalleryContext';
import { AnimatedGroup } from 'modules/canvas/AnimatedGroup';

const Home = () => {
  const containerRef = useRef<THREE.Group>(null);

  return (
    <CanvasGalleryContext>
      <Canvas>
        <AnimatedGroup ref={containerRef}>
          <Earth containerRef={containerRef} />
          <Gallery containerRef={containerRef} />
        </AnimatedGroup>
        <Controls />
      </Canvas>
    </CanvasGalleryContext>
  );
};

export default Home;
