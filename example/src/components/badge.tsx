import { StyleSheet, Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#eaeaea',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    color: 'black',
  },
});

export default function Badge({ children }: Props) {
  return (
    <View style={style.container}>
      <Text style={style.content}>{children}</Text>
    </View>
  );
}
