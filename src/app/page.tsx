'use client';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';

import { Earth } from 'modules/canvas/Earth';

const Home = () => {
  return (
    <Canvas>
      <Earth />
      <Stats />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
};

export default Home;
