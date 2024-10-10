# react-native-proximiio-map

Proximi.io Map for React Native

## Installation

To install Proximi.io Map to React Native Project, run:
```
yarn add proximiio/react-native-proximiio
yarn add proximiio/react-native-proximiio-map
```

### IOS

Set USE_FRAMEWORKS linkage to static, either by using USE_FRAMEWORKS variable or hardcoding
```use_frameworks! :linkage => :static```
inside ios/Podfile

### Android
Add Proximi.io Maven repository into build.gradle repositories section
```
  maven { url "https://maven.proximi.io/repository/android-releases/" }
```

### Common
Its required from application to handle bluetooth and location permissions,
eg. when using `react-native-permissions`

```
const PermissionList = Platform.OS === 'ios'
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
```
refer to example app implementation in this repository for more details

## Usage
TODO

Please see example/src/App.tsx inside this repository,
meanwhile feel free to contact us on our Slack for more information.

## Example App
To use example app edit `example/src/constants.ts` and set your Proximi.io Application Token and default coordinates for
your place

Proximi.io 2024
