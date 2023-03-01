'use client';
import { Canvas } from '@react-three/fiber';

import { Controls } from 'modules/canvas/Controls';
import { Earth } from 'modules/canvas/Earth';
import { Gallery } from 'modules/canvas/Gallery';
import { CanvasGalleryContext } from 'modules/canvas/GalleryContext';

const Home = () => {
  return (
    <CanvasGalleryContext>
      <Canvas>
        <Earth />
        <Gallery />
        <Controls />
      </Canvas>
    </CanvasGalleryContext>
  );
};

export default Home;
