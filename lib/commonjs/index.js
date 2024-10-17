"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProximiioMap = void 0;
exports.metersToSteps = metersToSteps;
var _reactNativeWebview = require("react-native-webview");
var _react = require("react");
var _nonSecure = require("nanoid/non-secure");
var _common = require("../example/src/common.js");
var _jsxRuntime = require("react/jsx-runtime");
const uri = 'https://proximiio-map-mobile.ams3.cdn.digitaloceanspaces.com/1.0.0-b16/index.html';
var Message = /*#__PURE__*/function (Message) {
  Message["ON_CLICK"] = "event:click";
  Message["READY"] = "ready";
  Message["ROUTE_NOT_FOUND"] = "route:not_found";
  Message["ROUTE_CANCELED"] = "route:canceled";
  Message["ROUTE_STEP_UPDATE"] = "route:step:update";
  Message["TOUCH_START"] = "touch:start";
  Message["TOUCH_MOVE"] = "touch:move";
  Message["TOUCH_END"] = "touch:end";
  Message["CALLBACK"] = "callback";
  return Message;
}(Message || {});
var Action = /*#__PURE__*/function (Action) {
  Action["getAmenities"] = "getAmenities";
  Action["getFeatures"] = "getFeatures";
  Action["routeFind"] = "routeFind";
  Action["routeStart"] = "routeStart";
  return Action;
}(Action || {});
function metersToSteps(meters) {
  return Math.round(meters * 1.31234);
}
class ProximiioMap extends _react.Component {
  webview = null;
  callbacks = {};
  ready = false;
  constructor(props) {
    super(props);
  }
  setCenter(lat, lng) {
    const js = `mapController.setCenter(${lat}, ${lng});`;
    this.dispatch(js);
  }
  setPosition(lat, lng, level) {
    const js = `mapController.setPosition(${lat}, ${lng}, ${level});`;
    this.dispatch(js);
  }
  dispatch(fn) {
    if (!this.ready) {
      console.log('****blocking dispatch, not ready yet***');
      return;
    }
    (0, _common.debug)(`[Dispatch]: ${fn}`);
    this.webview?.injectJavaScript(fn);
  }
  setZoom(zoom) {
    const js = `mapController.setZoom(${zoom});`;
    this.dispatch(js);
  }
  flyTo(options) {
    const js = `mapController.flyTo('${JSON.stringify(options)}');`;
    this.dispatch(js);
  }
  panTo(lat, lng, duration) {
    const js = `mapController.panTo(${lat}, ${lng}, ${duration});`;
    this.dispatch(js);
  }
  setLevel(level) {
    const js = `mapController.setLevel(${level});`;
    this.dispatch(js);
  }
  setFilter(fn) {
    const js = `mapController.setFeatureFilter(${fn});`;
    this.dispatch(js);
  }
  cancelFilter() {
    const js = `mapController.cancelFeatureFilter();`;
    this.dispatch(js);
  }
  async routeFind(options) {
    const params = JSON.stringify(options);
    const route = await this.asyncTask(Action.routeFind, `'${params}'`);
    return route;
  }
  async routeStart(options) {
    const params = JSON.stringify(options);
    const route = await this.asyncTask(Action.routeStart, `'${params}'`);
    return route;
  }
  routeCancel() {
    const js = `mapController.routeCancel();`;
    this.dispatch(js);
  }
  async getAmenities() {
    const amenities = await this.asyncTask(Action.getAmenities, '');
    return amenities;
  }
  async getFeatures(pointsOnly = false) {
    const features = await this.asyncTask(Action.getFeatures, `${pointsOnly}`);
    return features;
  }
  asyncTask(fn, params) {
    return new Promise(resolve => {
      const requestId = (0, _nonSecure.nanoid)();
      this.callbacks[requestId] = items => {
        resolve(items);
      };
      const cmd = `mapController.${fn}(${params})`;
      const evt = `JSON.stringify({"event":"callback","data":{"items":items,"requestId":"${requestId}"}})`;
      const js = `(async()=>{const items=await ${cmd};window.ReactNativeWebView.postMessage(${evt});})();true`;
      this.dispatch(js);
    });
  }
  onCallback = event => {
    const {
      items,
      requestId
    } = event.data;
    const callback = this.callbacks[requestId];
    if (callback) {
      callback(items);
      delete this.callbacks[requestId];
    }
  };
  onMessage = evt => {
    let event;
    try {
      event = JSON.parse(evt.nativeEvent.data);
    } catch (e) {
      console.error('ProximiioMap => onMessage parsing error', e);
    }
    if (!event) return;
    switch (event.event) {
      case Message.ON_CLICK:
        if (this.props.onClick) this.props.onClick(JSON.parse(event.data));
        break;
      case Message.READY:
        this.ready = true;
        if (this.props.onReady) this.props.onReady();
        break;
      case Message.ROUTE_STEP_UPDATE:
        if (this.props.onRouteStepUpdate) this.props.onRouteStepUpdate(event.data);
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
        bounds: this.props.bounds
      }
    };
    const json = JSON.stringify(settings);
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeWebview.WebView, {
      ref: ref => this.webview = ref,
      source: {
        uri
      },
      style: this.props.style,
      webviewDebuggingEnabled: true,
      useWebView2: true,
      injectedJavaScriptBeforeContentLoaded: `
          const settings = ${json};
          window.token = settings.token;
          window.mapDefaults = settings.mapDefaults;
          window.icons = settings.icons;
          true
        `,
      injectedJavaScriptObject: settings,
      onError: evt => {
        console.log('on mapview error', evt);
      },
      onLoadEnd: () => {
        console.log('loaded');
      },
      onMessage: this.onMessage
    });
  }
}
exports.ProximiioMap = ProximiioMap;
//# sourceMappingURL=index.js.map