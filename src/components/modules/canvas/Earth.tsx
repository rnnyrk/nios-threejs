'use client';
import { useContext, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

import { getEarthPoints } from './data';
import { GalleryContext } from './GalleryContext';

export const Earth = () => {
  const earthRef = useRef<any>();
  const cameraControlsRef = useRef<CameraControls>(null);
  const earthMap = useLoader(TextureLoader, 'images/earth-texture.jpeg');

  const { curves, points } = getEarthPoints();
  const galleryContext = useContext(GalleryContext);

  const [hoverActive, setHoverActive] = useState(false);

  useFrame((state, delta) => {
    if (earthRef.current && !hoverActive && !galleryContext?.galleryActive) {
      earthRef.current.rotation.y += 0.1 * delta;
    }

    if (galleryContext?.galleryActive && cameraControlsRef.current) {
      const [x, y, z] = galleryContext?.gallery[0].positions;
      const newTarget = new THREE.Vector3(x, y, z + 2);

      state.camera.position.lerp(newTarget, 0.75);
      state.camera.updateProjectionMatrix();

      cameraControlsRef?.current.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        x,
        y,
        z,
        true,
      );
    }

    return cameraControlsRef?.current?.update(delta);
  });

  const onSetActive = () => {
    if (!galleryContext) return;
    setHoverActive(true);
    galleryContext.setGalleryActive(true);
  };

  const onPointerOver = () => {
    if (galleryContext?.galleryActive) return;
    setHoverActive(true);
  };

  const onPointerOut = () => {
    if (galleryContext?.galleryActive) return;
    setHoverActive(false);
  };

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        distance={2}
        minDistance={1.5}
        maxDistance={2.8}
      />
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
            onClick={onSetActive}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
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
    </>
  );
};
