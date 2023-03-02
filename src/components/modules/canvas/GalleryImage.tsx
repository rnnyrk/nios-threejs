'use client';
import { useContext, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

import fragmentShader from 'shaders/fragment-line.glsl';
import vertexShader from 'shaders/vertex-line.glsl';
import { GalleryContext, type GalleryItem } from 'modules/canvas/GalleryContext';

export const GalleryImage = ({
  galleryItem: { positions, title, date },
  index,
  onNextImage,
  progress,
}: GalleryImageProps) => {
  const curveRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const galleryContext = useContext(GalleryContext);

  const curveUniforms = useMemo(
    () => ({
      uColorActive: { value: new THREE.Color(0xffffff) },
      uProgress: {
        value: 0,
      },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!galleryContext || !curveRef?.current || progress >= 1) return;

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
        key={`plane-${index}`}
        position={positions}
        renderOrder={2}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#FFFFFF"
          depthTest={false}
        />
      </mesh>

      <group
        key={`text-${index}`}
        position={[positions[0] + 1.2, positions[1], 0]}
        onClick={onNextImage}
      >
        <Text
          color="white"
          fontSize={0.15}
          textAlign="left"
        >
          {title}
        </Text>
        <Text
          color="white"
          fontSize={0.1}
          position-y={-0.2}
          textAlign="left"
        >
          {date}
        </Text>
      </group>

      {curve && (
        <mesh
          key={`curve-${index}`}
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
