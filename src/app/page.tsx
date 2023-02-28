'use client';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';

import { Earth } from 'modules/canvas/Earth';

const Home = () => {
  return (
    <Canvas>
      <Earth />
      {/* <Stats /> */}
      <OrbitControls
        minDistance={1.5}
        maxDistance={2.8}
      />
    </Canvas>
  );
};

export default Home;
