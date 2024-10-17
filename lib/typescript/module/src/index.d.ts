import { WebView } from 'react-native-webview';
import { type StyleProp, type ViewStyle } from 'react-native';
import { Component } from 'react';
import type { FlyToOptions, ProximiioRouteConfiguration } from '../example/src/types';
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
export declare function metersToSteps(meters: number): number;
export declare class ProximiioMap extends Component<Props> {
    webview: WebView | null;
    callbacks: {
        [id: string]: (params: never) => void;
    };
    ready: boolean;
    constructor(props: Props);
    setCenter(lat: number, lng: number): void;
    setPosition(lat: number, lng: number, level: number): void;
    dispatch(fn: string): void;
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
    private asyncTask;
    private onCallback;
    private onMessage;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map