import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import type { Amenity, Feature } from 'react-native-proximiio-map';
import { useCallback, useMemo } from 'react';
import AmenityItem from './amenity-item';
import FeatureItem from './feature-item';

interface Props {
  amenity?: Amenity;
  amenities: Amenity[];
  features: Feature[];
  onAmenitySelect: (amenity: Amenity) => void;
  onFeatureSelect: (feature: Feature) => void;
}

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    flex: 1,
    top: 78,
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').height - 68,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  query: {
    padding: 12,
  },
  header: {},
});

export default function Search({
  amenity,
  amenities,
  features,
  onAmenitySelect,
  onFeatureSelect,
}: Props) {
  const selectAmenity = useCallback(
    (selected: Amenity) => {
      onAmenitySelect(selected);
    },
    [onAmenitySelect]
  );

  const renderAmenities = useMemo(() => {
    return amenities.map((_amenity) => {
      const featureCount = features.filter(
        (f) => (f.properties.amenity as string) === _amenity?.id
      ).length;
      return (
        <AmenityItem
          key={_amenity.id}
          amenity={_amenity}
          featureCount={featureCount}
          onSelect={selectAmenity}
        />
      );
    });
  }, [amenities, features, selectAmenity]);

  const renderFeatures = useCallback(() => {
    if (!amenity) return;

    const sorted = features
      .filter((f) => f.properties.amenity === amenity?.id)
      .sort((a, b) =>
        (a.properties.title as string)
          .toLowerCase()
          .localeCompare((b.properties.title as string).toLowerCase())
      );
    return sorted.map((_feature) => (
      <FeatureItem
        key={_feature.id}
        feature={_feature}
        amenity={amenity}
        onSelect={(f) => onFeatureSelect(f)}
      />
    ));
  }, [amenity, features, onFeatureSelect]);

  return (
    <View style={style.container}>
      <ScrollView>
        {typeof amenity === 'undefined' && renderAmenities}
        {typeof amenity !== 'undefined' && renderFeatures()}
      </ScrollView>
    </View>
  );
}
