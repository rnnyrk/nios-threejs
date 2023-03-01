import * as THREE from 'three';

export type PointArray = [x: number, y: number, z: number];

// Convert latitute and longitude to cartesian coordinates
// Based on this video tutorial: https://www.youtube.com/watch?v=2pUzJOfekVE
const latLngToCartesian = (points: { lat: number; lng: number }): PointArray => {
  const phi = (points.lat * Math.PI) / 180;
  const theta = ((points.lng + 180) * Math.PI) / 180;

  const x = -Math.cos(phi) * Math.cos(theta);
  const y = Math.sin(phi);
  const z = Math.cos(phi) * Math.sin(theta);

  return [x, y, z];
};

const getCurve = (p1: PointArray, p2: PointArray) => {
  const v1 = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const v2 = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const points: THREE.Vector3[] = [];

  const distance = new THREE.Vector3(p1[0], p1[1], p1[2]).distanceTo(
    new THREE.Vector3(p2[0], p2[1], p2[2]),
  );

  const amountOfPoints = 20;

  for (let i = 0; i <= amountOfPoints; i++) {
    const p = new THREE.Vector3().lerpVectors(v1, v2, i / amountOfPoints);

    let multiply = 0.03;
    if (distance > 0.2) {
      multiply = 0.06;
    } else if (distance > 0.5) {
      multiply = 0.09;
    }

    p.normalize().multiplyScalar(1 + multiply * Math.sin(Math.PI * (i / amountOfPoints)));
    points.push(p);
  }

  const path = new THREE.CatmullRomCurve3(points);
  return path;
};

const points = {
  amsterdam: latLngToCartesian({
    lat: 52.36521,
    lng: 4.84378,
  }),
  kosovo: latLngToCartesian({
    lat: 42.6026,
    lng: 20.903,
  }),
  bulgaria: latLngToCartesian({
    lat: 42.7339,
    lng: 25.4858,
  }),
  pakistan: latLngToCartesian({
    lat: 30.3753,
    lng: 69.3451,
  }),
  kathmandu: latLngToCartesian({
    lat: 27.700769,
    lng: 85.30014,
  }),
};

export const getEarthPoints = () => {
  const curves: THREE.CatmullRomCurve3[] = [];
  const pointKeys = Object.keys(points);

  Object.entries(points).forEach(([key, value], index) => {
    const next = points[pointKeys[index + 1]];
    if (index === pointKeys.length || !next) return;

    const curve = getCurve(value, next);
    curves.push(curve);
  });

  return { curves, points };
};
