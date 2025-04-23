import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { type StyleProp, type ViewStyle } from 'react-native';
import { Component } from 'react';

import { nanoid } from 'nanoid/non-secure';

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

export const log = (...args: any[]) => {
  if (__DEV__) {
    console.log(`${new Date().toISOString()} [Proximi.io] ${args}`);
  }
};

export const debug = (..._args: any[]) => {
  if (__DEV__) {
    // console.log(`${new Date().toISOString()} [Proximi.io] ${args}`);
  }
};

interface Props {
  style?: StyleProp<ViewStyle>;
  token: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  level: number;
  pitch: number;
  bearing: number;
  bounds?: [[number, number], [number, number]];
  onClick?: (feature: Feature) => void;
  onReady?: () => void;
  onRouteNotFound?: () => void;
  onRouteStepUpdate?: (step: RouteStep) => void;
  onRouteCanceled?: () => void;
  onTouchStart?: () => void;
  onTouchMove?: () => void;
  onTouchEnd?: () => void;
  icons?: {
    route_start?: string;
    route_finish?: string;
    user_marker?: string;
  };
}

const uri =
  'https://proximiio-map-mobile.ams3.cdn.digitaloceanspaces.com/1.0.0-b22/index.html';

export interface Feature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: { [id: string]: unknown };
}

export interface Amenity {
  id?: string;
  title: string;
  icon: string;
  category: string;
  description: string;
}

export interface RouteStep {
  bearingFromLastStep: number;
  direction: string;
  distanceFromLastStep: number;
  level: number;
  instruction: string;
  coordinates: {
    coordinates: [number, number];
  };
}

export interface Route {
  lastNodeWithPathIndex: number;
  destination: Feature;
  start: Feature;
  distanceMeters: number;
  steps: RouteStep[];
  lines: Feature[];
}

enum Message {
  ON_CLICK = 'event:click',
  READY = 'ready',
  ROUTE_NOT_FOUND = 'route:not_found',
  ROUTE_CANCELED = 'route:canceled',
  ROUTE_STEP_UPDATE = 'route:step:update',
  TOUCH_START = 'touch:start',
  TOUCH_MOVE = 'touch:move',
  TOUCH_END = 'touch:end',
  CALLBACK = 'callback',
}

enum Action {
  getAmenities = 'getAmenities',
  getFeatures = 'getFeatures',
  routeFind = 'routeFind',
  routeStart = 'routeStart',
  addImage = 'addImage',
  hasImage = 'hasImage',
  removeImage = 'removeImage',
  addSource = 'addSource',
  getSource = 'getSource',
  hasSource = 'hasSource',
  removeSource = 'removeSource',
  addLayer = 'addLayer',
  getLayer = 'getLayer',
  hasLayer = 'hasLayer',
  moveLayer = 'moveLayer',
  removeLayer = 'removeLayer',
}

export type PromoteIdSpecification =
  | {
      [_: string]: string;
    }
  | string;

export type VectorSourceSpecification = {
  type: 'vector';
  url?: string;
  tiles?: Array<string>;
  bounds?: [number, number, number, number];
  scheme?: 'xyz' | 'tms';
  minzoom?: number;
  maxzoom?: number;
  attribution?: string;
  promoteId?: PromoteIdSpecification;
  volatile?: boolean;
};

export type RasterSourceSpecification = {
  type: 'raster';
  url?: string;
  tiles?: Array<string>;
  bounds?: [number, number, number, number];
  minzoom?: number;
  maxzoom?: number;
  tileSize?: number;
  scheme?: 'xyz' | 'tms';
  attribution?: string;
  volatile?: boolean;
};

export type RasterDEMSourceSpecification = {
  type: 'raster-dem';
  url?: string;
  tiles?: Array<string>;
  bounds?: [number, number, number, number];
  minzoom?: number;
  maxzoom?: number;
  tileSize?: number;
  attribution?: string;
  encoding?: 'terrarium' | 'mapbox' | 'custom';
  redFactor?: number;
  blueFactor?: number;
  greenFactor?: number;
  baseShift?: number;
  volatile?: boolean;
};

export type GeoJSONSourceSpecification = {
  type: 'geojson';
  data: GeoJSON.GeoJSON | string;
  maxzoom?: number;
  attribution?: string;
  buffer?: number;
  filter?: unknown;
  tolerance?: number;
  cluster?: boolean;
  clusterRadius?: number;
  clusterMaxZoom?: number;
  clusterMinPoints?: number;
  clusterProperties?: unknown;
  lineMetrics?: boolean;
  generateId?: boolean;
  promoteId?: PromoteIdSpecification;
};

export type VideoSourceSpecification = {
  type: 'video';
  urls: Array<string>;
  coordinates: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ];
};

export type ImageSourceSpecification = {
  type: 'image';
  url: string;
  coordinates: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ];
};

export type SourceSpecification =
  | VectorSourceSpecification
  | RasterSourceSpecification
  | RasterDEMSourceSpecification
  | GeoJSONSourceSpecification
  | VideoSourceSpecification
  | ImageSourceSpecification;

export type SourceInfo = {
  id?: string;
  type?: 'geojson' | 'vector' | 'raster' | 'raster-dem' | 'video' | 'image';
  minzoom?: number;
  maxzoom?: number;
  loaded: boolean;
};

export function metersToSteps(meters: number) {
  return Math.round(meters * 1.31234);
}

export class ProximiioMap extends Component<Props> {
  webview: WebView | null = null;
  callbacks: { [id: string]: (params: never) => void } = {};
  ready = false;

  async addImage(id: string, _uri: string): Promise<boolean> {
    const params = `'${id}', '${_uri}'`;
    const result = await this.asyncTask(Action.addImage, params);
    return result as boolean;
  }

  async hasImage(id: string): Promise<boolean> {
    const result = await this.asyncTask(Action.hasImage, `'${id}'`);
    return result as boolean;
  }

  async removeImage(id: string): Promise<boolean> {
    const result = await this.asyncTask(Action.removeImage, `'${id}'`);
    return result as boolean;
  }

  async addSource(id: string, source: SourceSpecification): Promise<boolean> {
    const params = `'${id}', '${JSON.stringify(source)}'`;
    const result = await this.asyncTask(Action.addSource, params);
    return result as boolean;
  }

  async getSource(id: string): Promise<SourceInfo | undefined> {
    const result = await this.asyncTask(Action.getSource, `'${id}'`);
    return result as SourceInfo | undefined;
  }

  async hasSource(id: string): Promise<boolean> {
    const result = await this.asyncTask(Action.hasSource, `'${id}'`);
    return result as boolean;
  }

  async removeSource(id: string): Promise<boolean> {
    const result = await this.asyncTask(Action.removeSource, `'${id}'`);
    return result as boolean;
  }

  async addLayer(layer: never): Promise<boolean> {
    const params = `'${JSON.stringify(layer)}'`;
    const result = await this.asyncTask(Action.addLayer, params);
    return result as boolean;
  }

  async getLayer(id: string): Promise<SourceInfo | undefined> {
    const result = await this.asyncTask(Action.getLayer, `'${id}'`);
    return result as SourceInfo | undefined;
  }

  async hasLayer(id: string): Promise<boolean> {
    const result = await this.asyncTask(Action.hasLayer, `'${id}'`);
    return result as boolean;
  }

  async moveLayer(id: string, beforeId: string): Promise<boolean> {
    const result = await this.asyncTask(
      Action.moveLayer,
      `'${id}', '${beforeId}'`
    );
    return result as boolean;
  }

  async removeLayer(id: string): Promise<boolean> {
    const result = await this.asyncTask(Action.removeLayer, `'${id}'`);
    return result as boolean;
  }

  setCenter(lat: number, lng: number) {
    this.dispatch(`mapController.setCenter(${lat}, ${lng});`);
  }

  setPosition(lat: number, lng: number, level: number) {
    this.dispatch(`mapController.setPosition(${lat}, ${lng}, ${level});`);
  }

  setZoom(zoom: number) {
    this.dispatch(`mapController.setZoom(${zoom});`);
  }

  flyTo(options: FlyToOptions) {
    this.dispatch(`mapController.flyTo('${JSON.stringify(options)}');`);
  }

  panTo(lat: number, lng: number, duration: number) {
    this.dispatch(`mapController.panTo(${lat}, ${lng}, ${duration});`);
  }

  setLevel(level: number) {
    this.dispatch(`mapController.setLevel(${level});`);
  }

  setFilter(fn: string) {
    this.dispatch(`mapController.setFeatureFilter(${fn});`);
  }

  cancelFilter() {
    this.dispatch(`mapController.cancelFeatureFilter();`);
  }

  async routeFind(options: ProximiioRouteConfiguration): Promise<Route> {
    const params = JSON.stringify(options);
    const route = await this.asyncTask(Action.routeFind, `'${params}'`);
    return route as Route;
  }

  async routeStart(options: ProximiioRouteConfiguration): Promise<Route> {
    const params = JSON.stringify(options);
    const route = await this.asyncTask(Action.routeStart, `'${params}'`);
    return route as Route;
  }

  routeCancel() {
    this.dispatch(`mapController.routeCancel();`);
  }

  async getAmenities(): Promise<Amenity[]> {
    const amenities = await this.asyncTask(Action.getAmenities, '');
    return amenities as Amenity[];
  }

  async getFeatures(pointsOnly: boolean = false): Promise<Feature[]> {
    const features = await this.asyncTask(Action.getFeatures, `${pointsOnly}`);
    return features as Feature[];
  }

  private dispatch(fn: string) {
    if (!this.ready) {
      console.log('**** Dispatch Blocked, WebView not ready yet ***');
      return;
    }
    debug(`[Dispatch]: ${fn}`);
    this.webview?.injectJavaScript(fn);
  }

  private asyncTask(fn: string, params: string): Promise<unknown> {
    return new Promise((resolve) => {
      const requestId = nanoid();
      this.callbacks[requestId] = (items: never) => {
        resolve(items);
      };

      const cmd = `mapController.${fn}(${params})`;
      const evt = `JSON.stringify({"event":"callback","data":{"items":items,"requestId":"${requestId}"}})`;
      const js = `(async()=>{const items=await ${cmd};window.ReactNativeWebView.postMessage(${evt});})();true`;

      this.dispatch(js);
    });
  }

  private onCallback = (event: { event: string; data: unknown }) => {
    const { items, requestId } = event.data as {
      items: never[];
      requestId: string;
    };

    const callback = this.callbacks[requestId];
    if (callback) {
      callback(items as never);
      delete this.callbacks[requestId];
    }
  };

  private onMessage = (evt: WebViewMessageEvent) => {
    let event: { event: string; data: unknown } | undefined;
    try {
      event = JSON.parse(evt.nativeEvent.data) as {
        event: Message;
        data: unknown;
      };
    } catch (e) {
      console.error('ProximiioMap => onMessage parsing error', e);
    }

    if (!event) return;

    switch (event.event) {
      case Message.ON_CLICK:
        if (this.props.onClick)
          this.props.onClick(JSON.parse(event.data as string) as Feature);
        break;
      case Message.READY:
        this.ready = true;
        if (this.props.onReady) this.props.onReady();
        break;
      case Message.ROUTE_STEP_UPDATE:
        if (this.props.onRouteStepUpdate)
          this.props.onRouteStepUpdate(event.data as RouteStep);
        break;
      case Message.ROUTE_NOT_FOUND:
        if (this.props.onRouteNotFound) this.props.onRouteNotFound();
        break;
      case Message.ROUTE_CANCELED:
        if (this.props.onRouteCanceled) this.props.onRouteCanceled();
        break;
      case Message.TOUCH_START:
        if (this.props.onTouchStart) this.props.onTouchStart();
        break;
      case Message.TOUCH_MOVE:
        if (this.props.onTouchMove) this.props.onTouchMove();
        break;
      case Message.TOUCH_END:
        if (this.props.onTouchEnd) this.props.onTouchEnd();
        break;
      case Message.CALLBACK:
        this.onCallback(event);
        break;
    }
  };

  render() {
    const settings = {
      token: this.props.token,
      mapDefaults: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
        zoom: this.props.zoom,
        pitch: this.props.pitch,
        bearing: this.props.bearing,
        bounds: this.props.bounds,
      },
    };

    const json = JSON.stringify(settings);

    return (
      <WebView
        ref={(ref) => (this.webview = ref)}
        source={{ uri }}
        style={this.props.style}
        webviewDebuggingEnabled={true}
        useWebView2={true}
        injectedJavaScriptBeforeContentLoaded={`
          const settings = ${json};
          window.token = settings.token;
          window.mapDefaults = settings.mapDefaults;
          window.icons = settings.icons;
          true
        `}
        injectedJavaScriptObject={settings}
        onError={(evt) => {
          console.error('on mapview error', evt);
        }}
        onMessage={this.onMessage}
      />
    );
  }
}
