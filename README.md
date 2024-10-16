# react-native-proximiio-map

Proximi.io Map for React Native

## Changelog

### 0.9.2
- added image management methods
- added source management methods
- added layer management methods

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

#### mapView.current?.addImage(id: string, uri: string)
Add an image to the style. This image can be displayed on the map like any other icon in the style's sprite using the image's ID with icon-image, background-pattern, fill-pattern, or line-pattern.

Use base64 encoded image as uri parameter

#### mapView.current?.hasImage(id: string)
Check whether or not an image with a specific ID exists in the style. This checks both images in the style's original sprite and any images that have been added at runtime using Map#addImage.

#### mapView.current?.removeImage(id: string)
Remove an image from a style. This can be an image from the style's original sprite or any images that have been added at runtime using Map#addImage.

#### mapView.current?.addSource(id: string, source: SourceSpecification)
Adds a source to the map's style.

#### mapView.current?.getSource(id: string)
Returns the source with the specified ID in the map's style.

#### mapView.current?.hasSource(id: string)
Check whether or not source exists in style.

#### mapView.current?.removeSource(id: string)
Removes a source from the map's style.

#### mapView.current?.addLayer(layer: never)
Adds a MapLibre style layer to the map's style.

A layer defines how data from a specified source will be styled. Read more about layer types and available paint and layout properties in the MapLibre Style Specification.

#### mapView.current?.getLayer(id: string)
Returns the layer with the specified ID in the map's style.

#### mapView.current?.hasLayer(id: string)
Checks whether or not layer exists in style.

#### mapView.current?.moveLayer(id: string, beforeId: string)
Moves a layer to a different z-position.

beforeId is ID of an existing layer to insert the new layer before. When viewing the map, the id layer will appear beneath the beforeId layer.

#### mapView.current?.removeLayer(id: string)
Removes the layer with the given ID from the map's style.

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
