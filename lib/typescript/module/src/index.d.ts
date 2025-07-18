import { WebView } from 'react-native-webview';
import { type StyleProp, type ViewStyle } from 'react-native';
import { Component } from 'react';
import type { GeoJSON } from 'geojson';
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
export type PointLike = {
    x: number;
    y: number;
} | [number, number];
export type LngLat = {
    lng: number;
    lat: number;
};
export type LngLatLike = LngLat | {
    lng: number;
    lat: number;
} | {
    lon: number;
    lat: number;
} | [number, number];
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
export declare const log: (...args: any[]) => void;
export declare const debug: (..._args: any[]) => void;
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
export interface Feature {
    id: string;
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        [id: string]: unknown;
    };
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
export type PromoteIdSpecification = {
    [_: string]: string;
} | string;
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
        [
            number,
            number
        ],
        [
            number,
            number
        ],
        [
            number,
            number
        ],
        [
            number,
            number
        ]
    ];
};
export type ImageSourceSpecification = {
    type: 'image';
    url: string;
    coordinates: [
        [
            number,
            number
        ],
        [
            number,
            number
        ],
        [
            number,
            number
        ],
        [
            number,
            number
        ]
    ];
};
export type SourceSpecification = VectorSourceSpecification | RasterSourceSpecification | RasterDEMSourceSpecification | GeoJSONSourceSpecification | VideoSourceSpecification | ImageSourceSpecification;
export type SourceInfo = {
    id?: string;
    type?: 'geojson' | 'vector' | 'raster' | 'raster-dem' | 'video' | 'image';
    minzoom?: number;
    maxzoom?: number;
    loaded: boolean;
};
export declare function metersToSteps(meters: number): number;
export declare class ProximiioMap extends Component<Props> {
    webview: WebView | null;
    callbacks: {
        [id: string]: (params: never) => void;
    };
    ready: boolean;
    addImage(id: string, _uri: string): Promise<boolean>;
    hasImage(id: string): Promise<boolean>;
    removeImage(id: string): Promise<boolean>;
    addFeature(feature: GeoJSON): Promise<boolean>;
    updateFeature(feature: GeoJSON): Promise<boolean>;
    deleteFeature(feature: GeoJSON): Promise<boolean>;
    addSource(id: string, source: SourceSpecification): Promise<boolean>;
    getSource(id: string): Promise<SourceInfo | undefined>;
    hasSource(id: string): Promise<boolean>;
    removeSource(id: string): Promise<boolean>;
    addLayer(layer: never): Promise<boolean>;
    getLayer(id: string): Promise<SourceInfo | undefined>;
    hasLayer(id: string): Promise<boolean>;
    moveLayer(id: string, beforeId: string): Promise<boolean>;
    removeLayer(id: string): Promise<boolean>;
    setCenter(lat: number, lng: number): void;
    setPosition(lat: number, lng: number, level: number): void;
    setZoom(zoom: number): void;
    flyTo(options: FlyToOptions): void;
    panTo(lat: number, lng: number, duration: number): void;
    setLevel(level: number): void;
    setFilter(fn: string): void;
    cancelFilter(): void;
    routeFind(options: ProximiioRouteConfiguration): Promise<Route>;
    routeStart(options: ProximiioRouteConfiguration): Promise<Route>;
    routeCancel(): void;
    getAmenities(): Promise<Amenity[]>;
    getFeatures(pointsOnly?: boolean): Promise<Feature[]>;
    private dispatch;
    private asyncTask;
    private onCallback;
    private onMessage;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map