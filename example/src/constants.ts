import { Platform } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';

export const ProximiioToken = 'APPLICATION-TOKEN';

export const PlaceCoordinates = {
  lat: 12.3456,
  lng: 12.3456,
};

export const PermissionList =
  Platform.OS === 'ios'
    ? [
        PERMISSIONS.IOS.BLUETOOTH,
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ]
    : [
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      ];
