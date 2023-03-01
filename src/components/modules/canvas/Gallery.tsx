'use client';
import { Fragment, useContext, useRef, useState } from 'react';
import { Text, CameraControls } from '@react-three/drei';
import * as THREE from 'three';
import clamp from 'lodash/clamp';

import fragmentShader from 'shaders/fragment-line.glsl';
import vertexShader from 'shaders/vertex-line.glsl';

import { GalleryContext } from 'modules/canvas/GalleryContext';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

type CurveRef = THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;

export const Gallery = ({ cameraControlsRef }: GalleryProps) => {
  const galleryContext = useContext(GalleryContext);

  const curveRefs = useRef<CurveRef[]>([]);
  const [nextCurve, setNextCurve] = useState<THREE.CubicBezierCurve3 | null>(null);
  const [progress, setProgress] = useState(0);

  const addToRefs: (el: CurveRef) => void = (el) => {
    if (el && !curveRefs.current.includes(el)) {
      curveRefs.current.push(el);
    }
  };

  useFrame((state, delta) => {
    if (
      !cameraControlsRef?.current ||
      !galleryContext ||
      !curveRefs?.current ||
      !nextCurve ||
      progress >= 1
    )
      return;

    if (galleryContext.galleryActiveIndex > 0 && galleryContext.galleryActiveIndex !== false) {
      const [x, y, z] = galleryContext.gallery[galleryContext.galleryActiveIndex].positions;

      setProgress((prevProgress) =>
        THREE.MathUtils.damp(clamp((prevProgress += 0.1 * delta), 0, 1), 1, 0.1, delta),
      );

      const { uProgress } = curveRefs.current[0].material.uniforms;
      uProgress.value = THREE.MathUtils.damp(uProgress.value, progress, 6, delta);

      const position = nextCurve.getPointAt(progress);

      // state.camera.position.x = MathUtils.damp(state.camera.position.x, position.x, 6, delta);
      // state.camera.position.y = MathUtils.damp(state.camera.position.y, position.y, 6, delta);
      // state.camera.position.z = 4;
      // state.camera.updateProjectionMatrix();

      // cameraControlsRef.current.setPosition(
      //   state.camera.position.x,
      //   state.camera.position.y,
      //   state.camera.position.z,
      // );

      cameraControlsRef.current.setPosition(
        MathUtils.damp(state.camera.position.x, position.x, 6, delta),
        MathUtils.damp(state.camera.position.y, position.y, 6, delta),
        2,
      );

      cameraControlsRef.current.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        x,
        y,
        z,
        true,
      );
    }

    return cameraControlsRef.current.update(delta);
  });

  const onNextImage = (curve: THREE.CubicBezierCurve3) => {
    if (!galleryContext || galleryContext.galleryActiveIndex === false) return;

    setProgress(0);
    const nextPointIndex = galleryContext.galleryActiveIndex + 1;

    galleryContext.setGalleryActiveIndex(nextPointIndex);
    setNextCurve(curve);
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
                <tubeGeometry args={[curve, 100, 0.01, 8, false]} />
                <meshBasicMaterial color="#FFFFFF" />
                <shaderMaterial
                  fragmentShader={fragmentShader}
                  vertexShader={vertexShader}
                  uniforms={{
                    uColorActive: { value: new THREE.Vector3(0.912, 0.191, 0.652) },
                    uProgress: { value: 0 },
                  }}
                  uniformsNeedUpdate
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
  cameraControlsRef: React.MutableRefObject<CameraControls | null>;
};
