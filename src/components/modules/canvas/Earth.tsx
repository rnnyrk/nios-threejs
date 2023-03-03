'use client';
import { useContext, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

import { getEarthPoints } from './data';
import { GalleryContext } from './GalleryContext';

export const Earth = ({ containerRef }: EarthProps) => {
  const earthRef = useRef<THREE.Group>(null);
  const earthMap = useLoader(TextureLoader, 'images/earth-texture.jpeg');

  const { curves, points } = getEarthPoints();
  const galleryContext = useContext(GalleryContext);
  const galleryIsActive = galleryContext?.galleryActiveIndex !== false;

  const [hoverActive, setHoverActive] = useState(false);

  useFrame((state, delta) => {
    if (earthRef.current && !hoverActive && !galleryIsActive) {
      earthRef.current.rotation.y += 0.1 * delta;
    }

    if (!galleryContext) return;

    if (galleryContext.galleryActiveIndex === 0) {
      // Reset the camera position when the gallery becomes active
      state.camera.position.lerp(new THREE.Vector3(0, 0, 4), 0.05);
      state.camera.lookAt(0, 0, 0);
      state.camera.updateProjectionMatrix();
    }
  });

  const onSetActive = () => {
    if (!galleryContext) return;
    setHoverActive(true);

    // Disable hover states on earth by setting the index from false to 0 (first image)
    galleryContext.setAnimComplete(false);
    galleryContext.setGalleryActiveIndex(0);

    // Animate to the first image in the gallery
    const [x, y, z] = galleryContext.gallery[0].positions;
    const newTarget = new THREE.Vector3(-x, -y, z);

    galleryContext.setFocusPoint({
      from: [...galleryContext.focusPoint.from],
      to: [newTarget.x, newTarget.y, newTarget.z],
      isCurve: false,
    });
  };

  const onPointerOver = () => {
    if (galleryIsActive) return;
    setHoverActive(true);
  };

  const onPointerOut = () => {
    if (galleryIsActive) return;
    setHoverActive(false);
  };

  return (
    <group
      ref={earthRef}
      rotation={[0, -1.9, 0]}
    >
      <mesh>
        <sphereGeometry args={[1, 25, 25]} />
        <meshBasicMaterial map={earthMap} />
      </mesh>
      {Object.values(points).map((position, index) => (
        <mesh
          key={`point-${index}`}
          scale={0.1}
          position={position}
          onClick={onSetActive}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          renderOrder={2}
        >
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshBasicMaterial color="#F9F9F9" />
        </mesh>
      ))}
      {Object.values(curves).map((curvePoints, index) => (
        <mesh
          key={`curve-${index}`}
          renderOrder={1}
        >
          <tubeGeometry args={[curvePoints, 15, 0.006, 8, false]} />
          <meshBasicMaterial color="#5B7D7C" />
        </mesh>
      ))}
    </group>
  );
};

type EarthProps = {
  containerRef: React.MutableRefObject<THREE.Group | null>;
};
