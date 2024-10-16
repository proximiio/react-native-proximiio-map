import { StyleSheet, Text, View } from 'react-native';
import type { ProximiioLocation } from 'react-native-proximiio';
import { useEffect, useState } from 'react';

interface Props {
  position?: ProximiioLocation;
}

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    minHeight: 78,
    width: '100%',
    backgroundColor: 'rgba(205, 0, 0, 0.9)',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 12,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
});

export default function Position({ position }: Props) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (position) {
      const lat = position.lat.toFixed(6);
      const lng = position.lng.toFixed(6);
      const accuracy = position.accuracy?.toFixed(1) ?? 'N/A';
      const source = position.sourceType;
      setTitle(
        `${lat} (lat) ${lng} (lng)\naccuracy: ${accuracy} (${source?.trimEnd()})`
      );
    } else {
      setTitle('Position not available');
    }
  }, [position]);

  return (
    <View style={style.container}>
      <Text style={style.text}>{title}</Text>
    </View>
  );
}
