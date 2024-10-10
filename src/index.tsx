import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { type StyleProp, type ViewStyle } from 'react-native';
import { Component } from 'react';
import type {
  FlyToOptions,
  ProximiioRouteConfiguration,
} from '../example/src/types';
import { nanoid } from 'nanoid/non-secure';

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
  'https://proximiio-map-mobile.ams3.cdn.digitaloceanspaces.com/1.0.0-b3/index.html ';

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
}

export function metersToSteps(meters: number) {
  return Math.round(meters * 1.31234);
}

export class ProximiioMap extends Component<Props> {
  webview: WebView | null = null;
  callbacks: { [id: string]: (params: never) => void } = {};

  constructor(props: Props) {
    super(props);
  }

  setCenter(lat: number, lng: number) {
    this.webview?.injectJavaScript(`mapController.setCenter(${lat}, ${lng});`);
  }

  setPosition(lat: number, lng: number, level: number) {
    this.webview?.injectJavaScript(
      `mapController.setPosition(${lat}, ${lng}, ${level});`
    );
  }

  setZoom(zoom: number) {
    this.webview?.injectJavaScript(`mapController.setZoom(${zoom});`);
  }

  flyTo(options: FlyToOptions) {
    this.webview?.injectJavaScript(
      `mapController.flyTo('${JSON.stringify(options)}');`
    );
  }

  panTo(lat: number, lng: number, duration: number) {
    this.webview?.injectJavaScript(
      `mapController.panTo(${lat}, ${lng}, ${duration});`
    );
  }

  setLevel(level: number) {
    this.webview?.injectJavaScript(`mapController.setLevel(${level});`);
  }

  setFilter(fn: string) {
    this.webview?.injectJavaScript(`mapController.setFeatureFilter(${fn});`);
  }

  cancelFilter() {
    this.webview?.injectJavaScript(`mapController.cancelFeatureFilter();`);
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
    this.webview?.injectJavaScript(`mapController.routeCancel();`);
  }

  async getAmenities(): Promise<Amenity[]> {
    const amenities = await this.asyncTask(Action.getAmenities, '');
    return amenities as Amenity[];
  }

  async getFeatures(pointsOnly: boolean = false): Promise<Feature[]> {
    const features = await this.asyncTask(Action.getFeatures, `${pointsOnly}`);

    return features as Feature[];
  }

  private asyncTask(fn: string, params: string): Promise<unknown> {
    return new Promise((resolve) => {
      const requestId = nanoid();
      this.callbacks[requestId] = (items: never) => {
        resolve(items);
      };

      const js = `(function() {
        mapController.${fn}(${params}).then((items) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            event: 'callback',
            data: { items, requestId: '${requestId}' }
          }))
        });
      })();`;

      this.webview?.injectJavaScript(js);
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

    return (
      <WebView
        ref={(ref) => (this.webview = ref)}
        source={{ uri }}
        style={this.props.style}
        injectedJavaScriptObject={settings}
        onError={(evt) => {
          console.log('on mapview error', evt);
        }}
        onMessage={this.onMessage}
      />
    );
  }
}
