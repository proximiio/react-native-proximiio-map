import {
  type Feature,
  ProximiioMap,
  type Route,
} from 'react-native-proximiio-map';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Proximiio, { ProximiioEvents } from 'react-native-proximiio';
import {
  checkMultiple,
  type Permission,
  requestMultiple,
} from 'react-native-permissions';

import Destination from './destination';
import Toolbar from './toolbar';
import Position from './position';
import { IconRouteFinish, IconRouteStart, IconUserMarker } from './icons';
import { PermissionList, PlaceCoordinates, ProximiioToken } from './constants';

const log = (msg: string) => {
  console.log(`${new Date().toISOString()} [Proximi.io] ${msg}`);
};

// const filter = `function (feature) {
//   return (
//     feature.id ===
//     'cd342cb5-d1ea-42df-a082-312de4af9ba1:c4043623-fa10-481f-8e78-8b726eb1bd05'
//   );
// }`;
//
// mapView.current?.setFilter(filter);

const style = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

const Icons = {
  route_start: IconRouteStart,
  route_finish: IconRouteFinish,
  user_marker: IconUserMarker,
};

export default function App() {
  let mapView = useRef<ProximiioMap | null>(null);
  const [floor, setFloor] = useState(Proximiio.floor);
  const [position, setPosition] = useState(Proximiio.location);
  const [followUser, setFollowUser] = useState(true);
  const [showPosition, setShowPosition] = useState(true);
  const [selected, setSelected] = useState<Feature | undefined>(undefined);
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [routePreview, setRoutePreview] = useState<Route | undefined>(
    undefined
  );
  const [distance, setDistance] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (selected) {
      log(`POI: ${selected?.id} / ${selected?.properties.title}`);

      if (position && selected) {
        const findRoute = async () => {
          const level = floor?.level ?? 0;
          const _route = await mapView.current?.routeFind({
            startLatLonLevel: [position.lat, position.lng, level],
            destinationFeatureId: selected.id,
          });
          setRoutePreview(_route);
          setDistance(_route?.distanceMeters ?? 0);
        };

        // eslint-disable-next-line no-void
        void findRoute();
      }
    }
  }, [floor?.level, position, selected]);

  useEffect(() => {
    log(`Position Update: ${JSON.stringify(position)}`);
    if (position) {
      const level = floor?.level ?? 0;
      mapView.current?.setPosition(position.lat, position.lng, level);

      if (followUser) {
        mapView.current?.panTo(position.lat, position.lng, 150);
      }
    }
  }, [floor, followUser, position]);

  useEffect(() => {
    const initProximiio = async () => {
      log('SDK Initialization');
      const statuses = await checkMultiple(PermissionList);
      const deniedPermissions = [] as Permission[];
      PermissionList.forEach((permission) => {
        if (statuses[permission] === 'denied') {
          deniedPermissions.push(permission);
        }
      });
      await requestMultiple(deniedPermissions);

      await Proximiio.authorize(ProximiioToken);
      Proximiio.setPdr(true, 4);
      Proximiio.setSnapToRoute(true, 20);
    };

    const positionUpdate = Proximiio.subscribe(
      ProximiioEvents.PositionUpdated,
      setPosition
    );

    const floorChange = Proximiio.subscribe(
      ProximiioEvents.FloorChanged,
      setFloor
    );

    initProximiio().then(() => log('SDK Initialized'));

    return () => {
      floorChange?.remove();
      positionUpdate?.remove();
    };
  }, []);

  const onNavigate = useCallback(async () => {
    if (selected && position) {
      const level = floor?.level ?? 0;
      const _route = await mapView.current?.routeStart({
        startLatLonLevel: [position.lat, position.lng, level],
        destinationFeatureId: selected.id,
      });
      setRoute(_route);
      setDistance(_route?.distanceMeters ?? 0);
    }
  }, [floor?.level, position, selected]);

  const onCancelRoute = useCallback(() => {
    mapView.current?.routeCancel();
    setRoutePreview(route);
    setRoute(undefined);
  }, [route]);

  const onDestinationCancel = useCallback(() => {
    setSelected(undefined);
    setRoutePreview(undefined);
    setDistance(undefined);
  }, []);

  const onDestinationCenter = useCallback(() => {
    if (selected) {
      mapView.current?.setLevel(selected.properties.level as number);
      mapView.current?.panTo(
        selected.geometry.coordinates[1],
        selected.geometry.coordinates[0],
        300
      );
    }
  }, [selected]);

  const triggerFollow = useCallback(() => {
    if (followUser) {
      setFollowUser(false);
    } else {
      setFollowUser(true);
      setSelected(undefined);
    }
  }, [followUser]);

  const triggerPosition = useCallback(() => {
    setShowPosition(!showPosition);
  }, [showPosition]);

  const centerUser = useCallback(() => {
    if (position) {
      mapView.current?.panTo(position.lat, position.lng, 300);
    }
  }, [position]);

  const centerPlace = useCallback(() => {
    setFollowUser(false);
    mapView.current?.panTo(PlaceCoordinates.lat, PlaceCoordinates.lng, 300);
  }, []);

  const onPoiClick = useCallback((feature: Feature) => {
    setSelected(feature);
    mapView.current?.flyTo({
      animate: true,
      zoom: 18,
      center: feature.geometry.coordinates,
    });
  }, []);

  const onReady = useCallback(async () => {
    log(`MapView Initialized`);
    const pois = await mapView.current!.getFeatures(true);
    const amenities = await mapView.current!.getAmenities();
    log(`Amenities: ${amenities.length}`);
    log(`Pois: ${pois.length}`);
  }, []);

  const onTouchMove = useCallback(() => setFollowUser(false), []);

  return (
    <View style={style.flex}>
      <ProximiioMap
        ref={(ref) => (mapView.current = ref)}
        style={style.flex}
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

      {showPosition && <Position position={position} />}

      <Toolbar
        centerPlace={centerPlace}
        centerUser={centerUser}
        followUser={followUser}
        position={position}
        onFollowTrigger={triggerFollow}
        showPosition={showPosition}
        onPositionTrigger={triggerPosition}
      />

      {selected && (
        <Destination
          route={route}
          routePreview={routePreview}
          feature={selected}
          distance={distance}
          onCenter={onDestinationCenter}
          onCancel={onDestinationCancel}
          onCancelRoute={onCancelRoute}
          onNavigate={onNavigate}
        />
      )}
    </View>
  );
}
