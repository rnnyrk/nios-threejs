'use client';
import { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

import { getEarthPoints } from './data';

export const Earth = () => {
  const earthRef = useRef<any>();
  const earthMap = useLoader(TextureLoader, 'images/earth-texture.jpeg');
  const { curves, points } = getEarthPoints();

  return (
    <group
      ref={earthRef}
      position-y={-0.5}
    >
      <mesh>
        <sphereGeometry />
        <meshBasicMaterial map={earthMap} />
      </mesh>
      {Object.values(points).map((position, index) => (
        <mesh
          key={`point-${index}`}
          scale={0.02}
          position={position}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))}
      {Object.values(curves).map((curvePoints, index) => (
        <mesh key={`curve-${index}`}>
          <tubeGeometry args={[curvePoints, 20, 0.01, 8, false]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      ))}
    </group>
  );
};
