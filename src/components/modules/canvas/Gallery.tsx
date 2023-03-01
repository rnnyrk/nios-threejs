'use client';
import { Fragment, useContext } from 'react';
import * as THREE from 'three';

import { GalleryContext } from 'modules/canvas/GalleryContext';

export const Gallery = () => {
  const galleryContext = useContext(GalleryContext);

  return (
    <group>
      {galleryContext?.gallery.map(({ positions }, index) => {
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
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial color="#F9F9F9" />
            </mesh>
            {curve && (
              <mesh key={`curve-${index}`}>
                <tubeGeometry args={[curve, 100, 0.01, 8, false]} />
              </mesh>
            )}
          </Fragment>
        );
      })}
    </group>
  );
};
