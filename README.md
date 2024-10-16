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

### Component
Insert Map Component

```
export default function App() {
  let mapView = useRef<ProximiioMap | null>(null);

  return (
    <ProximiioMap
      ref={(ref) => (mapView.current = ref)}
      style={{ flex: 1 }}
      token={ProximiioToken}
      center={PlaceCoordinates}
      zoom={16}
      level={0}
      pitch={0}
      bearing={0}
      onClick={onPoiClick}
      onReady={onReady}
      onTouchMove={onTouchMove}
      icons={Icons}
    />
  )
}
```

#### token
Use your Proximi.io Token here, you can find it Proximi.io Portal under Application

#### center
Use { lng: 12.345, lat: 12.345 } format to set the default center of map

#### onClick
Fires when user taps a POI Feature

#### onReady
Fires when map has finished loading

### Methods

#### mapView.current?.setCenter(lat: number, lng: number)
Sets the map's geographical centerpoint.

#### mapView.current?.setPosition(lat: number, lng: number, level: number)
Sets current user position on map

#### mapView.current?.setZoom(level: number)
Sets the map's zoom level

#### mapView.current?.flyTo(options: FlyToOptions)
Changes any combination of center, zoom, bearing, and pitch, animating the transition along a curve that evokes flight. The animation seamlessly incorporates zooming and panning to help the user maintain her bearings even after traversing a great distance.

see https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/FlyToOptions for available options

#### mapView.current?.panTo(lat: number, lng: number, duration: number)
Pans the map to the specified location with an animated transition.

#### mapView.current?.setLevel(level: number)
Sets current map floor level

#### mapView.current?.setFilter(fn: string)
Sets displayed POI Feature filtering, you can define standard js filter for Feature and wrap it in \`\`, eg:
\`function (feature) { return feature.properties.title === 'Checkpoint' }\`

#### mapView.current?.cancelFilter()
Cancels current POI Feature filtering

#### mapView.current?.routeFind(options: ProximiioRouteConfiguration)
Calculates and returns Route data without displaying, you can either use
Feature id as start/destination or coordinates with level

```
type ProximiioRouteConfiguration {
  startFeatureId?: string;
  startLatLonLevel?: number[];
  destinationFeatureId?: string;
  destinationLatLonLevel?: number[];
  destinationTitle?: string | undefined;
  waypointFeatureIdList?: string[][];
  wayfindingOptions?: ProximiioWayfindingOptions;
}

export type ProximiioWayfindingOptions = {
  avoidBarriers: boolean;
  avoidElevators: boolean;
  avoidEscalators: boolean;
  avoidNarrowPaths: boolean;
  avoidRamps: boolean;
  avoidRevolvingDoors: boolean;
  avoidStaircases: boolean;
  avoidTicketGates: boolean;
  pathFixDistance: number;
};
```

#### mapView.current?.routeStart(options: ProximiioRouteConfiguration)
Calculates and returns Route data while displaying Routing elements on map,
you can either use Feature id as start/destination or coordinates with level,
see above for ProximiioRouteConfiguration spec

#### mapView.current?.routeCancel()
Cancels current started Route

#### async mapView.current?.getAmenities()
Returns array of Amenity objects

#### async mapView.current?.getFeatures()
Returns array of GeoJSON Features

## Notes
Please see example/src/App.tsx inside this repository,
meanwhile feel free to contact us on our Slack for more information.

## Example App
To use example app edit `example/src/constants.ts` and set your Proximi.io Application Token and default coordinates for
your place

Proximi.io 2024
