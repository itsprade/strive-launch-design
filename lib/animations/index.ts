// Animation utilities and exports
export * from './variants';

// Common transition configs
export const spring = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothSpring = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

export const bouncy = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
};
