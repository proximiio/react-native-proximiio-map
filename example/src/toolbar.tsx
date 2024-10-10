import type { ProximiioLocation } from 'react-native-proximiio';
import Button from './button';
import { White90 } from './common';

interface Props {
  centerPlace: () => void;
  centerUser: () => void;
  followUser: boolean;
  showPosition: boolean;
  position?: ProximiioLocation;
  onFollowTrigger: () => void;
  onPositionTrigger: () => void;
}

export default function Toolbar({
  centerPlace,
  centerUser,
  followUser,
  showPosition,
  position,
  onFollowTrigger,
  onPositionTrigger,
}: Props) {
  return (
    <>
      <Button
        title="SHOW POSITION"
        backgroundColor={
          showPosition ? 'rgba(205, 0, 0, 0.9)' : 'rgba(0, 165, 0, 0.9)'
        }
        color="white"
        top={162}
        onPress={onPositionTrigger}
        disabled={typeof position === 'undefined'}
      />

      <Button
        title={followUser ? 'DISABLE FOLLOW' : 'ENABLE FOLLOW'}
        backgroundColor={
          followUser ? 'rgba(205, 0, 0, 0.9)' : 'rgba(0, 165, 0, 0.9)'
        }
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
