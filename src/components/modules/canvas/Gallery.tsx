'use client';
import { Fragment, useContext, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import clamp from 'lodash/clamp';

import fragmentShader from 'shaders/fragment-line.glsl';
import vertexShader from 'shaders/vertex-line.glsl';

import { GalleryContext } from 'modules/canvas/GalleryContext';

type CurveRef = THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;

export const Gallery = ({ containerRef }: GalleryProps) => {
  const galleryContext = useContext(GalleryContext);

  const curveRefs = useRef<CurveRef[]>([]);
  const [nextCurve, setNextCurve] = useState<THREE.CubicBezierCurve3 | null>(null);
  const [progress, setProgress] = useState(0);

  const addToRefs: (el: CurveRef) => void = (el) => {
    if (el && !curveRefs.current.includes(el)) {
      curveRefs.current.push(el);
    }
  };

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
    if (
      !containerRef?.current ||
      !galleryContext ||
      !curveRefs?.current ||
      !nextCurve ||
      progress >= 1
    )
      return;

    if (galleryContext.galleryActiveIndex > 0 && galleryContext.galleryActiveIndex !== false) {
      setProgress((prevProgress) =>
        THREE.MathUtils.damp(clamp((prevProgress += 0.32 * delta), 0, 1), 1, 0.1, delta),
      );

      // Always animate the previous curve of the (new) active image
      const activeCurve = curveRefs.current[galleryContext.galleryActiveIndex - 1];
      const { uProgress } = activeCurve.material.uniforms;
      uProgress.value = progress;
    }
  });

  const onNextImage = (curve: THREE.CubicBezierCurve3) => {
    if (!galleryContext || galleryContext.galleryActiveIndex === false) return;

    // Reset progress state when going to new image so useFrame can re-use it
    setProgress(0);

    // Set the next image in the gallery so useFrame above can animate the curve
    const nextPointIndex = galleryContext.galleryActiveIndex + 1;
    galleryContext.setGalleryActiveIndex(nextPointIndex);

    const nextPoint = galleryContext.gallery[nextPointIndex];
    setNextCurve(curve);

    // Animate useSpring to the next point
    const [x, y, z] = nextPoint.positions;
    const newTarget = new THREE.Vector3(-x, -y, z);

    galleryContext.setFocusPoint({
      from: [...galleryContext.focusPoint.to],
      to: [newTarget.x, newTarget.y, newTarget.z],
      isCurve: true, // removes initial delay (from Earth to Gallery) on animation
    });
  };

  return (
    <group>
      {galleryContext?.gallery.map(({ date, positions, title }, index) => {
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
          <Fragment key={`gallery-${index}`}>
            <mesh
              key={`plane-${index}`}
              position={positions}
              renderOrder={2}
              ref={curveRefs[index]}
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
              onClick={() => curve && onNextImage(curve)}
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
                ref={addToRefs}
              >
                <tubeGeometry args={[curve, 50, 0.01, 8, false]} />
                <shaderMaterial
                  fragmentShader={fragmentShader}
                  vertexShader={vertexShader}
                  uniforms={curveUniforms}
                />
              </mesh>
            )}
          </Fragment>
        );
      })}
    </group>
  );
};

type GalleryProps = {
  containerRef: React.MutableRefObject<THREE.Group | null>;
};
