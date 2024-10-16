import type { Amenity } from 'react-native-proximiio-map';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useCallback } from 'react';
import Badge from './badge';

interface Props {
  amenity: Amenity;
  featureCount: number;
  onSelect: (amenity: Amenity) => void;
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
  chevron: { width: 14, height: 14 },
});

export default function AmenityItem({
  amenity,
  featureCount,
  onSelect,
}: Props) {
  const select = useCallback(() => onSelect(amenity), [amenity, onSelect]);

  return (
    <TouchableOpacity key={amenity.id} style={style.container} onPress={select}>
      <Image source={{ uri: amenity.icon }} style={style.icon} />
      <Text style={style.title}>{amenity.title}</Text>
      <Badge>{featureCount}</Badge>
      <Image
        source={require('../assets/chevron-right.png')}
        style={style.chevron}
      />
    </TouchableOpacity>
  );
}
