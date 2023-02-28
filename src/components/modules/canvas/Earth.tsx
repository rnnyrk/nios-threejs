'use client';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export const Earth = () => {
  const earthRef = useRef<any>();
  const earthMap = useLoader(TextureLoader, 'images/earth-texture.jpeg');

  // useFrame(({ clock }) => {
  //   if (!earthRef?.current) return;
  //   earthRef.current.rotation.y = -clock.getElapsedTime() / 20;
  // });

  // Convert latitute and longitude to cartesian coordinates
  // Source: https://www.youtube.com/watch?v=2pUzJOfekVE
  const latLngToCartesian = (points: {
    lat: number;
    lng: number;
  }): [x: number, y: number, z: number] => {
    const phi = (points.lat * Math.PI) / 180;
    const theta = ((points.lng + 180) * Math.PI) / 180;

    const x = -Math.cos(phi) * Math.cos(theta);
    const y = Math.sin(phi);
    const z = Math.cos(phi) * Math.sin(theta);

    return [x, y, z];
  };

  const getCurve = (p1, p2) => {
    const v1 = new THREE.Vector3(p1[0], p1[1], p1[2]);
    const v2 = new THREE.Vector3(p2[0], p2[1], p2[2]);
    const points: THREE.Vector3[] = [];

    const amountOfPoints = 20;

    for (let i = 0; i <= amountOfPoints; i++) {
      const p = new THREE.Vector3().lerpVectors(v1, v2, i / amountOfPoints);
      p.normalize().multiplyScalar(1 + 0.1 * Math.sin(Math.PI * (i / amountOfPoints)));
      points.push(p);
    }

    const path = new THREE.CatmullRomCurve3(points);
    return path;
  };

  const amsterdamPoints = latLngToCartesian({
    lat: 52.36521,
    lng: 4.84378,
  });

  const kathmanduPoints = latLngToCartesian({
    lat: 27.700769,
    lng: 85.30014,
  });

  const curvePoints = getCurve(amsterdamPoints, kathmanduPoints);

  return (
    <group
      ref={earthRef}
      position-y={-0.5}
    >
      <mesh>
        <sphereGeometry />
        <meshBasicMaterial map={earthMap} />
      </mesh>
      <mesh
        scale={0.02}
        position={amsterdamPoints}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <mesh
        scale={0.02}
        position={kathmanduPoints}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="green" />
      </mesh>

      <mesh>
        <tubeGeometry args={[curvePoints, 20, 0.01, 8, false]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
    </group>
  );
};
