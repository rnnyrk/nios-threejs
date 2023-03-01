'use client';
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';

import { Controls } from 'modules/canvas/Controls';
import { Earth } from 'modules/canvas/Earth';
import { Gallery } from 'modules/canvas/Gallery';
import { CanvasGalleryContext } from 'modules/canvas/GalleryContext';

const Home = () => {
  const cameraControlsRef = useRef<CameraControls>(null);

  return (
    <CanvasGalleryContext>
      <Canvas>
        <Earth cameraControlsRef={cameraControlsRef} />
        <Gallery cameraControlsRef={cameraControlsRef} />
        <CameraControls
          ref={cameraControlsRef}
          distance={2}
          minDistance={1.5}
          maxDistance={2.8}
        />
      </Canvas>
    </CanvasGalleryContext>
  );
};

export default Home;
