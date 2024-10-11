import type { ProximiioLocation } from 'react-native-proximiio';
import Button from './button';
import { White90 } from './common';
import CircleButton from './circle-button';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

interface Props {
  levels: number[];
  centerPlace: () => void;
  centerUser: () => void;
  followUser: boolean;
  level: number;
  showPosition: boolean;
  position?: ProximiioLocation;
  onFollowTrigger: () => void;
  onLevelDown: () => void;
  onLevelUp: () => void;
  onPositionTrigger: () => void;
}

const style = StyleSheet.create({
  levels: {
    position: 'absolute',
    top: 86,
    right: 12,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  icon: { width: 28, height: 28 },
});

export default function Toolbar({
  centerPlace,
  centerUser,
  followUser,
  level,
  levels,
  showPosition,
  position,
  onFollowTrigger,
  onLevelUp,
  onLevelDown,
  onPositionTrigger,
}: Props) {
  const [canLevelUp, setCanLevelUp] = useState(false);
  const [canLevelDown, setCanLevelDown] = useState(false);

  useEffect(() => {
    const higherLevel = typeof levels.find((l) => l > level) !== 'undefined';
    const lowerLevel = typeof levels.find((l) => l < level) !== 'undefined';
    setCanLevelUp(higherLevel);
    setCanLevelDown(lowerLevel);
  }, [level, levels]);

  const showPositionColor = showPosition
    ? 'rgba(205, 0, 0, 0.9)'
    : 'rgba(0, 165, 0, 0.9)';

  const followColor = followUser
    ? 'rgba(205, 0, 0, 0.9)'
    : 'rgba(0, 165, 0, 0.9)';

  return (
    <>
      <View style={style.levels}>
        <CircleButton
          backgroundColor="rgba(205, 0, 0, 0.9)"
          color="white"
          onPress={onLevelDown}
          disabled={!canLevelDown}
          size={48}
        >
          <Image
            source={require('./assets/arrow-down.png')}
            style={style.icon}
          />
        </CircleButton>

        <CircleButton
          backgroundColor="white"
          color="black"
          onPress={onPositionTrigger}
          size={48}
          disabled={true}
          opacity={1}
        >
          <Text>{level}</Text>
        </CircleButton>

        <CircleButton
          backgroundColor="rgba(205, 0, 0, 0.9)"
          color="white"
          onPress={onLevelUp}
          disabled={!canLevelUp}
          size={48}
        >
          <Image source={require('./assets/arrow-up.png')} style={style.icon} />
        </CircleButton>
      </View>

      <Button
        title="SHOW POSITION"
        backgroundColor={showPositionColor}
        color="white"
        top={162}
        onPress={onPositionTrigger}
        disabled={typeof position === 'undefined'}
      />

      <Button
        title={followUser ? 'DISABLE FOLLOW' : 'ENABLE FOLLOW'}
        backgroundColor={followColor}
        color={White90}
        top={240}
        onPress={onFollowTrigger}
        disabled={typeof position === 'undefined'}
      />

      <Button
        title="CENTER USER"
        backgroundColor={White90}
        color="black"
        top={318}
        onPress={centerUser}
        disabled={typeof position === 'undefined'}
      />

      <Button
        title="CENTER PLACE"
        backgroundColor={White90}
        color="black"
        top={396}
        onPress={centerPlace}
        disabled={typeof position === 'undefined'}
      />
    </>
  );
}
