import { animated, useSpring, useTrail } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { useContext } from 'react';

import { type PointArray } from './data';
import { GalleryContext } from './GalleryContext';

const AnimatedText = animated(Text);

export const GalleryImageText = ({ date, title, positions }: GalleryImageTextProps) => {
  const galleryContext = useContext(GalleryContext);

  const titleSpring = useSpring({
    from: {
      position: [0, 0.5, 0],
      fillOpacity: 0,
    },
    to: {
      position: galleryContext?.animComplete ? [0, 0, 0] : [0, 0.2, 0],
      fillOpacity: galleryContext?.animComplete ? 1 : 0,
    },
    config: {
      mass: 5,
      friction: 120,
      tension: 120,
      duration: 350,
    },
  });

  const textSpring = useSpring({
    from: {
      position: [0, 0.5, 0],
      fillOpacity: 0,
    },
    to: {
      position: galleryContext?.animComplete ? [0, -0.25, 0] : [0, 0.01, 0],
      fillOpacity: galleryContext?.animComplete ? 1 : 0,
    },
    config: {
      mass: 5,
      friction: 120,
      tension: 120,
      duration: 350,
    },
    delay: 100,
  });

  return (
    <group
      position={[positions[0] + 0.65, positions[1] - 0.8, positions[2]]}
      renderOrder={3}
    >
      <AnimatedText
        color="white"
        fontSize={0.3}
        letterSpacing={-0.05}
        anchorX="left"
        font="https://fonts.gstatic.com/s/quicksand/v7/6xKtdSZaM9iE8KbpRA_hK1QL.woff"
        {...titleSpring}
      >
        {title}
      </AnimatedText>
      <AnimatedText
        color="white"
        fontSize={0.15}
        letterSpacing={-0.05}
        anchorX="left"
        font="https://fonts.gstatic.com/s/quicksand/v7/6xKtdSZaM9iE8KbpRA_hK1QL.woff"
        {...textSpring}
      >
        {date}
      </AnimatedText>
    </group>
  );
};

type GalleryImageTextProps = {
  date: string;
  title: string;
  positions: PointArray;
};
