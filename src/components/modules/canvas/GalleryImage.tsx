'use client';
import { useContext, useMemo, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';

import fragmentShader from 'shaders/fragment-line.glsl';
import vertexShader from 'shaders/vertex-line.glsl';
import { GalleryContext, type GalleryItem } from 'modules/canvas/GalleryContext';
import { GalleryImageText } from './GalleryImageText';

export const GalleryImage = ({
  galleryItem: { date, positions, image, title },
  index,
  onNextImage,
  progress,
}: GalleryImageProps) => {
  const curveRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const galleryContext = useContext(GalleryContext);

  // Save uniforms in useMemo so they are not reinitialized on every frame
  const curveUniforms = useMemo(
    () => ({
      uColorActive: { value: new THREE.Color(0xffffff) },
      uProgress: {
        value: 0,
      },
    }),
    [],
  );

  const imageMap = useLoader(TextureLoader, image);
  imageMap.encoding = THREE.sRGBEncoding;

  useFrame((state, delta) => {
    if (!galleryContext) return;

    if (progress >= 1) {
      galleryContext.setAnimComplete(true);
    }

    if (!curveRef?.current || progress >= 1) return;

    // Always animate the previous curve of the (new) active image
    if (
      galleryContext.galleryActiveIndex > 0 &&
      galleryContext.galleryActiveIndex !== false &&
      index === galleryContext.galleryActiveIndex - 1
    ) {
      const { uProgress } = curveRef.current.material.uniforms;
      uProgress.value = progress;
    }
  });

  const nextPoint = galleryContext?.gallery[index + 1];

  // Draw points in between the gallery images
  // Source from; https://twitter.com/Guitouxx/status/1630228514388553728
  let curve: THREE.CubicBezierCurve3 | null = null;
  if (nextPoint) {
    const oldX = positions[0];
    const oldY = positions[1];

    const newX = nextPoint.positions[0];
    const newY = nextPoint.positions[1];

    const points = [
      new THREE.Vector3(oldX, oldY, 0),
      new THREE.Vector3(oldX + Math.abs(newX - oldX) / 2, newY, 0),
      new THREE.Vector3(newX, newY, 0),
    ];

    curve = new THREE.CubicBezierCurve3(points[0], points[0], points[1], points[2]);
  }

  return (
    <>
      <mesh
        position={positions}
        renderOrder={2}
        onDoubleClick={onNextImage}
      >
        <planeGeometry args={[2, 2.8]} />
        <meshBasicMaterial
          map={imageMap}
          depthTest={false}
        />
      </mesh>

      <GalleryImageText {...{ date, positions, title }} />

      {curve && (
        <mesh
          renderOrder={1}
          ref={curveRef}
        >
          <tubeGeometry args={[curve, 50, 0.01, 8, false]} />
          <shaderMaterial
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            uniforms={curveUniforms}
          />
        </mesh>
      )}
    </>
  );
};

type GalleryImageProps = {
  galleryItem: GalleryItem;
  index: number;
  progress: number;
  onNextImage: () => void;
};
