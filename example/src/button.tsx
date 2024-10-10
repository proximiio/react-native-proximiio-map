import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  backgroundColor: string;
  color: string;
  top: number;
  onPress: () => void;
  disabled: boolean;
}

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    right: 0,
    borderTopStartRadius: 18,
    borderBottomStartRadius: 18,
    width: 112,
    padding: 12,
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

export default function Button({
  title,
  backgroundColor,
  color,
  top,
  onPress,
  disabled,
}: Props) {
  const _style = {
    ...style.container,
    top,
    backgroundColor,
    opacity: disabled ? 0.5 : 1,
  };

  const textStyle = { ...style.text, color };

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={_style}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}
