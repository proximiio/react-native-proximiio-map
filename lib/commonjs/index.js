"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.debug = exports.ProximiioMap = void 0;
exports.metersToSteps = metersToSteps;
var _reactNativeWebview = require("react-native-webview");
var _react = require("react");
var _nonSecure = require("nanoid/non-secure");
var _jsxRuntime = require("react/jsx-runtime");
const log = (...args) => {
  if (__DEV__) {
    console.log(`${new Date().toISOString()} [Proximi.io] ${args}`);
  }
};
exports.log = log;
const debug = (..._args) => {
  if (__DEV__) {
    // console.log(`${new Date().toISOString()} [Proximi.io] ${args}`);
  }
};
exports.debug = debug;
const uri = 'https://proximiio-map-mobile.ams3.cdn.digitaloceanspaces.com/1.0.0-b45/index.html';
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
  Action["addImage"] = "addImage";
  Action["hasImage"] = "hasImage";
  Action["removeImage"] = "removeImage";
  Action["addSource"] = "addSource";
  Action["getSource"] = "getSource";
  Action["hasSource"] = "hasSource";
  Action["removeSource"] = "removeSource";
  Action["addLayer"] = "addLayer";
  Action["getLayer"] = "getLayer";
  Action["hasLayer"] = "hasLayer";
  Action["moveLayer"] = "moveLayer";
  Action["removeLayer"] = "removeLayer";
  Action["addFeature"] = "addFeature";
  Action["updateFeature"] = "updateFeature";
  Action["deleteFeature"] = "deleteFeature";
  return Action;
}(Action || {});
function metersToSteps(meters) {
  return Math.round(meters * 1.31234);
}
class ProximiioMap extends _react.Component {
  webview = null;
  callbacks = {};
  ready = false;
  async addImage(id, _uri) {
    const params = `'${id}', '${_uri}'`;
    const result = await this.asyncTask(Action.addImage, params);
    return result;
  }
  async hasImage(id) {
    const result = await this.asyncTask(Action.hasImage, `'${id}'`);
    return result;
  }
  async removeImage(id) {
    const result = await this.asyncTask(Action.removeImage, `'${id}'`);
    return result;
  }
  async addFeature(feature) {
    const params = `'${JSON.stringify(feature)}'`;
    const result = await this.asyncTask(Action.addFeature, params);
    return result;
  }
  async updateFeature(feature) {
    const params = `'${JSON.stringify(feature)}'`;
    const result = await this.asyncTask(Action.updateFeature, params);
    return result;
  }
  async deleteFeature(feature) {
    const params = `'${JSON.stringify(feature)}'`;
    const result = await this.asyncTask(Action.deleteFeature, params);
    return result;
  }
  async addSource(id, source) {
    const params = `'${id}', '${JSON.stringify(source)}'`;
    const result = await this.asyncTask(Action.addSource, params);
    return result;
  }
  async getSource(id) {
    const result = await this.asyncTask(Action.getSource, `'${id}'`);
    return result;
  }
  async hasSource(id) {
    const result = await this.asyncTask(Action.hasSource, `'${id}'`);
    return result;
  }
  async removeSource(id) {
    const result = await this.asyncTask(Action.removeSource, `'${id}'`);
    return result;
  }
  async addLayer(layer) {
    const params = `'${JSON.stringify(layer)}'`;
    const result = await this.asyncTask(Action.addLayer, params);
    return result;
  }
  async getLayer(id) {
    const result = await this.asyncTask(Action.getLayer, `'${id}'`);
    return result;
  }
  async hasLayer(id) {
    const result = await this.asyncTask(Action.hasLayer, `'${id}'`);
    return result;
  }
  async moveLayer(id, beforeId) {
    const result = await this.asyncTask(Action.moveLayer, `'${id}', '${beforeId}'`);
    return result;
  }
  async removeLayer(id) {
    const result = await this.asyncTask(Action.removeLayer, `'${id}'`);
    return result;
  }
  setCenter(lat, lng) {
    this.dispatch(`mapController.setCenter(${lat}, ${lng});`);
  }
  setPosition(lat, lng, level) {
    this.dispatch(`mapController.setPosition(${lat}, ${lng}, ${level});`);
  }
  setZoom(zoom) {
    this.dispatch(`mapController.setZoom(${zoom});`);
  }
  flyTo(options) {
    this.dispatch(`mapController.flyTo('${JSON.stringify(options)}');`);
  }
  panTo(lat, lng, duration) {
    this.dispatch(`mapController.panTo(${lat}, ${lng}, ${duration});`);
  }
  setLevel(level) {
    this.dispatch(`mapController.setLevel(${level});`);
  }
  setFilter(fn) {
    this.dispatch(`mapController.setFeatureFilter(${fn});`);
  }
  cancelFilter() {
    this.dispatch(`mapController.cancelFeatureFilter();`);
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
    this.dispatch(`mapController.routeCancel();`);
  }
  async getAmenities() {
    const amenities = await this.asyncTask(Action.getAmenities, '');
    return amenities;
  }
  async getFeatures(pointsOnly = false) {
    const features = await this.asyncTask(Action.getFeatures, `${pointsOnly}`);
    return features;
  }
  dispatch(fn) {
    if (!this.ready) {
      console.log('**** Dispatch Blocked, WebView not ready yet ***');
      return;
    }
    debug(`[Dispatch]: ${fn}`);
    this.webview?.injectJavaScript(fn);
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
        console.error('on mapview error', evt);
      },
      onMessage: this.onMessage
    });
  }
}
exports.ProximiioMap = ProximiioMap;
//# sourceMappingURL=index.js.map