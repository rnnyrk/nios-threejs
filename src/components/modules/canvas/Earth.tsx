'use client';
import { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export const Earth = () => {
  const earthRef = useRef<any>();
  const earthMap = useLoader(TextureLoader, 'images/earth-texture.jpeg');

  useFrame(({ clock }) => {
    if (!earthRef?.current) return;
    earthRef.current.rotation.y = clock.getElapsedTime() / 5;
  });

  return (
    <mesh
      scale={2.5}
      position-y={-0.5}
      ref={earthRef}
    >
      <sphereGeometry />
      <meshBasicMaterial map={earthMap} />
    </mesh>
  );
};
