import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  type Feature,
  metersToSteps,
  type Route,
} from 'react-native-proximiio-map';
import { White90 } from './common';

interface Props {
  route?: Route;
  routePreview?: Route;
  feature: Feature;
  distance?: number;
  onCancel?: () => void;
  onCenter: () => void;
  onNavigate: () => void;
  onCancelRoute: () => void;
}

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    bottom: 0,
    width: '100%',
    backgroundColor: White90,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -12 },
    shadowRadius: 12,
  },
  title: {
    textAlign: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingBottom: 0,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#d3d3d3',
    color: 'black',
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 6,
    marginLeft: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 64,
  },
  centerButton: {
    backgroundColor: '#117758',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontWeight: 'bold',
    borderRadius: 6,
    marginHorizontal: 12,
    justifyContent: 'center',
    height: 64,
  },
  navigateButton: {
    backgroundColor: '#1e40af',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontWeight: 'bold',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    height: 64,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  navigateButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    marginTop: 12,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  spacer: {
    flex: 1,
  },
});

export default function ({
  route,
  routePreview,
  feature,
  distance,
  onCancel,
  onCancelRoute,
  onCenter,
  onNavigate,
}: Props) {
  return (
    <View style={style.container}>
      <Text style={style.title}>
        {(feature.properties.title as string) ?? ''}
      </Text>

      {typeof distance !== 'undefined' && (
        <Text style={style.subtitle}>
          {distance.toFixed(0)} meters {metersToSteps(distance)} steps
        </Text>
      )}

      <View style={style.footer}>
        {!route && (
          <TouchableOpacity style={style.cancelButton} onPress={onCancel}>
            <Text style={style.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}

        {route && (
          <TouchableOpacity style={style.cancelButton} onPress={onCancelRoute}>
            <Text style={style.buttonText}>Cancel Navigation</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={style.centerButton} onPress={onCenter}>
          <Text style={style.navigateButtonText}>Center View</Text>
        </TouchableOpacity>

        {!route && routePreview && (
          <TouchableOpacity style={style.navigateButton} onPress={onNavigate}>
            <Text style={style.navigateButtonText}>Navigate to</Text>
          </TouchableOpacity>
        )}
      </View>
      {/*{!route && 'Navigate to \n'}*/}
      {/*{!routePreview && route && 'Navigating to \n'}*/}
    </View>
  );
}
