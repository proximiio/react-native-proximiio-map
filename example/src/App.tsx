import {
  type Amenity,
  type Feature,
  log,
  ProximiioMap,
  type Route,
} from 'react-native-proximiio-map';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Proximiio, {
  ProximiioEvents,
  type ProximiioFloor,
} from 'react-native-proximiio';
import {
  checkMultiple,
  type Permission,
  requestMultiple,
} from 'react-native-permissions';

import Destination from './components/destination';
import Toolbar from './components/toolbar';
import Position from './components/position';
import { PermissionList, PlaceCoordinates, ProximiioToken } from './constants';
import Search from './components/search';
import SearchButton from './components/search-button';
import { Icons } from './icons';

const style = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    position: 'absolute',
    zIndex: 0,
    flex: 1,
    height: '100%',
    width: '100%',
  },
  map: { flex: 2 },
});

export default function App() {
  let mapView = useRef<ProximiioMap | null>(null);
  const [floor, setFloor] = useState(Proximiio.floor);
  const [floors, setFloors] = useState<ProximiioFloor[]>([]);
  const [position, setPosition] = useState(Proximiio.location);
  const [followUser, setFollowUser] = useState(true);
  const [showPosition, setShowPosition] = useState(true);
  const [selected, setSelected] = useState<Feature | undefined>(undefined);
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [routePreview, setRoutePreview] = useState<Route | undefined>(
    undefined
  );
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [userLevel, setUserLevel] = useState(0);
  const [mapLevel, setMapLevel] = useState(0);
  const [levels, setLevels] = useState<number[]>([0]);
  const [showSearch, setShowSearch] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [amenity, setAmenity] = useState<Amenity | undefined>(undefined);

  useEffect(() => {
    log(`Switching Map Level: ${mapLevel}`);
    mapView?.current?.setLevel(mapLevel);
  }, [mapLevel]);

  useEffect(() => {
    log(`Switching Floor: ${JSON.stringify(floor, null, 2)}`);
    log(
      `Setting UserLevel Level based on positioned Floor: ${userLevel} -> ${floor?.level ?? userLevel}`
    );
    setUserLevel(floor?.level ?? userLevel);
    if (followUser) {
      log(`Switching Map level to follow user: ${mapLevel} => ${floor?.level}`);
      setMapLevel(floor?.level ?? 0);
    }
  }, [floor, followUser, mapLevel, userLevel]);

  useEffect(() => {
    const _levels = floors.map((f) => f.level).sort((a, b) => a - b);
    setLevels(_levels);
  }, [floors]);

  useEffect(() => {
    if (selected) {
      log(`POI: ${selected?.id} / ${selected?.properties.title}`);

      if (position && selected && !route) {
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
  }, [floor?.level, position, route, selected]);

  useEffect(() => {
    log(`Position Update: ${JSON.stringify(position)}`);
    if (position) {
      mapView.current?.setPosition(position.lat, position.lng, userLevel);

      if (followUser) {
        mapView.current?.panTo(position.lat, position.lng, 150);
        if (userLevel !== mapLevel) {
          mapView.current?.setLevel(userLevel);
        }
      }
    }
  }, [floor, followUser, userLevel, position, mapLevel]);

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
      log('statuses', statuses);
      log('denied', deniedPermissions);
      Proximiio.requestPermissions(true);
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

    initProximiio().then(async () => {
      const _floors = await Proximiio.floors();
      setFloors(_floors);
    });

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
    mapView.current?.cancelFilter();
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
      if (userLevel !== mapLevel) {
        setMapLevel(userLevel);
      }
    }
  }, [position, userLevel, mapLevel]);

  const centerPlace = useCallback(() => {
    setFollowUser(false);
    mapView.current?.panTo(PlaceCoordinates.lat, PlaceCoordinates.lng, 300);
  }, []);

  const onPoiClick = useCallback((feature: Feature) => {
    setShowSearch(false);
    setSelected(feature);

    const filter = `function (feature) {
      return feature.id === '${feature.id}';
    }`;

    mapView.current?.setFilter(filter);
    mapView.current?.flyTo({
      animate: true,
      zoom: 17,
      center: feature.geometry.coordinates,
    });
  }, []);

  const onLevelUp = useCallback(() => {
    const nextLevel = levels.find((l) => l > mapLevel);
    if (typeof nextLevel !== 'undefined') {
      setMapLevel(nextLevel);
    }
  }, [mapLevel, levels]);

  const onLevelDown = useCallback(() => {
    const reversed = [...levels].reverse();
    const nextLevel = reversed.find((l) => l < mapLevel);
    if (typeof nextLevel !== 'undefined') {
      setMapLevel(nextLevel);
    }
  }, [mapLevel, levels]);

  const onReady = useCallback(async () => {
    log(`MapView Initialized`);
    // the true attribute specifies only Points filter
    const _features = await mapView.current!.getFeatures(true);
    const _amenities = await mapView.current!.getAmenities();
    _amenities.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    _features.sort((a, b) =>
      (a.properties.title as string)
        .toLowerCase()
        .localeCompare((b.properties.title as string).toLowerCase())
    );
    setAmenities(_amenities);
    setFeatures(_features);
  }, []);

  const onSearchTrigger = useCallback(() => {
    if (showSearch) {
      if (amenity) {
        setAmenity(undefined);
        return;
      } else {
        setShowSearch(false);
      }
    } else {
      setShowSearch(true);
    }
  }, [amenity, showSearch]);

  const onTouchMove = useCallback(() => setFollowUser(false), []);

  return (
    <View style={style.flex}>
      <View style={style.container}>
        <ProximiioMap
          ref={(ref) => (mapView.current = ref)}
          style={style.map}
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
      </View>

      {showPosition && <Position position={position} />}

      <Toolbar
        level={mapLevel}
        levels={levels}
        centerPlace={centerPlace}
        centerUser={centerUser}
        followUser={followUser}
        position={position}
        onFollowTrigger={triggerFollow}
        showPosition={showPosition}
        onPositionTrigger={triggerPosition}
        onLevelUp={onLevelUp}
        onLevelDown={onLevelDown}
      />

      <SearchButton showSearch={showSearch} onTrigger={onSearchTrigger} />

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

      {showSearch && (
        <Search
          amenity={amenity}
          amenities={amenities}
          features={features}
          onAmenitySelect={setAmenity}
          onFeatureSelect={onPoiClick}
        />
      )}
    </View>
  );
}
