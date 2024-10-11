import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { Amenity, Feature } from 'react-native-proximiio-map';
import { useCallback } from 'react';

interface Props {
  feature: Feature;
  amenity: Amenity;
  onSelect: (feature: Feature) => void;
}

const style = StyleSheet.create({
  container: {
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { width: 28, height: 28 },
  title: { flex: 1 },
});

export default function FeatureItem({ feature, amenity, onSelect }: Props) {
  const select = useCallback(() => onSelect(feature), [feature, onSelect]);

  return (
    <TouchableOpacity onPress={select} style={style.container}>
      <Image source={{ uri: amenity?.icon }} style={style.icon} />
      <Text style={style.title}>{feature.properties.title as string}</Text>
    </TouchableOpacity>
  );
}
