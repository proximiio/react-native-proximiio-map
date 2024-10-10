export type ProximiioRouteConfiguration = {
  startFeatureId?: string;
  startLatLonLevel?: number[];
  destinationFeatureId?: string;
  destinationLatLonLevel?: number[];
  destinationTitle?: string | undefined;
  waypointFeatureIdList?: string[][];
  wayfindingOptions?: ProximiioWayfindingOptions;
};

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

export type PointLike =
  | {
      x: number;
      y: number;
    }
  | [number, number];

export type LngLat = {
  lng: number;
  lat: number;
};

export type LngLatLike =
  | LngLat
  | {
      lng: number;
      lat: number;
    }
  | {
      lon: number;
      lat: number;
    }
  | [number, number];

export type FlyToOptions = {
  center?: LngLatLike;
  zoom?: number;
  bearing?: number;
  pitch?: number;
  around?: LngLatLike;
  duration?: number;
  easing?: (_: number) => number;
  offset?: PointLike;
  animate?: boolean;
  essential?: boolean;
  freezeElevation?: boolean;
  curve?: number;
  minZoom?: number;
  speed?: number;
  screenSpeed?: number;
  maxDuration?: number;
};
