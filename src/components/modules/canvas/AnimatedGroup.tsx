import { forwardRef, useContext } from 'react';
import { animated, useSpring } from '@react-spring/three';

import { GalleryContext } from './GalleryContext';

export const AnimatedGroup = forwardRef(
  ({ children }: AnimatedGroupProps, ref: React.Ref<THREE.Group>) => {
    const galleryContext = useContext(GalleryContext);

    const { position } = useSpring({
      position: galleryContext!.focusPoint.to,
      from: {
        position: galleryContext!.focusPoint.from,
      },
      delay: galleryContext!.focusPoint ? 0 : 1000,
      config: {
        mass: 1,
        tension: 100,
        friction: 20,
        duration: 2000,
      },
      onRest: () => {
        if (!galleryContext) return;
        galleryContext.setAnimComplete(true);
      },
    });

    return (
      <animated.group
        position={position}
        ref={ref}
      >
        {children}
      </animated.group>
    );
  },
);

type AnimatedGroupProps = {
  children: React.ReactNode;
};
