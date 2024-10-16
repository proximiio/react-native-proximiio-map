import CircleButton from './circle-button';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  showSearch: boolean;
  onTrigger: () => void;
}

const style = StyleSheet.create({
  container: {
    zIndex: 101,
    position: 'absolute',
    display: 'flex',
  },
  menuIcon: { width: 28, height: 28 },
  arrowIcon: { width: 28, height: 28, top: 6 },
});

export default function SearchButton({ showSearch, onTrigger }: Props) {
  const containerStyle = {
    ...style.container,
    top: showSearch ? 12 : 84,
    left: showSearch ? 0 : 12,
  };

  return (
    <View style={containerStyle}>
      <CircleButton
        backgroundColor={showSearch ? 'transparent' : 'white'}
        color="white"
        size={48}
        onPress={onTrigger}
      >
        {!showSearch && (
          <Image
            source={require('../assets/menu-black.png')}
            style={style.menuIcon}
          />
        )}
        {showSearch && (
          <Image
            source={require('../assets/arrow-left.png')}
            style={style.arrowIcon}
          />
        )}
      </CircleButton>
    </View>
  );
}
