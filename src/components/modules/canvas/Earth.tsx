'use client';
import { useRef, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

import { getEarthPoints } from './data';

export const Earth = () => {
  const earthRef = useRef<any>();
  const earthMap = useLoader(TextureLoader, 'images/earth-texture.jpeg');
  const { curves, points } = getEarthPoints();
  const [elementActive, setElementActive] = useState(false);

  useFrame((state, delta) => {
    if (earthRef.current && !elementActive) {
      earthRef.current.rotation.y += 0.1 * delta;
    }
  });

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
          scale={0.016}
          position={position}
          onPointerOver={() => setElementActive(true)}
          onPointerOut={() => setElementActive(false)}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color="#F9F9F9" />
        </mesh>
      ))}
      {Object.values(curves).map((curvePoints, index) => (
        <mesh key={`curve-${index}`}>
          <tubeGeometry args={[curvePoints, 15, 0.006, 8, false]} />
          <meshBasicMaterial color="#5B7D7C" />
        </mesh>
      ))}
    </group>
  );
};
