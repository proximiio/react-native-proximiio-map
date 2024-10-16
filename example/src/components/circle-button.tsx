import { StyleSheet, TouchableOpacity } from 'react-native';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  backgroundColor: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  opacity?: number;
}

const style = StyleSheet.create({
  container: {
    zIndex: 100,
    borderRadius: 28,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
});

export default function CircleButton({
  size = 56,
  children,
  backgroundColor,
  onPress,
  disabled,
  opacity,
}: Props) {
  const defaultOpacity = disabled ? 0.5 : 1;
  const realOpacity = typeof opacity !== 'undefined' ? opacity : defaultOpacity;

  const _style = {
    ...style.container,
    backgroundColor,
    opacity: realOpacity,
    width: size,
    height: size,
  };

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={_style}>
      {children}
    </TouchableOpacity>
  );
}
