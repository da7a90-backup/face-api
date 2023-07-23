/*
  Face-API
  homepage: <https://github.com/vladmandic/face-api>
  author: <https://github.com/vladmandic>'
*/

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all3) => {
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// dist/tfjs.esm.js
var tfjs_esm_exports = {};
__export(tfjs_esm_exports, {
  default: () => tf_node_default,
  version: () => version6
});
import url from "url";
import http from "http";
import https from "https";
import util from "util";
import zlib from "zlib";
import stream3 from "stream";
import stream from "stream";
import EventEmitter from "events";
import { TextEncoder } from "util";
import { Readable } from "stream";
import stream2 from "stream";
import { Readable as Readable2 } from "stream";
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require2 = ((x) => typeof __require !== "undefined" ? __require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof __require !== "undefined" ? __require : a)[b]
}) : x)(function(x) {
  if (typeof __require !== "undefined")
    return __require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require22() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_delayed_stream = __commonJS({
  "node_modules/delayed-stream/lib/delayed_stream.js"(exports, module) {
    var Stream = __require2("stream").Stream;
    var util2 = __require2("util");
    module.exports = DelayedStream;
    function DelayedStream() {
      this.source = null;
      this.dataSize = 0;
      this.maxDataSize = 1024 * 1024;
      this.pauseStream = true;
      this._maxDataSizeExceeded = false;
      this._released = false;
      this._bufferedEvents = [];
    }
    util2.inherits(DelayedStream, Stream);
    DelayedStream.create = function(source, options) {
      var delayedStream = new this();
      options = options || {};
      for (var option in options) {
        delayedStream[option] = options[option];
      }
      delayedStream.source = source;
      var realEmit = source.emit;
      source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
      };
      source.on("error", function() {
      });
      if (delayedStream.pauseStream) {
        source.pause();
      }
      return delayedStream;
    };
    Object.defineProperty(DelayedStream.prototype, "readable", {
      configurable: true,
      enumerable: true,
      get: function() {
        return this.source.readable;
      }
    });
    DelayedStream.prototype.setEncoding = function() {
      return this.source.setEncoding.apply(this.source, arguments);
    };
    DelayedStream.prototype.resume = function() {
      if (!this._released) {
        this.release();
      }
      this.source.resume();
    };
    DelayedStream.prototype.pause = function() {
      this.source.pause();
    };
    DelayedStream.prototype.release = function() {
      this._released = true;
      this._bufferedEvents.forEach(function(args) {
        this.emit.apply(this, args);
      }.bind(this));
      this._bufferedEvents = [];
    };
    DelayedStream.prototype.pipe = function() {
      var r = Stream.prototype.pipe.apply(this, arguments);
      this.resume();
      return r;
    };
    DelayedStream.prototype._handleEmit = function(args) {
      if (this._released) {
        this.emit.apply(this, args);
        return;
      }
      if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
      }
      this._bufferedEvents.push(args);
    };
    DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
      if (this._maxDataSizeExceeded) {
        return;
      }
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      this._maxDataSizeExceeded = true;
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this.emit("error", new Error(message));
    };
  }
});
var require_combined_stream = __commonJS({
  "node_modules/combined-stream/lib/combined_stream.js"(exports, module) {
    var util2 = __require2("util");
    var Stream = __require2("stream").Stream;
    var DelayedStream = require_delayed_stream();
    module.exports = CombinedStream;
    function CombinedStream() {
      this.writable = false;
      this.readable = true;
      this.dataSize = 0;
      this.maxDataSize = 2 * 1024 * 1024;
      this.pauseStreams = true;
      this._released = false;
      this._streams = [];
      this._currentStream = null;
      this._insideLoop = false;
      this._pendingNext = false;
    }
    util2.inherits(CombinedStream, Stream);
    CombinedStream.create = function(options) {
      var combinedStream = new this();
      options = options || {};
      for (var option in options) {
        combinedStream[option] = options[option];
      }
      return combinedStream;
    };
    CombinedStream.isStreamLike = function(stream4) {
      return typeof stream4 !== "function" && typeof stream4 !== "string" && typeof stream4 !== "boolean" && typeof stream4 !== "number" && !Buffer.isBuffer(stream4);
    };
    CombinedStream.prototype.append = function(stream4) {
      var isStreamLike = CombinedStream.isStreamLike(stream4);
      if (isStreamLike) {
        if (!(stream4 instanceof DelayedStream)) {
          var newStream = DelayedStream.create(stream4, {
            maxDataSize: Infinity,
            pauseStream: this.pauseStreams
          });
          stream4.on("data", this._checkDataSize.bind(this));
          stream4 = newStream;
        }
        this._handleErrors(stream4);
        if (this.pauseStreams) {
          stream4.pause();
        }
      }
      this._streams.push(stream4);
      return this;
    };
    CombinedStream.prototype.pipe = function(dest, options) {
      Stream.prototype.pipe.call(this, dest, options);
      this.resume();
      return dest;
    };
    CombinedStream.prototype._getNext = function() {
      this._currentStream = null;
      if (this._insideLoop) {
        this._pendingNext = true;
        return;
      }
      this._insideLoop = true;
      try {
        do {
          this._pendingNext = false;
          this._realGetNext();
        } while (this._pendingNext);
      } finally {
        this._insideLoop = false;
      }
    };
    CombinedStream.prototype._realGetNext = function() {
      var stream4 = this._streams.shift();
      if (typeof stream4 == "undefined") {
        this.end();
        return;
      }
      if (typeof stream4 !== "function") {
        this._pipeNext(stream4);
        return;
      }
      var getStream = stream4;
      getStream(function(stream5) {
        var isStreamLike = CombinedStream.isStreamLike(stream5);
        if (isStreamLike) {
          stream5.on("data", this._checkDataSize.bind(this));
          this._handleErrors(stream5);
        }
        this._pipeNext(stream5);
      }.bind(this));
    };
    CombinedStream.prototype._pipeNext = function(stream4) {
      this._currentStream = stream4;
      var isStreamLike = CombinedStream.isStreamLike(stream4);
      if (isStreamLike) {
        stream4.on("end", this._getNext.bind(this));
        stream4.pipe(this, { end: false });
        return;
      }
      var value = stream4;
      this.write(value);
      this._getNext();
    };
    CombinedStream.prototype._handleErrors = function(stream4) {
      var self2 = this;
      stream4.on("error", function(err) {
        self2._emitError(err);
      });
    };
    CombinedStream.prototype.write = function(data) {
      this.emit("data", data);
    };
    CombinedStream.prototype.pause = function() {
      if (!this.pauseStreams) {
        return;
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function")
        this._currentStream.pause();
      this.emit("pause");
    };
    CombinedStream.prototype.resume = function() {
      if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
      }
      if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function")
        this._currentStream.resume();
      this.emit("resume");
    };
    CombinedStream.prototype.end = function() {
      this._reset();
      this.emit("end");
    };
    CombinedStream.prototype.destroy = function() {
      this._reset();
      this.emit("close");
    };
    CombinedStream.prototype._reset = function() {
      this.writable = false;
      this._streams = [];
      this._currentStream = null;
    };
    CombinedStream.prototype._checkDataSize = function() {
      this._updateDataSize();
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
      this._emitError(new Error(message));
    };
    CombinedStream.prototype._updateDataSize = function() {
      this.dataSize = 0;
      var self2 = this;
      this._streams.forEach(function(stream4) {
        if (!stream4.dataSize) {
          return;
        }
        self2.dataSize += stream4.dataSize;
      });
      if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
      }
    };
    CombinedStream.prototype._emitError = function(err) {
      this._reset();
      this.emit("error", err);
    };
  }
});
var require_db = __commonJS({
  "node_modules/mime-db/db.json"(exports, module) {
    module.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/ace+cbor": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/at+jwt": {
        source: "iana"
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/city+json": {
        source: "iana",
        compressible: true
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"]
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"]
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"]
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/oauth-authz-req+jwt": {
        source: "iana"
      },
      "application/oblivious-dns-message": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p21": {
        source: "iana"
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"]
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/token-introspection+jwt": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"]
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana"
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.lpp": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ngap": {
        source: "iana"
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana"
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana"
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"]
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.arrow.file": {
        source: "iana"
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana"
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.cryptomator.vault": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"]
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.resilient.logic": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"]
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"]
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"]
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"]
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"]
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/step": {
        source: "iana"
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"]
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"]
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.pytha.pyox": {
        source: "iana"
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"]
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/jxsv": {
        source: "iana"
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/vp9": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});
var require_mime_db = __commonJS({
  "node_modules/mime-db/index.js"(exports, module) {
    module.exports = require_db();
  }
});
var require_mime_types = __commonJS({
  "node_modules/mime-types/index.js"(exports) {
    "use strict";
    var db = require_mime_db();
    var extname = __require2("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports.charset = charset;
    exports.charsets = { lookup: charset };
    exports.contentType = contentType;
    exports.extension = extension;
    exports.extensions = /* @__PURE__ */ Object.create(null);
    exports.lookup = lookup;
    exports.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports.extensions, exports.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports.charset(mime);
        if (charset2)
          mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path) {
      if (!path || typeof path !== "string") {
        return false;
      }
      var extension2 = extname("x." + path).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});
var require_defer = __commonJS({
  "node_modules/asynckit/lib/defer.js"(exports, module) {
    module.exports = defer;
    function defer(fn) {
      var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
      if (nextTick) {
        nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }
    }
  }
});
var require_async = __commonJS({
  "node_modules/asynckit/lib/async.js"(exports, module) {
    var defer = require_defer();
    module.exports = async;
    function async(callback) {
      var isAsync = false;
      defer(function() {
        isAsync = true;
      });
      return function async_callback(err, result) {
        if (isAsync) {
          callback(err, result);
        } else {
          defer(function nextTick_callback() {
            callback(err, result);
          });
        }
      };
    }
  }
});
var require_abort = __commonJS({
  "node_modules/asynckit/lib/abort.js"(exports, module) {
    module.exports = abort;
    function abort(state) {
      Object.keys(state.jobs).forEach(clean.bind(state));
      state.jobs = {};
    }
    function clean(key) {
      if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
      }
    }
  }
});
var require_iterate = __commonJS({
  "node_modules/asynckit/lib/iterate.js"(exports, module) {
    var async = require_async();
    var abort = require_abort();
    module.exports = iterate;
    function iterate(list, iterator, state, callback) {
      var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
      state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        if (!(key in state.jobs)) {
          return;
        }
        delete state.jobs[key];
        if (error) {
          abort(state);
        } else {
          state.results[key] = output;
        }
        callback(error, state.results);
      });
    }
    function runJob(iterator, key, item, callback) {
      var aborter;
      if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
      } else {
        aborter = iterator(item, key, async(callback));
      }
      return aborter;
    }
  }
});
var require_state = __commonJS({
  "node_modules/asynckit/lib/state.js"(exports, module) {
    module.exports = state;
    function state(list, sortMethod) {
      var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
      };
      if (sortMethod) {
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
          return sortMethod(list[a], list[b]);
        });
      }
      return initState;
    }
  }
});
var require_terminator = __commonJS({
  "node_modules/asynckit/lib/terminator.js"(exports, module) {
    var abort = require_abort();
    var async = require_async();
    module.exports = terminator;
    function terminator(callback) {
      if (!Object.keys(this.jobs).length) {
        return;
      }
      this.index = this.size;
      abort(this);
      async(callback)(null, this.results);
    }
  }
});
var require_parallel = __commonJS({
  "node_modules/asynckit/parallel.js"(exports, module) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module.exports = parallel;
    function parallel(list, iterator, callback) {
      var state = initState(list);
      while (state.index < (state["keyedList"] || list).length) {
        iterate(list, iterator, state, function(error, result) {
          if (error) {
            callback(error, result);
            return;
          }
          if (Object.keys(state.jobs).length === 0) {
            callback(null, state.results);
            return;
          }
        });
        state.index++;
      }
      return terminator.bind(state, callback);
    }
  }
});
var require_serialOrdered = __commonJS({
  "node_modules/asynckit/serialOrdered.js"(exports, module) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module.exports = serialOrdered;
    module.exports.ascending = ascending;
    module.exports.descending = descending;
    function serialOrdered(list, iterator, sortMethod, callback) {
      var state = initState(list, sortMethod);
      iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
          callback(error, result);
          return;
        }
        state.index++;
        if (state.index < (state["keyedList"] || list).length) {
          iterate(list, iterator, state, iteratorHandler);
          return;
        }
        callback(null, state.results);
      });
      return terminator.bind(state, callback);
    }
    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
    function descending(a, b) {
      return -1 * ascending(a, b);
    }
  }
});
var require_serial = __commonJS({
  "node_modules/asynckit/serial.js"(exports, module) {
    var serialOrdered = require_serialOrdered();
    module.exports = serial;
    function serial(list, iterator, callback) {
      return serialOrdered(list, iterator, null, callback);
    }
  }
});
var require_asynckit = __commonJS({
  "node_modules/asynckit/index.js"(exports, module) {
    module.exports = {
      parallel: require_parallel(),
      serial: require_serial(),
      serialOrdered: require_serialOrdered()
    };
  }
});
var require_populate = __commonJS({
  "node_modules/axios/node_modules/form-data/lib/populate.js"(exports, module) {
    module.exports = function(dst, src) {
      Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop];
      });
      return dst;
    };
  }
});
var require_form_data = __commonJS({
  "node_modules/axios/node_modules/form-data/lib/form_data.js"(exports, module) {
    var CombinedStream = require_combined_stream();
    var util2 = __require2("util");
    var path = __require2("path");
    var http2 = __require2("http");
    var https2 = __require2("https");
    var parseUrl = __require2("url").parse;
    var fs = __require2("fs");
    var Stream = __require2("stream").Stream;
    var mime = require_mime_types();
    var asynckit = require_asynckit();
    var populate = require_populate();
    module.exports = FormData3;
    util2.inherits(FormData3, CombinedStream);
    function FormData3(options) {
      if (!(this instanceof FormData3)) {
        return new FormData3(options);
      }
      this._overheadLength = 0;
      this._valueLength = 0;
      this._valuesToMeasure = [];
      CombinedStream.call(this);
      options = options || {};
      for (var option in options) {
        this[option] = options[option];
      }
    }
    FormData3.LINE_BREAK = "\r\n";
    FormData3.DEFAULT_CONTENT_TYPE = "application/octet-stream";
    FormData3.prototype.append = function(field, value, options) {
      options = options || {};
      if (typeof options == "string") {
        options = { filename: options };
      }
      var append2 = CombinedStream.prototype.append.bind(this);
      if (typeof value == "number") {
        value = "" + value;
      }
      if (util2.isArray(value)) {
        this._error(new Error("Arrays are not supported."));
        return;
      }
      var header = this._multiPartHeader(field, value, options);
      var footer = this._multiPartFooter();
      append2(header);
      append2(value);
      append2(footer);
      this._trackLength(header, value, options);
    };
    FormData3.prototype._trackLength = function(header, value, options) {
      var valueLength = 0;
      if (options.knownLength != null) {
        valueLength += +options.knownLength;
      } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
      } else if (typeof value === "string") {
        valueLength = Buffer.byteLength(value);
      }
      this._valueLength += valueLength;
      this._overheadLength += Buffer.byteLength(header) + FormData3.LINE_BREAK.length;
      if (!value || !value.path && !(value.readable && value.hasOwnProperty("httpVersion")) && !(value instanceof Stream)) {
        return;
      }
      if (!options.knownLength) {
        this._valuesToMeasure.push(value);
      }
    };
    FormData3.prototype._lengthRetriever = function(value, callback) {
      if (value.hasOwnProperty("fd")) {
        if (value.end != void 0 && value.end != Infinity && value.start != void 0) {
          callback(null, value.end + 1 - (value.start ? value.start : 0));
        } else {
          fs.stat(value.path, function(err, stat) {
            var fileSize;
            if (err) {
              callback(err);
              return;
            }
            fileSize = stat.size - (value.start ? value.start : 0);
            callback(null, fileSize);
          });
        }
      } else if (value.hasOwnProperty("httpVersion")) {
        callback(null, +value.headers["content-length"]);
      } else if (value.hasOwnProperty("httpModule")) {
        value.on("response", function(response) {
          value.pause();
          callback(null, +response.headers["content-length"]);
        });
        value.resume();
      } else {
        callback("Unknown stream");
      }
    };
    FormData3.prototype._multiPartHeader = function(field, value, options) {
      if (typeof options.header == "string") {
        return options.header;
      }
      var contentDisposition = this._getContentDisposition(value, options);
      var contentType = this._getContentType(value, options);
      var contents = "";
      var headers = {
        // add custom disposition as third element or keep it two elements if not
        "Content-Disposition": ["form-data", 'name="' + field + '"'].concat(contentDisposition || []),
        // if no content type. allow it to be empty array
        "Content-Type": [].concat(contentType || [])
      };
      if (typeof options.header == "object") {
        populate(headers, options.header);
      }
      var header;
      for (var prop in headers) {
        if (!headers.hasOwnProperty(prop))
          continue;
        header = headers[prop];
        if (header == null) {
          continue;
        }
        if (!Array.isArray(header)) {
          header = [header];
        }
        if (header.length) {
          contents += prop + ": " + header.join("; ") + FormData3.LINE_BREAK;
        }
      }
      return "--" + this.getBoundary() + FormData3.LINE_BREAK + contents + FormData3.LINE_BREAK;
    };
    FormData3.prototype._getContentDisposition = function(value, options) {
      var filename, contentDisposition;
      if (typeof options.filepath === "string") {
        filename = path.normalize(options.filepath).replace(/\\/g, "/");
      } else if (options.filename || value.name || value.path) {
        filename = path.basename(options.filename || value.name || value.path);
      } else if (value.readable && value.hasOwnProperty("httpVersion")) {
        filename = path.basename(value.client._httpMessage.path || "");
      }
      if (filename) {
        contentDisposition = 'filename="' + filename + '"';
      }
      return contentDisposition;
    };
    FormData3.prototype._getContentType = function(value, options) {
      var contentType = options.contentType;
      if (!contentType && value.name) {
        contentType = mime.lookup(value.name);
      }
      if (!contentType && value.path) {
        contentType = mime.lookup(value.path);
      }
      if (!contentType && value.readable && value.hasOwnProperty("httpVersion")) {
        contentType = value.headers["content-type"];
      }
      if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
      }
      if (!contentType && typeof value == "object") {
        contentType = FormData3.DEFAULT_CONTENT_TYPE;
      }
      return contentType;
    };
    FormData3.prototype._multiPartFooter = function() {
      return function(next) {
        var footer = FormData3.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
          footer += this._lastBoundary();
        }
        next(footer);
      }.bind(this);
    };
    FormData3.prototype._lastBoundary = function() {
      return "--" + this.getBoundary() + "--" + FormData3.LINE_BREAK;
    };
    FormData3.prototype.getHeaders = function(userHeaders) {
      var header;
      var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary()
      };
      for (header in userHeaders) {
        if (userHeaders.hasOwnProperty(header)) {
          formHeaders[header.toLowerCase()] = userHeaders[header];
        }
      }
      return formHeaders;
    };
    FormData3.prototype.setBoundary = function(boundary) {
      this._boundary = boundary;
    };
    FormData3.prototype.getBoundary = function() {
      if (!this._boundary) {
        this._generateBoundary();
      }
      return this._boundary;
    };
    FormData3.prototype.getBuffer = function() {
      var dataBuffer = new Buffer.alloc(0);
      var boundary = this.getBoundary();
      for (var i = 0, len = this._streams.length; i < len; i++) {
        if (typeof this._streams[i] !== "function") {
          if (Buffer.isBuffer(this._streams[i])) {
            dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
          } else {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
          }
          if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
            dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData3.LINE_BREAK)]);
          }
        }
      }
      return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
    };
    FormData3.prototype._generateBoundary = function() {
      var boundary = "--------------------------";
      for (var i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
      }
      this._boundary = boundary;
    };
    FormData3.prototype.getLengthSync = function() {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this.hasKnownLength()) {
        this._error(new Error("Cannot calculate proper length in synchronous way."));
      }
      return knownLength;
    };
    FormData3.prototype.hasKnownLength = function() {
      var hasKnownLength = true;
      if (this._valuesToMeasure.length) {
        hasKnownLength = false;
      }
      return hasKnownLength;
    };
    FormData3.prototype.getLength = function(cb) {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
      }
      asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
          cb(err);
          return;
        }
        values.forEach(function(length) {
          knownLength += length;
        });
        cb(null, knownLength);
      });
    };
    FormData3.prototype.submit = function(params, cb) {
      var request, options, defaults2 = { method: "post" };
      if (typeof params == "string") {
        params = parseUrl(params);
        options = populate({
          port: params.port,
          path: params.pathname,
          host: params.hostname,
          protocol: params.protocol
        }, defaults2);
      } else {
        options = populate(params, defaults2);
        if (!options.port) {
          options.port = options.protocol == "https:" ? 443 : 80;
        }
      }
      options.headers = this.getHeaders(params.headers);
      if (options.protocol == "https:") {
        request = https2.request(options);
      } else {
        request = http2.request(options);
      }
      this.getLength(function(err, length) {
        if (err && err !== "Unknown stream") {
          this._error(err);
          return;
        }
        if (length) {
          request.setHeader("Content-Length", length);
        }
        this.pipe(request);
        if (cb) {
          var onResponse;
          var callback = function(error, responce) {
            request.removeListener("error", callback);
            request.removeListener("response", onResponse);
            return cb.call(this, error, responce);
          };
          onResponse = callback.bind(this, null);
          request.on("error", callback);
          request.on("response", onResponse);
        }
      }.bind(this));
      return request;
    };
    FormData3.prototype._error = function(err) {
      if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
      }
    };
    FormData3.prototype.toString = function() {
      return "[object FormData]";
    };
  }
});
var require_proxy_from_env = __commonJS({
  "node_modules/proxy-from-env/index.js"(exports) {
    "use strict";
    var parseUrl = __require2("url").parse;
    var DEFAULT_PORTS = {
      ftp: 21,
      gopher: 70,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    };
    var stringEndsWith = String.prototype.endsWith || function(s) {
      return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
    };
    function getProxyForUrl2(url2) {
      var parsedUrl = typeof url2 === "string" ? parseUrl(url2) : url2 || {};
      var proto = parsedUrl.protocol;
      var hostname = parsedUrl.host;
      var port = parsedUrl.port;
      if (typeof hostname !== "string" || !hostname || typeof proto !== "string") {
        return "";
      }
      proto = proto.split(":", 1)[0];
      hostname = hostname.replace(/:\d*$/, "");
      port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
      if (!shouldProxy(hostname, port)) {
        return "";
      }
      var proxy = getEnv2("npm_config_" + proto + "_proxy") || getEnv2(proto + "_proxy") || getEnv2("npm_config_proxy") || getEnv2("all_proxy");
      if (proxy && proxy.indexOf("://") === -1) {
        proxy = proto + "://" + proxy;
      }
      return proxy;
    }
    function shouldProxy(hostname, port) {
      var NO_PROXY = (getEnv2("npm_config_no_proxy") || getEnv2("no_proxy")).toLowerCase();
      if (!NO_PROXY) {
        return true;
      }
      if (NO_PROXY === "*") {
        return false;
      }
      return NO_PROXY.split(/[,\s]/).every(function(proxy) {
        if (!proxy) {
          return true;
        }
        var parsedProxy = proxy.match(/^(.+):(\d+)$/);
        var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
        var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
        if (parsedProxyPort && parsedProxyPort !== port) {
          return true;
        }
        if (!/^[.*]/.test(parsedProxyHostname)) {
          return hostname !== parsedProxyHostname;
        }
        if (parsedProxyHostname.charAt(0) === "*") {
          parsedProxyHostname = parsedProxyHostname.slice(1);
        }
        return !stringEndsWith.call(hostname, parsedProxyHostname);
      });
    }
    function getEnv2(key) {
      return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
    }
    exports.getProxyForUrl = getProxyForUrl2;
  }
});
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend2;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend2(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports, module) {
    "use strict";
    module.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports, module) {
    "use strict";
    var os = __require2("os");
    var tty = __require2("tty");
    var hasFlag = require_has_flag();
    var { env: env2 } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env2) {
      if (env2.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env2.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env2.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env2.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env2.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env2) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env2) || env2.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env2) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env2.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env2) {
        const version72 = parseInt((env2.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env2.TERM_PROGRAM) {
          case "iTerm.app":
            return version72 >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env2.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env2) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream4) {
      const level = supportsColor(stream4, stream4 && stream4.isTTY);
      return translateLevel(level);
    }
    module.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module) {
    var tty = __require2("tty");
    var util2 = __require2("util");
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util2.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  }
});
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module.exports = require_browser();
    } else {
      module.exports = require_node();
    }
  }
});
var require_debug = __commonJS({
  "node_modules/follow-redirects/debug.js"(exports, module) {
    var debug;
    module.exports = function() {
      if (!debug) {
        try {
          debug = require_src()("follow-redirects");
        } catch (error) {
        }
        if (typeof debug !== "function") {
          debug = function() {
          };
        }
      }
      debug.apply(null, arguments);
    };
  }
});
var require_follow_redirects = __commonJS({
  "node_modules/follow-redirects/index.js"(exports, module) {
    var url2 = __require2("url");
    var URL2 = url2.URL;
    var http2 = __require2("http");
    var https2 = __require2("https");
    var Writable = __require2("stream").Writable;
    var assert = __require2("assert");
    var debug = require_debug();
    var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
    var eventHandlers = /* @__PURE__ */ Object.create(null);
    events.forEach(function(event) {
      eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var InvalidUrlError = createErrorType(
      "ERR_INVALID_URL",
      "Invalid URL",
      TypeError
    );
    var RedirectionError = createErrorType(
      "ERR_FR_REDIRECTION_FAILURE",
      "Redirected request failed"
    );
    var TooManyRedirectsError = createErrorType(
      "ERR_FR_TOO_MANY_REDIRECTS",
      "Maximum number of redirects exceeded"
    );
    var MaxBodyLengthExceededError = createErrorType(
      "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
      "Request body larger than maxBodyLength limit"
    );
    var WriteAfterEndError = createErrorType(
      "ERR_STREAM_WRITE_AFTER_END",
      "write after end"
    );
    function RedirectableRequest(options, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];
      if (responseCallback) {
        this.on("response", responseCallback);
      }
      var self2 = this;
      this._onNativeResponse = function(response) {
        self2._processResponse(response);
      };
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype.abort = function() {
      abortRequest(this._currentRequest);
      this.emit("abort");
    };
    RedirectableRequest.prototype.write = function(data, encoding, callback) {
      if (this._ending) {
        throw new WriteAfterEndError();
      }
      if (!isString2(data) && !isBuffer2(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
      }
      if (isFunction2(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data, encoding });
        this._currentRequest.write(data, encoding, callback);
      } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
      }
    };
    RedirectableRequest.prototype.end = function(data, encoding, callback) {
      if (isFunction2(data)) {
        callback = data;
        data = encoding = null;
      } else if (isFunction2(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      } else {
        var self2 = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
          self2._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };
    RedirectableRequest.prototype.setHeader = function(name, value) {
      this._options.headers[name] = value;
      this._currentRequest.setHeader(name, value);
    };
    RedirectableRequest.prototype.removeHeader = function(name) {
      delete this._options.headers[name];
      this._currentRequest.removeHeader(name);
    };
    RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
      var self2 = this;
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
      }
      function startTimer(socket) {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
        }
        self2._timeout = setTimeout(function() {
          self2.emit("timeout");
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }
      function clearTimer() {
        if (self2._timeout) {
          clearTimeout(self2._timeout);
          self2._timeout = null;
        }
        self2.removeListener("abort", clearTimer);
        self2.removeListener("error", clearTimer);
        self2.removeListener("response", clearTimer);
        if (callback) {
          self2.removeListener("timeout", callback);
        }
        if (!self2.socket) {
          self2._currentRequest.removeListener("socket", startTimer);
        }
      }
      if (callback) {
        this.on("timeout", callback);
      }
      if (this.socket) {
        startTimer(this.socket);
      } else {
        this._currentRequest.once("socket", startTimer);
      }
      this.on("socket", destroyOnTimeout);
      this.on("abort", clearTimer);
      this.on("error", clearTimer);
      this.on("response", clearTimer);
      return this;
    };
    [
      "flushHeaders",
      "getHeader",
      "setNoDelay",
      "setSocketKeepAlive"
    ].forEach(function(method) {
      RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
      };
    });
    ["aborted", "connection", "socket"].forEach(function(property) {
      Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
          return this._currentRequest[property];
        }
      });
    });
    RedirectableRequest.prototype._sanitizeOptions = function(options) {
      if (!options.headers) {
        options.headers = {};
      }
      if (options.host) {
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };
    RedirectableRequest.prototype._performRequest = function() {
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        this.emit("error", new TypeError("Unsupported protocol " + protocol));
        return;
      }
      if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
      }
      var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
      request._redirectable = this;
      for (var event of events) {
        request.on(event, eventHandlers[event]);
      }
      this._currentUrl = /^\//.test(this._options.path) ? url2.format(this._options) : (
        // When making a request to a proxy, […]
        // a client MUST send the target URI in absolute-form […].
        this._options.path
      );
      if (this._isRedirect) {
        var i = 0;
        var self2 = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
          if (request === self2._currentRequest) {
            if (error) {
              self2.emit("error", error);
            } else if (i < buffers.length) {
              var buffer = buffers[i++];
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            } else if (self2._ended) {
              request.end();
            }
          }
        })();
      }
    };
    RedirectableRequest.prototype._processResponse = function(response) {
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode
        });
      }
      var location = response.headers.location;
      if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        this._requestBodyBuffers = [];
        return;
      }
      abortRequest(this._currentRequest);
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new TooManyRedirectsError());
        return;
      }
      var requestHeaders;
      var beforeRedirect = this._options.beforeRedirect;
      if (beforeRedirect) {
        requestHeaders = Object.assign({
          // The Host header was set by nativeProtocol.request
          Host: response.req.getHeader("host")
        }, this._options.headers);
      }
      var method = this._options.method;
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
      var currentUrlParts = url2.parse(this._currentUrl);
      var currentHost = currentHostHeader || currentUrlParts.host;
      var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url2.format(Object.assign(currentUrlParts, { host: currentHost }));
      var redirectUrl;
      try {
        redirectUrl = url2.resolve(currentUrl, location);
      } catch (cause) {
        this.emit("error", new RedirectionError({ cause }));
        return;
      }
      debug("redirecting to", redirectUrl);
      this._isRedirect = true;
      var redirectUrlParts = url2.parse(redirectUrl);
      Object.assign(this._options, redirectUrlParts);
      if (redirectUrlParts.protocol !== currentUrlParts.protocol && redirectUrlParts.protocol !== "https:" || redirectUrlParts.host !== currentHost && !isSubdomain(redirectUrlParts.host, currentHost)) {
        removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
      }
      if (isFunction2(beforeRedirect)) {
        var responseDetails = {
          headers: response.headers,
          statusCode
        };
        var requestDetails = {
          url: currentUrl,
          method,
          headers: requestHeaders
        };
        try {
          beforeRedirect(this._options, responseDetails, requestDetails);
        } catch (err) {
          this.emit("error", err);
          return;
        }
        this._sanitizeOptions(this._options);
      }
      try {
        this._performRequest();
      } catch (cause) {
        this.emit("error", new RedirectionError({ cause }));
      }
    };
    function wrap(protocols) {
      var exports2 = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
      };
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports2[scheme] = Object.create(nativeProtocol);
        function request(input, options, callback) {
          if (isString2(input)) {
            var parsed;
            try {
              parsed = urlToOptions(new URL2(input));
            } catch (err) {
              parsed = url2.parse(input);
            }
            if (!isString2(parsed.protocol)) {
              throw new InvalidUrlError({ input });
            }
            input = parsed;
          } else if (URL2 && input instanceof URL2) {
            input = urlToOptions(input);
          } else {
            callback = options;
            options = input;
            input = { protocol };
          }
          if (isFunction2(options)) {
            callback = options;
            options = null;
          }
          options = Object.assign({
            maxRedirects: exports2.maxRedirects,
            maxBodyLength: exports2.maxBodyLength
          }, input, options);
          options.nativeProtocols = nativeProtocols;
          if (!isString2(options.host) && !isString2(options.hostname)) {
            options.hostname = "::1";
          }
          assert.equal(options.protocol, protocol, "protocol mismatch");
          debug("options", options);
          return new RedirectableRequest(options, callback);
        }
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(input, options, callback);
          wrappedRequest.end();
          return wrappedRequest;
        }
        Object.defineProperties(wrappedProtocol, {
          request: { value: request, configurable: true, enumerable: true, writable: true },
          get: { value: get, configurable: true, enumerable: true, writable: true }
        });
      });
      return exports2;
    }
    function noop2() {
    }
    function urlToOptions(urlObject) {
      var options = {
        protocol: urlObject.protocol,
        hostname: urlObject.hostname.startsWith("[") ? (
          /* istanbul ignore next */
          urlObject.hostname.slice(1, -1)
        ) : urlObject.hostname,
        hash: urlObject.hash,
        search: urlObject.search,
        pathname: urlObject.pathname,
        path: urlObject.pathname + urlObject.search,
        href: urlObject.href
      };
      if (urlObject.port !== "") {
        options.port = Number(urlObject.port);
      }
      return options;
    }
    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
    }
    function createErrorType(code, message, baseClass) {
      function CustomError(properties) {
        Error.captureStackTrace(this, this.constructor);
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause ? message + ": " + this.cause.message : message;
      }
      CustomError.prototype = new (baseClass || Error)();
      CustomError.prototype.constructor = CustomError;
      CustomError.prototype.name = "Error [" + code + "]";
      return CustomError;
    }
    function abortRequest(request) {
      for (var event of events) {
        request.removeListener(event, eventHandlers[event]);
      }
      request.on("error", noop2);
      request.abort();
    }
    function isSubdomain(subdomain, domain) {
      assert(isString2(subdomain) && isString2(domain));
      var dot = subdomain.length - domain.length - 1;
      return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
    }
    function isString2(value) {
      return typeof value === "string" || value instanceof String;
    }
    function isFunction2(value) {
      return typeof value === "function";
    }
    function isBuffer2(value) {
      return typeof value === "object" && "length" in value;
    }
    module.exports = wrap({ http: http2, https: https2 });
    module.exports.wrap = wrap;
  }
});
var require_high_level_opt = __commonJS({
  "node_modules/tar/lib/high-level-opt.js"(exports, module) {
    "use strict";
    var argmap = /* @__PURE__ */ new Map([
      ["C", "cwd"],
      ["f", "file"],
      ["z", "gzip"],
      ["P", "preservePaths"],
      ["U", "unlink"],
      ["strip-components", "strip"],
      ["stripComponents", "strip"],
      ["keep-newer", "newer"],
      ["keepNewer", "newer"],
      ["keep-newer-files", "newer"],
      ["keepNewerFiles", "newer"],
      ["k", "keep"],
      ["keep-existing", "keep"],
      ["keepExisting", "keep"],
      ["m", "noMtime"],
      ["no-mtime", "noMtime"],
      ["p", "preserveOwner"],
      ["L", "follow"],
      ["h", "follow"]
    ]);
    var parse = module.exports = (opt) => opt ? Object.keys(opt).map((k) => [
      argmap.has(k) ? argmap.get(k) : k,
      opt[k]
    ]).reduce((set, kv) => (set[kv[0]] = kv[1], set), /* @__PURE__ */ Object.create(null)) : {};
  }
});
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = __require2("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill4, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill4 !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill4, encoding);
        } else {
          buf.fill(fill4);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});
var require_buffer = __commonJS({
  "node_modules/tar/lib/buffer.js"(exports, module) {
    "use strict";
    var B = Buffer;
    if (!B.alloc) {
      B = require_safe_buffer().Buffer;
    }
    module.exports = B;
  }
});
var require_iterator = __commonJS({
  "node_modules/yallist/iterator.js"(exports, module) {
    "use strict";
    module.exports = function(Yallist) {
      Yallist.prototype[Symbol.iterator] = function* () {
        for (let walker = this.head; walker; walker = walker.next) {
          yield walker.value;
        }
      };
    };
  }
});
var require_yallist = __commonJS({
  "node_modules/yallist/yallist.js"(exports, module) {
    "use strict";
    module.exports = Yallist;
    Yallist.Node = Node;
    Yallist.create = Yallist;
    function Yallist(list) {
      var self2 = this;
      if (!(self2 instanceof Yallist)) {
        self2 = new Yallist();
      }
      self2.tail = null;
      self2.head = null;
      self2.length = 0;
      if (list && typeof list.forEach === "function") {
        list.forEach(function(item) {
          self2.push(item);
        });
      } else if (arguments.length > 0) {
        for (var i = 0, l = arguments.length; i < l; i++) {
          self2.push(arguments[i]);
        }
      }
      return self2;
    }
    Yallist.prototype.removeNode = function(node) {
      if (node.list !== this) {
        throw new Error("removing node which does not belong to this list");
      }
      var next = node.next;
      var prev = node.prev;
      if (next) {
        next.prev = prev;
      }
      if (prev) {
        prev.next = next;
      }
      if (node === this.head) {
        this.head = next;
      }
      if (node === this.tail) {
        this.tail = prev;
      }
      node.list.length--;
      node.next = null;
      node.prev = null;
      node.list = null;
      return next;
    };
    Yallist.prototype.unshiftNode = function(node) {
      if (node === this.head) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var head = this.head;
      node.list = this;
      node.next = head;
      if (head) {
        head.prev = node;
      }
      this.head = node;
      if (!this.tail) {
        this.tail = node;
      }
      this.length++;
    };
    Yallist.prototype.pushNode = function(node) {
      if (node === this.tail) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var tail = this.tail;
      node.list = this;
      node.prev = tail;
      if (tail) {
        tail.next = node;
      }
      this.tail = node;
      if (!this.head) {
        this.head = node;
      }
      this.length++;
    };
    Yallist.prototype.push = function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        push(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.unshift = function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        unshift(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.pop = function() {
      if (!this.tail) {
        return void 0;
      }
      var res = this.tail.value;
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.shift = function() {
      if (!this.head) {
        return void 0;
      }
      var res = this.head.value;
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.forEach = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.head, i = 0; walker !== null; i++) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
      }
    };
    Yallist.prototype.forEachReverse = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
      }
    };
    Yallist.prototype.get = function(n) {
      for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
        walker = walker.next;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.getReverse = function(n) {
      for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
        walker = walker.prev;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.map = function(fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.head; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
      }
      return res;
    };
    Yallist.prototype.mapReverse = function(fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.tail; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
      }
      return res;
    };
    Yallist.prototype.reduce = function(fn, initial) {
      var acc;
      var walker = this.head;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
      } else {
        throw new TypeError("Reduce of empty list with no initial value");
      }
      for (var i = 0; walker !== null; i++) {
        acc = fn(acc, walker.value, i);
        walker = walker.next;
      }
      return acc;
    };
    Yallist.prototype.reduceReverse = function(fn, initial) {
      var acc;
      var walker = this.tail;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
      } else {
        throw new TypeError("Reduce of empty list with no initial value");
      }
      for (var i = this.length - 1; walker !== null; i--) {
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
      }
      return acc;
    };
    Yallist.prototype.toArray = function() {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.head; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.next;
      }
      return arr;
    };
    Yallist.prototype.toArrayReverse = function() {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.tail; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.prev;
      }
      return arr;
    };
    Yallist.prototype.slice = function(from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
        walker = walker.next;
      }
      for (; walker !== null && i < to; i++, walker = walker.next) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.sliceReverse = function(from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
        walker = walker.prev;
      }
      for (; walker !== null && i > from; i--, walker = walker.prev) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.splice = function(start, deleteCount) {
      if (start > this.length) {
        start = this.length - 1;
      }
      if (start < 0) {
        start = this.length + start;
      }
      for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
        walker = walker.next;
      }
      var ret = [];
      for (var i = 0; walker && i < deleteCount; i++) {
        ret.push(walker.value);
        walker = this.removeNode(walker);
      }
      if (walker === null) {
        walker = this.tail;
      }
      if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
      }
      for (var i = 2; i < arguments.length; i++) {
        walker = insert(this, walker, arguments[i]);
      }
      return ret;
    };
    Yallist.prototype.reverse = function() {
      var head = this.head;
      var tail = this.tail;
      for (var walker = head; walker !== null; walker = walker.prev) {
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
      }
      this.head = tail;
      this.tail = head;
      return this;
    };
    function insert(self2, node, value) {
      var inserted = node === self2.head ? new Node(value, null, node, self2) : new Node(value, node, node.next, self2);
      if (inserted.next === null) {
        self2.tail = inserted;
      }
      if (inserted.prev === null) {
        self2.head = inserted;
      }
      self2.length++;
      return inserted;
    }
    function push(self2, item) {
      self2.tail = new Node(item, self2.tail, null, self2);
      if (!self2.head) {
        self2.head = self2.tail;
      }
      self2.length++;
    }
    function unshift(self2, item) {
      self2.head = new Node(item, null, self2.head, self2);
      if (!self2.tail) {
        self2.tail = self2.head;
      }
      self2.length++;
    }
    function Node(value, prev, next, list) {
      if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
      }
      this.list = list;
      this.value = value;
      if (prev) {
        prev.next = this;
        this.prev = prev;
      } else {
        this.prev = null;
      }
      if (next) {
        next.prev = this;
        this.next = next;
      } else {
        this.next = null;
      }
    }
    try {
      require_iterator()(Yallist);
    } catch (er) {
    }
  }
});
var require_minipass = __commonJS({
  "node_modules/tar/node_modules/minipass/index.js"(exports, module) {
    "use strict";
    var EE = __require2("events");
    var Yallist = require_yallist();
    var SD = __require2("string_decoder").StringDecoder;
    var EOF = Symbol("EOF");
    var MAYBE_EMIT_END = Symbol("maybeEmitEnd");
    var EMITTED_END = Symbol("emittedEnd");
    var EMITTING_END = Symbol("emittingEnd");
    var CLOSED = Symbol("closed");
    var READ = Symbol("read");
    var FLUSH = Symbol("flush");
    var FLUSHCHUNK = Symbol("flushChunk");
    var ENCODING = Symbol("encoding");
    var DECODER = Symbol("decoder");
    var FLOWING = Symbol("flowing");
    var PAUSED = Symbol("paused");
    var RESUME = Symbol("resume");
    var BUFFERLENGTH = Symbol("bufferLength");
    var BUFFERPUSH = Symbol("bufferPush");
    var BUFFERSHIFT = Symbol("bufferShift");
    var OBJECTMODE = Symbol("objectMode");
    var DESTROYED = Symbol("destroyed");
    var doIter = global._MP_NO_ITERATOR_SYMBOLS_ !== "1";
    var ASYNCITERATOR = doIter && Symbol.asyncIterator || Symbol("asyncIterator not implemented");
    var ITERATOR = doIter && Symbol.iterator || Symbol("iterator not implemented");
    var B = Buffer.alloc ? Buffer : (
      /* istanbul ignore next */
      require_safe_buffer().Buffer
    );
    var isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
    var isArrayBuffer2 = (b) => b instanceof ArrayBuffer || typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0;
    var isArrayBufferView2 = (b) => !B.isBuffer(b) && ArrayBuffer.isView(b);
    module.exports = class Minipass extends EE {
      constructor(options) {
        super();
        this[FLOWING] = false;
        this[PAUSED] = false;
        this.pipes = new Yallist();
        this.buffer = new Yallist();
        this[OBJECTMODE] = options && options.objectMode || false;
        if (this[OBJECTMODE])
          this[ENCODING] = null;
        else
          this[ENCODING] = options && options.encoding || null;
        if (this[ENCODING] === "buffer")
          this[ENCODING] = null;
        this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null;
        this[EOF] = false;
        this[EMITTED_END] = false;
        this[EMITTING_END] = false;
        this[CLOSED] = false;
        this.writable = true;
        this.readable = true;
        this[BUFFERLENGTH] = 0;
        this[DESTROYED] = false;
      }
      get bufferLength() {
        return this[BUFFERLENGTH];
      }
      get encoding() {
        return this[ENCODING];
      }
      set encoding(enc) {
        if (this[OBJECTMODE])
          throw new Error("cannot set encoding in objectMode");
        if (this[ENCODING] && enc !== this[ENCODING] && (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
          throw new Error("cannot change encoding");
        if (this[ENCODING] !== enc) {
          this[DECODER] = enc ? new SD(enc) : null;
          if (this.buffer.length)
            this.buffer = this.buffer.map((chunk) => this[DECODER].write(chunk));
        }
        this[ENCODING] = enc;
      }
      setEncoding(enc) {
        this.encoding = enc;
      }
      get objectMode() {
        return this[OBJECTMODE];
      }
      set objectMode(\u0950) {
        this[OBJECTMODE] = this[OBJECTMODE] || !!\u0950;
      }
      write(chunk, encoding, cb) {
        if (this[EOF])
          throw new Error("write after end");
        if (this[DESTROYED]) {
          this.emit("error", Object.assign(
            new Error("Cannot call write after a stream was destroyed"),
            { code: "ERR_STREAM_DESTROYED" }
          ));
          return true;
        }
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (!encoding)
          encoding = "utf8";
        if (!this[OBJECTMODE] && !B.isBuffer(chunk)) {
          if (isArrayBufferView2(chunk))
            chunk = B.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
          else if (isArrayBuffer2(chunk))
            chunk = B.from(chunk);
          else if (typeof chunk !== "string")
            this.objectMode = true;
        }
        if (!this.objectMode && !chunk.length) {
          const ret = this.flowing;
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            cb();
          return ret;
        }
        if (typeof chunk === "string" && !this[OBJECTMODE] && // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER].lastNeed)) {
          chunk = B.from(chunk, encoding);
        }
        if (B.isBuffer(chunk) && this[ENCODING])
          chunk = this[DECODER].write(chunk);
        try {
          return this.flowing ? (this.emit("data", chunk), this.flowing) : (this[BUFFERPUSH](chunk), false);
        } finally {
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            cb();
        }
      }
      read(n) {
        if (this[DESTROYED])
          return null;
        try {
          if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH])
            return null;
          if (this[OBJECTMODE])
            n = null;
          if (this.buffer.length > 1 && !this[OBJECTMODE]) {
            if (this.encoding)
              this.buffer = new Yallist([
                Array.from(this.buffer).join("")
              ]);
            else
              this.buffer = new Yallist([
                B.concat(Array.from(this.buffer), this[BUFFERLENGTH])
              ]);
          }
          return this[READ](n || null, this.buffer.head.value);
        } finally {
          this[MAYBE_EMIT_END]();
        }
      }
      [READ](n, chunk) {
        if (n === chunk.length || n === null)
          this[BUFFERSHIFT]();
        else {
          this.buffer.head.value = chunk.slice(n);
          chunk = chunk.slice(0, n);
          this[BUFFERLENGTH] -= n;
        }
        this.emit("data", chunk);
        if (!this.buffer.length && !this[EOF])
          this.emit("drain");
        return chunk;
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === "function")
          cb = chunk, chunk = null;
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (chunk)
          this.write(chunk, encoding);
        if (cb)
          this.once("end", cb);
        this[EOF] = true;
        this.writable = false;
        if (this.flowing || !this[PAUSED])
          this[MAYBE_EMIT_END]();
        return this;
      }
      // don't let the internal resume be overwritten
      [RESUME]() {
        if (this[DESTROYED])
          return;
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit("resume");
        if (this.buffer.length)
          this[FLUSH]();
        else if (this[EOF])
          this[MAYBE_EMIT_END]();
        else
          this.emit("drain");
      }
      resume() {
        return this[RESUME]();
      }
      pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
      }
      get destroyed() {
        return this[DESTROYED];
      }
      get flowing() {
        return this[FLOWING];
      }
      get paused() {
        return this[PAUSED];
      }
      [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] += 1;
        else
          this[BUFFERLENGTH] += chunk.length;
        return this.buffer.push(chunk);
      }
      [BUFFERSHIFT]() {
        if (this.buffer.length) {
          if (this[OBJECTMODE])
            this[BUFFERLENGTH] -= 1;
          else
            this[BUFFERLENGTH] -= this.buffer.head.value.length;
        }
        return this.buffer.shift();
      }
      [FLUSH]() {
        do {
        } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()));
        if (!this.buffer.length && !this[EOF])
          this.emit("drain");
      }
      [FLUSHCHUNK](chunk) {
        return chunk ? (this.emit("data", chunk), this.flowing) : false;
      }
      pipe(dest, opts) {
        if (this[DESTROYED])
          return;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === process.stdout || dest === process.stderr)
          opts.end = false;
        else
          opts.end = opts.end !== false;
        const p = { dest, opts, ondrain: (_) => this[RESUME]() };
        this.pipes.push(p);
        dest.on("drain", p.ondrain);
        this[RESUME]();
        if (ended && p.opts.end)
          p.dest.end();
        return dest;
      }
      addListener(ev, fn) {
        return this.on(ev, fn);
      }
      on(ev, fn) {
        try {
          return super.on(ev, fn);
        } finally {
          if (ev === "data" && !this.pipes.length && !this.flowing)
            this[RESUME]();
          else if (isEndish(ev) && this[EMITTED_END]) {
            super.emit(ev);
            this.removeAllListeners(ev);
          }
        }
      }
      get emittedEnd() {
        return this[EMITTED_END];
      }
      [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this.buffer.length === 0 && this[EOF]) {
          this[EMITTING_END] = true;
          this.emit("end");
          this.emit("prefinish");
          this.emit("finish");
          if (this[CLOSED])
            this.emit("close");
          this[EMITTING_END] = false;
        }
      }
      emit(ev, data) {
        if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED])
          return;
        else if (ev === "data") {
          if (!data)
            return;
          if (this.pipes.length)
            this.pipes.forEach((p) => p.dest.write(data) === false && this.pause());
        } else if (ev === "end") {
          if (this[EMITTED_END] === true)
            return;
          this[EMITTED_END] = true;
          this.readable = false;
          if (this[DECODER]) {
            data = this[DECODER].end();
            if (data) {
              this.pipes.forEach((p) => p.dest.write(data));
              super.emit("data", data);
            }
          }
          this.pipes.forEach((p) => {
            p.dest.removeListener("drain", p.ondrain);
            if (p.opts.end)
              p.dest.end();
          });
        } else if (ev === "close") {
          this[CLOSED] = true;
          if (!this[EMITTED_END] && !this[DESTROYED])
            return;
        }
        const args = new Array(arguments.length);
        args[0] = ev;
        args[1] = data;
        if (arguments.length > 2) {
          for (let i = 2; i < arguments.length; i++) {
            args[i] = arguments[i];
          }
        }
        try {
          return super.emit.apply(this, args);
        } finally {
          if (!isEndish(ev))
            this[MAYBE_EMIT_END]();
          else
            this.removeAllListeners(ev);
        }
      }
      // const all = await stream.collect()
      collect() {
        const buf = [];
        buf.dataLength = 0;
        this.on("data", (c) => {
          buf.push(c);
          buf.dataLength += c.length;
        });
        return this.promise().then(() => buf);
      }
      // const data = await stream.concat()
      concat() {
        return this[OBJECTMODE] ? Promise.reject(new Error("cannot concat in objectMode")) : this.collect().then((buf) => this[OBJECTMODE] ? Promise.reject(new Error("cannot concat in objectMode")) : this[ENCODING] ? buf.join("") : B.concat(buf, buf.dataLength));
      }
      // stream.promise().then(() => done, er => emitted error)
      promise() {
        return new Promise((resolve, reject) => {
          this.on(DESTROYED, () => reject(new Error("stream destroyed")));
          this.on("end", () => resolve());
          this.on("error", (er) => reject(er));
        });
      }
      // for await (let chunk of stream)
      [ASYNCITERATOR]() {
        const next = () => {
          const res = this.read();
          if (res !== null)
            return Promise.resolve({ done: false, value: res });
          if (this[EOF])
            return Promise.resolve({ done: true });
          let resolve = null;
          let reject = null;
          const onerr = (er) => {
            this.removeListener("data", ondata);
            this.removeListener("end", onend);
            reject(er);
          };
          const ondata = (value) => {
            this.removeListener("error", onerr);
            this.removeListener("end", onend);
            this.pause();
            resolve({ value, done: !!this[EOF] });
          };
          const onend = () => {
            this.removeListener("error", onerr);
            this.removeListener("data", ondata);
            resolve({ done: true });
          };
          const ondestroy = () => onerr(new Error("stream destroyed"));
          return new Promise((res2, rej) => {
            reject = rej;
            resolve = res2;
            this.once(DESTROYED, ondestroy);
            this.once("error", onerr);
            this.once("end", onend);
            this.once("data", ondata);
          });
        };
        return { next };
      }
      // for (let chunk of stream)
      [ITERATOR]() {
        const next = () => {
          const value = this.read();
          const done = value === null;
          return { value, done };
        };
        return { next };
      }
      destroy(er) {
        if (this[DESTROYED]) {
          if (er)
            this.emit("error", er);
          else
            this.emit(DESTROYED);
          return this;
        }
        this[DESTROYED] = true;
        this.buffer = new Yallist();
        this[BUFFERLENGTH] = 0;
        if (typeof this.close === "function" && !this[CLOSED])
          this.close();
        if (er)
          this.emit("error", er);
        else
          this.emit(DESTROYED);
        return this;
      }
      static isStream(s) {
        return !!s && (s instanceof Minipass || s instanceof EE && (typeof s.pipe === "function" || // readable
        typeof s.write === "function" && typeof s.end === "function"));
      }
    };
  }
});
var require_constants = __commonJS({
  "node_modules/minizlib/constants.js"(exports, module) {
    var realZlibConstants = __require2("zlib").constants || /* istanbul ignore next */
    { ZLIB_VERNUM: 4736 };
    module.exports = Object.freeze(Object.assign(/* @__PURE__ */ Object.create(null), {
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_MEM_ERROR: -4,
      Z_BUF_ERROR: -5,
      Z_VERSION_ERROR: -6,
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      DEFLATE: 1,
      INFLATE: 2,
      GZIP: 3,
      GUNZIP: 4,
      DEFLATERAW: 5,
      INFLATERAW: 6,
      UNZIP: 7,
      BROTLI_DECODE: 8,
      BROTLI_ENCODE: 9,
      Z_MIN_WINDOWBITS: 8,
      Z_MAX_WINDOWBITS: 15,
      Z_DEFAULT_WINDOWBITS: 15,
      Z_MIN_CHUNK: 64,
      Z_MAX_CHUNK: Infinity,
      Z_DEFAULT_CHUNK: 16384,
      Z_MIN_MEMLEVEL: 1,
      Z_MAX_MEMLEVEL: 9,
      Z_DEFAULT_MEMLEVEL: 8,
      Z_MIN_LEVEL: -1,
      Z_MAX_LEVEL: 9,
      Z_DEFAULT_LEVEL: -1,
      BROTLI_OPERATION_PROCESS: 0,
      BROTLI_OPERATION_FLUSH: 1,
      BROTLI_OPERATION_FINISH: 2,
      BROTLI_OPERATION_EMIT_METADATA: 3,
      BROTLI_MODE_GENERIC: 0,
      BROTLI_MODE_TEXT: 1,
      BROTLI_MODE_FONT: 2,
      BROTLI_DEFAULT_MODE: 0,
      BROTLI_MIN_QUALITY: 0,
      BROTLI_MAX_QUALITY: 11,
      BROTLI_DEFAULT_QUALITY: 11,
      BROTLI_MIN_WINDOW_BITS: 10,
      BROTLI_MAX_WINDOW_BITS: 24,
      BROTLI_LARGE_MAX_WINDOW_BITS: 30,
      BROTLI_DEFAULT_WINDOW: 22,
      BROTLI_MIN_INPUT_BLOCK_BITS: 16,
      BROTLI_MAX_INPUT_BLOCK_BITS: 24,
      BROTLI_PARAM_MODE: 0,
      BROTLI_PARAM_QUALITY: 1,
      BROTLI_PARAM_LGWIN: 2,
      BROTLI_PARAM_LGBLOCK: 3,
      BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
      BROTLI_PARAM_SIZE_HINT: 5,
      BROTLI_PARAM_LARGE_WINDOW: 6,
      BROTLI_PARAM_NPOSTFIX: 7,
      BROTLI_PARAM_NDIRECT: 8,
      BROTLI_DECODER_RESULT_ERROR: 0,
      BROTLI_DECODER_RESULT_SUCCESS: 1,
      BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
      BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
      BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
      BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
      BROTLI_DECODER_NO_ERROR: 0,
      BROTLI_DECODER_SUCCESS: 1,
      BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
      BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
      BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
      BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
      BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
      BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
      BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
      BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
      BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
      BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
      BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
      BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
      BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
      BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
      BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
      BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
      BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
      BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
      BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
      BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
      BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
      BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
      BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
      BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
      BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
      BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
      BROTLI_DECODER_ERROR_UNREACHABLE: -31
    }, realZlibConstants));
  }
});
var require_minipass2 = __commonJS({
  "node_modules/minizlib/node_modules/minipass/index.js"(exports, module) {
    "use strict";
    var EE = __require2("events");
    var Yallist = require_yallist();
    var SD = __require2("string_decoder").StringDecoder;
    var EOF = Symbol("EOF");
    var MAYBE_EMIT_END = Symbol("maybeEmitEnd");
    var EMITTED_END = Symbol("emittedEnd");
    var EMITTING_END = Symbol("emittingEnd");
    var CLOSED = Symbol("closed");
    var READ = Symbol("read");
    var FLUSH = Symbol("flush");
    var FLUSHCHUNK = Symbol("flushChunk");
    var ENCODING = Symbol("encoding");
    var DECODER = Symbol("decoder");
    var FLOWING = Symbol("flowing");
    var PAUSED = Symbol("paused");
    var RESUME = Symbol("resume");
    var BUFFERLENGTH = Symbol("bufferLength");
    var BUFFERPUSH = Symbol("bufferPush");
    var BUFFERSHIFT = Symbol("bufferShift");
    var OBJECTMODE = Symbol("objectMode");
    var DESTROYED = Symbol("destroyed");
    var doIter = global._MP_NO_ITERATOR_SYMBOLS_ !== "1";
    var ASYNCITERATOR = doIter && Symbol.asyncIterator || Symbol("asyncIterator not implemented");
    var ITERATOR = doIter && Symbol.iterator || Symbol("iterator not implemented");
    var B = Buffer.alloc ? Buffer : (
      /* istanbul ignore next */
      require_safe_buffer().Buffer
    );
    var isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
    var isArrayBuffer2 = (b) => b instanceof ArrayBuffer || typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0;
    var isArrayBufferView2 = (b) => !B.isBuffer(b) && ArrayBuffer.isView(b);
    module.exports = class Minipass extends EE {
      constructor(options) {
        super();
        this[FLOWING] = false;
        this[PAUSED] = false;
        this.pipes = new Yallist();
        this.buffer = new Yallist();
        this[OBJECTMODE] = options && options.objectMode || false;
        if (this[OBJECTMODE])
          this[ENCODING] = null;
        else
          this[ENCODING] = options && options.encoding || null;
        if (this[ENCODING] === "buffer")
          this[ENCODING] = null;
        this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null;
        this[EOF] = false;
        this[EMITTED_END] = false;
        this[EMITTING_END] = false;
        this[CLOSED] = false;
        this.writable = true;
        this.readable = true;
        this[BUFFERLENGTH] = 0;
        this[DESTROYED] = false;
      }
      get bufferLength() {
        return this[BUFFERLENGTH];
      }
      get encoding() {
        return this[ENCODING];
      }
      set encoding(enc) {
        if (this[OBJECTMODE])
          throw new Error("cannot set encoding in objectMode");
        if (this[ENCODING] && enc !== this[ENCODING] && (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
          throw new Error("cannot change encoding");
        if (this[ENCODING] !== enc) {
          this[DECODER] = enc ? new SD(enc) : null;
          if (this.buffer.length)
            this.buffer = this.buffer.map((chunk) => this[DECODER].write(chunk));
        }
        this[ENCODING] = enc;
      }
      setEncoding(enc) {
        this.encoding = enc;
      }
      get objectMode() {
        return this[OBJECTMODE];
      }
      set objectMode(\u0950) {
        this[OBJECTMODE] = this[OBJECTMODE] || !!\u0950;
      }
      write(chunk, encoding, cb) {
        if (this[EOF])
          throw new Error("write after end");
        if (this[DESTROYED]) {
          this.emit("error", Object.assign(
            new Error("Cannot call write after a stream was destroyed"),
            { code: "ERR_STREAM_DESTROYED" }
          ));
          return true;
        }
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (!encoding)
          encoding = "utf8";
        if (!this[OBJECTMODE] && !B.isBuffer(chunk)) {
          if (isArrayBufferView2(chunk))
            chunk = B.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
          else if (isArrayBuffer2(chunk))
            chunk = B.from(chunk);
          else if (typeof chunk !== "string")
            this.objectMode = true;
        }
        if (!this.objectMode && !chunk.length) {
          const ret = this.flowing;
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            cb();
          return ret;
        }
        if (typeof chunk === "string" && !this[OBJECTMODE] && // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER].lastNeed)) {
          chunk = B.from(chunk, encoding);
        }
        if (B.isBuffer(chunk) && this[ENCODING])
          chunk = this[DECODER].write(chunk);
        try {
          return this.flowing ? (this.emit("data", chunk), this.flowing) : (this[BUFFERPUSH](chunk), false);
        } finally {
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            cb();
        }
      }
      read(n) {
        if (this[DESTROYED])
          return null;
        try {
          if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH])
            return null;
          if (this[OBJECTMODE])
            n = null;
          if (this.buffer.length > 1 && !this[OBJECTMODE]) {
            if (this.encoding)
              this.buffer = new Yallist([
                Array.from(this.buffer).join("")
              ]);
            else
              this.buffer = new Yallist([
                B.concat(Array.from(this.buffer), this[BUFFERLENGTH])
              ]);
          }
          return this[READ](n || null, this.buffer.head.value);
        } finally {
          this[MAYBE_EMIT_END]();
        }
      }
      [READ](n, chunk) {
        if (n === chunk.length || n === null)
          this[BUFFERSHIFT]();
        else {
          this.buffer.head.value = chunk.slice(n);
          chunk = chunk.slice(0, n);
          this[BUFFERLENGTH] -= n;
        }
        this.emit("data", chunk);
        if (!this.buffer.length && !this[EOF])
          this.emit("drain");
        return chunk;
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === "function")
          cb = chunk, chunk = null;
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (chunk)
          this.write(chunk, encoding);
        if (cb)
          this.once("end", cb);
        this[EOF] = true;
        this.writable = false;
        if (this.flowing || !this[PAUSED])
          this[MAYBE_EMIT_END]();
        return this;
      }
      // don't let the internal resume be overwritten
      [RESUME]() {
        if (this[DESTROYED])
          return;
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit("resume");
        if (this.buffer.length)
          this[FLUSH]();
        else if (this[EOF])
          this[MAYBE_EMIT_END]();
        else
          this.emit("drain");
      }
      resume() {
        return this[RESUME]();
      }
      pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
      }
      get destroyed() {
        return this[DESTROYED];
      }
      get flowing() {
        return this[FLOWING];
      }
      get paused() {
        return this[PAUSED];
      }
      [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] += 1;
        else
          this[BUFFERLENGTH] += chunk.length;
        return this.buffer.push(chunk);
      }
      [BUFFERSHIFT]() {
        if (this.buffer.length) {
          if (this[OBJECTMODE])
            this[BUFFERLENGTH] -= 1;
          else
            this[BUFFERLENGTH] -= this.buffer.head.value.length;
        }
        return this.buffer.shift();
      }
      [FLUSH]() {
        do {
        } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()));
        if (!this.buffer.length && !this[EOF])
          this.emit("drain");
      }
      [FLUSHCHUNK](chunk) {
        return chunk ? (this.emit("data", chunk), this.flowing) : false;
      }
      pipe(dest, opts) {
        if (this[DESTROYED])
          return;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === process.stdout || dest === process.stderr)
          opts.end = false;
        else
          opts.end = opts.end !== false;
        const p = { dest, opts, ondrain: (_) => this[RESUME]() };
        this.pipes.push(p);
        dest.on("drain", p.ondrain);
        this[RESUME]();
        if (ended && p.opts.end)
          p.dest.end();
        return dest;
      }
      addListener(ev, fn) {
        return this.on(ev, fn);
      }
      on(ev, fn) {
        try {
          return super.on(ev, fn);
        } finally {
          if (ev === "data" && !this.pipes.length && !this.flowing)
            this[RESUME]();
          else if (isEndish(ev) && this[EMITTED_END]) {
            super.emit(ev);
            this.removeAllListeners(ev);
          }
        }
      }
      get emittedEnd() {
        return this[EMITTED_END];
      }
      [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this.buffer.length === 0 && this[EOF]) {
          this[EMITTING_END] = true;
          this.emit("end");
          this.emit("prefinish");
          this.emit("finish");
          if (this[CLOSED])
            this.emit("close");
          this[EMITTING_END] = false;
        }
      }
      emit(ev, data) {
        if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED])
          return;
        else if (ev === "data") {
          if (!data)
            return;
          if (this.pipes.length)
            this.pipes.forEach((p) => p.dest.write(data) === false && this.pause());
        } else if (ev === "end") {
          if (this[EMITTED_END] === true)
            return;
          this[EMITTED_END] = true;
          this.readable = false;
          if (this[DECODER]) {
            data = this[DECODER].end();
            if (data) {
              this.pipes.forEach((p) => p.dest.write(data));
              super.emit("data", data);
            }
          }
          this.pipes.forEach((p) => {
            p.dest.removeListener("drain", p.ondrain);
            if (p.opts.end)
              p.dest.end();
          });
        } else if (ev === "close") {
          this[CLOSED] = true;
          if (!this[EMITTED_END] && !this[DESTROYED])
            return;
        }
        const args = new Array(arguments.length);
        args[0] = ev;
        args[1] = data;
        if (arguments.length > 2) {
          for (let i = 2; i < arguments.length; i++) {
            args[i] = arguments[i];
          }
        }
        try {
          return super.emit.apply(this, args);
        } finally {
          if (!isEndish(ev))
            this[MAYBE_EMIT_END]();
          else
            this.removeAllListeners(ev);
        }
      }
      // const all = await stream.collect()
      collect() {
        const buf = [];
        buf.dataLength = 0;
        this.on("data", (c) => {
          buf.push(c);
          buf.dataLength += c.length;
        });
        return this.promise().then(() => buf);
      }
      // const data = await stream.concat()
      concat() {
        return this[OBJECTMODE] ? Promise.reject(new Error("cannot concat in objectMode")) : this.collect().then((buf) => this[OBJECTMODE] ? Promise.reject(new Error("cannot concat in objectMode")) : this[ENCODING] ? buf.join("") : B.concat(buf, buf.dataLength));
      }
      // stream.promise().then(() => done, er => emitted error)
      promise() {
        return new Promise((resolve, reject) => {
          this.on(DESTROYED, () => reject(new Error("stream destroyed")));
          this.on("end", () => resolve());
          this.on("error", (er) => reject(er));
        });
      }
      // for await (let chunk of stream)
      [ASYNCITERATOR]() {
        const next = () => {
          const res = this.read();
          if (res !== null)
            return Promise.resolve({ done: false, value: res });
          if (this[EOF])
            return Promise.resolve({ done: true });
          let resolve = null;
          let reject = null;
          const onerr = (er) => {
            this.removeListener("data", ondata);
            this.removeListener("end", onend);
            reject(er);
          };
          const ondata = (value) => {
            this.removeListener("error", onerr);
            this.removeListener("end", onend);
            this.pause();
            resolve({ value, done: !!this[EOF] });
          };
          const onend = () => {
            this.removeListener("error", onerr);
            this.removeListener("data", ondata);
            resolve({ done: true });
          };
          const ondestroy = () => onerr(new Error("stream destroyed"));
          return new Promise((res2, rej) => {
            reject = rej;
            resolve = res2;
            this.once(DESTROYED, ondestroy);
            this.once("error", onerr);
            this.once("end", onend);
            this.once("data", ondata);
          });
        };
        return { next };
      }
      // for (let chunk of stream)
      [ITERATOR]() {
        const next = () => {
          const value = this.read();
          const done = value === null;
          return { value, done };
        };
        return { next };
      }
      destroy(er) {
        if (this[DESTROYED]) {
          if (er)
            this.emit("error", er);
          else
            this.emit(DESTROYED);
          return this;
        }
        this[DESTROYED] = true;
        this.buffer = new Yallist();
        this[BUFFERLENGTH] = 0;
        if (typeof this.close === "function" && !this[CLOSED])
          this.close();
        if (er)
          this.emit("error", er);
        else
          this.emit(DESTROYED);
        return this;
      }
      static isStream(s) {
        return !!s && (s instanceof Minipass || s instanceof EE && (typeof s.pipe === "function" || // readable
        typeof s.write === "function" && typeof s.end === "function"));
      }
    };
  }
});
var require_minizlib = __commonJS({
  "node_modules/minizlib/index.js"(exports) {
    "use strict";
    var assert = __require2("assert");
    var Buffer2 = __require2("buffer").Buffer;
    var realZlib = __require2("zlib");
    var constants = exports.constants = require_constants();
    var Minipass = require_minipass2();
    var OriginalBufferConcat = Buffer2.concat;
    var ZlibError = class extends Error {
      constructor(err) {
        super("zlib: " + err.message);
        this.code = err.code;
        this.errno = err.errno;
        if (!this.code)
          this.code = "ZLIB_ERROR";
        this.message = "zlib: " + err.message;
        Error.captureStackTrace(this, this.constructor);
      }
      get name() {
        return "ZlibError";
      }
    };
    var _opts = Symbol("opts");
    var _flushFlag = Symbol("flushFlag");
    var _finishFlushFlag = Symbol("finishFlushFlag");
    var _fullFlushFlag = Symbol("fullFlushFlag");
    var _handle = Symbol("handle");
    var _onError = Symbol("onError");
    var _sawError = Symbol("sawError");
    var _level = Symbol("level");
    var _strategy = Symbol("strategy");
    var _ended = Symbol("ended");
    var _defaultFullFlush = Symbol("_defaultFullFlush");
    var ZlibBase = class extends Minipass {
      constructor(opts, mode) {
        if (!opts || typeof opts !== "object")
          throw new TypeError("invalid options for ZlibBase constructor");
        super(opts);
        this[_ended] = false;
        this[_opts] = opts;
        this[_flushFlag] = opts.flush;
        this[_finishFlushFlag] = opts.finishFlush;
        try {
          this[_handle] = new realZlib[mode](opts);
        } catch (er) {
          throw new ZlibError(er);
        }
        this[_onError] = (err) => {
          this[_sawError] = true;
          this.close();
          this.emit("error", err);
        };
        this[_handle].on("error", (er) => this[_onError](new ZlibError(er)));
        this.once("end", () => this.close);
      }
      close() {
        if (this[_handle]) {
          this[_handle].close();
          this[_handle] = null;
          this.emit("close");
        }
      }
      reset() {
        if (!this[_sawError]) {
          assert(this[_handle], "zlib binding closed");
          return this[_handle].reset();
        }
      }
      flush(flushFlag) {
        if (this.ended)
          return;
        if (typeof flushFlag !== "number")
          flushFlag = this[_fullFlushFlag];
        this.write(Object.assign(Buffer2.alloc(0), { [_flushFlag]: flushFlag }));
      }
      end(chunk, encoding, cb) {
        if (chunk)
          this.write(chunk, encoding);
        this.flush(this[_finishFlushFlag]);
        this[_ended] = true;
        return super.end(null, null, cb);
      }
      get ended() {
        return this[_ended];
      }
      write(chunk, encoding, cb) {
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (typeof chunk === "string")
          chunk = Buffer2.from(chunk, encoding);
        if (this[_sawError])
          return;
        assert(this[_handle], "zlib binding closed");
        const nativeHandle = this[_handle]._handle;
        const originalNativeClose = nativeHandle.close;
        nativeHandle.close = () => {
        };
        const originalClose = this[_handle].close;
        this[_handle].close = () => {
        };
        Buffer2.concat = (args) => args;
        let result;
        try {
          const flushFlag = typeof chunk[_flushFlag] === "number" ? chunk[_flushFlag] : this[_flushFlag];
          result = this[_handle]._processChunk(chunk, flushFlag);
          Buffer2.concat = OriginalBufferConcat;
        } catch (err) {
          Buffer2.concat = OriginalBufferConcat;
          this[_onError](new ZlibError(err));
        } finally {
          if (this[_handle]) {
            this[_handle]._handle = nativeHandle;
            nativeHandle.close = originalNativeClose;
            this[_handle].close = originalClose;
            this[_handle].removeAllListeners("error");
          }
        }
        let writeReturn;
        if (result) {
          if (Array.isArray(result) && result.length > 0) {
            writeReturn = super.write(Buffer2.from(result[0]));
            for (let i = 1; i < result.length; i++) {
              writeReturn = super.write(result[i]);
            }
          } else {
            writeReturn = super.write(Buffer2.from(result));
          }
        }
        if (cb)
          cb();
        return writeReturn;
      }
    };
    var Zlib = class extends ZlibBase {
      constructor(opts, mode) {
        opts = opts || {};
        opts.flush = opts.flush || constants.Z_NO_FLUSH;
        opts.finishFlush = opts.finishFlush || constants.Z_FINISH;
        super(opts, mode);
        this[_fullFlushFlag] = constants.Z_FULL_FLUSH;
        this[_level] = opts.level;
        this[_strategy] = opts.strategy;
      }
      params(level, strategy) {
        if (this[_sawError])
          return;
        if (!this[_handle])
          throw new Error("cannot switch params when binding is closed");
        if (!this[_handle].params)
          throw new Error("not supported in this implementation");
        if (this[_level] !== level || this[_strategy] !== strategy) {
          this.flush(constants.Z_SYNC_FLUSH);
          assert(this[_handle], "zlib binding closed");
          const origFlush = this[_handle].flush;
          this[_handle].flush = (flushFlag, cb) => {
            this.flush(flushFlag);
            cb();
          };
          try {
            this[_handle].params(level, strategy);
          } finally {
            this[_handle].flush = origFlush;
          }
          if (this[_handle]) {
            this[_level] = level;
            this[_strategy] = strategy;
          }
        }
      }
    };
    var Deflate = class extends Zlib {
      constructor(opts) {
        super(opts, "Deflate");
      }
    };
    var Inflate = class extends Zlib {
      constructor(opts) {
        super(opts, "Inflate");
      }
    };
    var Gzip = class extends Zlib {
      constructor(opts) {
        super(opts, "Gzip");
      }
    };
    var Gunzip = class extends Zlib {
      constructor(opts) {
        super(opts, "Gunzip");
      }
    };
    var DeflateRaw = class extends Zlib {
      constructor(opts) {
        super(opts, "DeflateRaw");
      }
    };
    var InflateRaw = class extends Zlib {
      constructor(opts) {
        super(opts, "InflateRaw");
      }
    };
    var Unzip = class extends Zlib {
      constructor(opts) {
        super(opts, "Unzip");
      }
    };
    var Brotli = class extends ZlibBase {
      constructor(opts, mode) {
        opts = opts || {};
        opts.flush = opts.flush || constants.BROTLI_OPERATION_PROCESS;
        opts.finishFlush = opts.finishFlush || constants.BROTLI_OPERATION_FINISH;
        super(opts, mode);
        this[_fullFlushFlag] = constants.BROTLI_OPERATION_FLUSH;
      }
    };
    var BrotliCompress = class extends Brotli {
      constructor(opts) {
        super(opts, "BrotliCompress");
      }
    };
    var BrotliDecompress = class extends Brotli {
      constructor(opts) {
        super(opts, "BrotliDecompress");
      }
    };
    exports.Deflate = Deflate;
    exports.Inflate = Inflate;
    exports.Gzip = Gzip;
    exports.Gunzip = Gunzip;
    exports.DeflateRaw = DeflateRaw;
    exports.InflateRaw = InflateRaw;
    exports.Unzip = Unzip;
    if (typeof realZlib.BrotliCompress === "function") {
      exports.BrotliCompress = BrotliCompress;
      exports.BrotliDecompress = BrotliDecompress;
    } else {
      exports.BrotliCompress = exports.BrotliDecompress = class {
        constructor() {
          throw new Error("Brotli is not supported in this version of Node.js");
        }
      };
    }
  }
});
var require_types = __commonJS({
  "node_modules/tar/lib/types.js"(exports) {
    "use strict";
    exports.name = /* @__PURE__ */ new Map([
      ["0", "File"],
      // same as File
      ["", "OldFile"],
      ["1", "Link"],
      ["2", "SymbolicLink"],
      // Devices and FIFOs aren't fully supported
      // they are parsed, but skipped when unpacking
      ["3", "CharacterDevice"],
      ["4", "BlockDevice"],
      ["5", "Directory"],
      ["6", "FIFO"],
      // same as File
      ["7", "ContiguousFile"],
      // pax headers
      ["g", "GlobalExtendedHeader"],
      ["x", "ExtendedHeader"],
      // vendor-specific stuff
      // skip
      ["A", "SolarisACL"],
      // like 5, but with data, which should be skipped
      ["D", "GNUDumpDir"],
      // metadata only, skip
      ["I", "Inode"],
      // data = link path of next file
      ["K", "NextFileHasLongLinkpath"],
      // data = path of next file
      ["L", "NextFileHasLongPath"],
      // skip
      ["M", "ContinuationFile"],
      // like L
      ["N", "OldGnuLongPath"],
      // skip
      ["S", "SparseFile"],
      // skip
      ["V", "TapeVolumeHeader"],
      // like x
      ["X", "OldExtendedHeader"]
    ]);
    exports.code = new Map(Array.from(exports.name).map((kv) => [kv[1], kv[0]]));
  }
});
var require_normalize_windows_path = __commonJS({
  "node_modules/tar/lib/normalize-windows-path.js"(exports, module) {
    var platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
    module.exports = platform !== "win32" ? (p) => p : (p) => p && p.replace(/\\/g, "/");
  }
});
var require_read_entry = __commonJS({
  "node_modules/tar/lib/read-entry.js"(exports, module) {
    "use strict";
    var types = require_types();
    var MiniPass = require_minipass();
    var normPath = require_normalize_windows_path();
    var SLURP = Symbol("slurp");
    module.exports = class ReadEntry extends MiniPass {
      constructor(header, ex, gex) {
        super();
        this.pause();
        this.extended = ex;
        this.globalExtended = gex;
        this.header = header;
        this.startBlockSize = 512 * Math.ceil(header.size / 512);
        this.blockRemain = this.startBlockSize;
        this.remain = header.size;
        this.type = header.type;
        this.meta = false;
        this.ignore = false;
        switch (this.type) {
          case "File":
          case "OldFile":
          case "Link":
          case "SymbolicLink":
          case "CharacterDevice":
          case "BlockDevice":
          case "Directory":
          case "FIFO":
          case "ContiguousFile":
          case "GNUDumpDir":
            break;
          case "NextFileHasLongLinkpath":
          case "NextFileHasLongPath":
          case "OldGnuLongPath":
          case "GlobalExtendedHeader":
          case "ExtendedHeader":
          case "OldExtendedHeader":
            this.meta = true;
            break;
          default:
            this.ignore = true;
        }
        this.path = normPath(header.path);
        this.mode = header.mode;
        if (this.mode)
          this.mode = this.mode & 4095;
        this.uid = header.uid;
        this.gid = header.gid;
        this.uname = header.uname;
        this.gname = header.gname;
        this.size = header.size;
        this.mtime = header.mtime;
        this.atime = header.atime;
        this.ctime = header.ctime;
        this.linkpath = normPath(header.linkpath);
        this.uname = header.uname;
        this.gname = header.gname;
        if (ex)
          this[SLURP](ex);
        if (gex)
          this[SLURP](gex, true);
      }
      write(data) {
        const writeLen = data.length;
        if (writeLen > this.blockRemain)
          throw new Error("writing more to entry than is appropriate");
        const r = this.remain;
        const br = this.blockRemain;
        this.remain = Math.max(0, r - writeLen);
        this.blockRemain = Math.max(0, br - writeLen);
        if (this.ignore)
          return true;
        if (r >= writeLen)
          return super.write(data);
        return super.write(data.slice(0, r));
      }
      [SLURP](ex, global2) {
        for (let k in ex) {
          if (ex[k] !== null && ex[k] !== void 0 && !(global2 && k === "path"))
            this[k] = k === "path" || k === "linkpath" ? normPath(ex[k]) : ex[k];
        }
      }
    };
  }
});
var require_large_numbers = __commonJS({
  "node_modules/tar/lib/large-numbers.js"(exports) {
    "use strict";
    var encode3 = exports.encode = (num, buf) => {
      if (!Number.isSafeInteger(num))
        throw TypeError("cannot encode number outside of javascript safe integer range");
      else if (num < 0)
        encodeNegative(num, buf);
      else
        encodePositive(num, buf);
      return buf;
    };
    var encodePositive = (num, buf) => {
      buf[0] = 128;
      for (var i = buf.length; i > 1; i--) {
        buf[i - 1] = num & 255;
        num = Math.floor(num / 256);
      }
    };
    var encodeNegative = (num, buf) => {
      buf[0] = 255;
      var flipped = false;
      num = num * -1;
      for (var i = buf.length; i > 1; i--) {
        var byte = num & 255;
        num = Math.floor(num / 256);
        if (flipped)
          buf[i - 1] = onesComp(byte);
        else if (byte === 0)
          buf[i - 1] = 0;
        else {
          flipped = true;
          buf[i - 1] = twosComp(byte);
        }
      }
    };
    var parse = exports.parse = (buf) => {
      var post = buf[buf.length - 1];
      var pre = buf[0];
      var value;
      if (pre === 128)
        value = pos(buf.slice(1, buf.length));
      else if (pre === 255)
        value = twos(buf);
      else
        throw TypeError("invalid base256 encoding");
      if (!Number.isSafeInteger(value))
        throw TypeError("parsed number outside of javascript safe integer range");
      return value;
    };
    var twos = (buf) => {
      var len = buf.length;
      var sum = 0;
      var flipped = false;
      for (var i = len - 1; i > -1; i--) {
        var byte = buf[i];
        var f;
        if (flipped)
          f = onesComp(byte);
        else if (byte === 0)
          f = byte;
        else {
          flipped = true;
          f = twosComp(byte);
        }
        if (f !== 0)
          sum -= f * Math.pow(256, len - i - 1);
      }
      return sum;
    };
    var pos = (buf) => {
      var len = buf.length;
      var sum = 0;
      for (var i = len - 1; i > -1; i--) {
        var byte = buf[i];
        if (byte !== 0)
          sum += byte * Math.pow(256, len - i - 1);
      }
      return sum;
    };
    var onesComp = (byte) => (255 ^ byte) & 255;
    var twosComp = (byte) => (255 ^ byte) + 1 & 255;
  }
});
var require_header = __commonJS({
  "node_modules/tar/lib/header.js"(exports, module) {
    "use strict";
    var Buffer2 = require_buffer();
    var types = require_types();
    var pathModule = __require2("path").posix;
    var large = require_large_numbers();
    var SLURP = Symbol("slurp");
    var TYPE = Symbol("type");
    var Header = class {
      constructor(data, off, ex, gex) {
        this.cksumValid = false;
        this.needPax = false;
        this.nullBlock = false;
        this.block = null;
        this.path = null;
        this.mode = null;
        this.uid = null;
        this.gid = null;
        this.size = null;
        this.mtime = null;
        this.cksum = null;
        this[TYPE] = "0";
        this.linkpath = null;
        this.uname = null;
        this.gname = null;
        this.devmaj = 0;
        this.devmin = 0;
        this.atime = null;
        this.ctime = null;
        if (Buffer2.isBuffer(data))
          this.decode(data, off || 0, ex, gex);
        else if (data)
          this.set(data);
      }
      decode(buf, off, ex, gex) {
        if (!off)
          off = 0;
        if (!buf || !(buf.length >= off + 512))
          throw new Error("need 512 bytes for header");
        this.path = decString(buf, off, 100);
        this.mode = decNumber(buf, off + 100, 8);
        this.uid = decNumber(buf, off + 108, 8);
        this.gid = decNumber(buf, off + 116, 8);
        this.size = decNumber(buf, off + 124, 12);
        this.mtime = decDate(buf, off + 136, 12);
        this.cksum = decNumber(buf, off + 148, 12);
        this[SLURP](ex);
        this[SLURP](gex, true);
        this[TYPE] = decString(buf, off + 156, 1);
        if (this[TYPE] === "")
          this[TYPE] = "0";
        if (this[TYPE] === "0" && this.path.substr(-1) === "/")
          this[TYPE] = "5";
        if (this[TYPE] === "5")
          this.size = 0;
        this.linkpath = decString(buf, off + 157, 100);
        if (buf.slice(off + 257, off + 265).toString() === "ustar\x0000") {
          this.uname = decString(buf, off + 265, 32);
          this.gname = decString(buf, off + 297, 32);
          this.devmaj = decNumber(buf, off + 329, 8);
          this.devmin = decNumber(buf, off + 337, 8);
          if (buf[off + 475] !== 0) {
            const prefix = decString(buf, off + 345, 155);
            this.path = prefix + "/" + this.path;
          } else {
            const prefix = decString(buf, off + 345, 130);
            if (prefix)
              this.path = prefix + "/" + this.path;
            this.atime = decDate(buf, off + 476, 12);
            this.ctime = decDate(buf, off + 488, 12);
          }
        }
        let sum = 8 * 32;
        for (let i = off; i < off + 148; i++) {
          sum += buf[i];
        }
        for (let i = off + 156; i < off + 512; i++) {
          sum += buf[i];
        }
        this.cksumValid = sum === this.cksum;
        if (this.cksum === null && sum === 8 * 32)
          this.nullBlock = true;
      }
      [SLURP](ex, global2) {
        for (let k in ex) {
          if (ex[k] !== null && ex[k] !== void 0 && !(global2 && k === "path"))
            this[k] = ex[k];
        }
      }
      encode(buf, off) {
        if (!buf) {
          buf = this.block = Buffer2.alloc(512);
          off = 0;
        }
        if (!off)
          off = 0;
        if (!(buf.length >= off + 512))
          throw new Error("need 512 bytes for header");
        const prefixSize = this.ctime || this.atime ? 130 : 155;
        const split = splitPrefix(this.path || "", prefixSize);
        const path = split[0];
        const prefix = split[1];
        this.needPax = split[2];
        this.needPax = encString(buf, off, 100, path) || this.needPax;
        this.needPax = encNumber(buf, off + 100, 8, this.mode) || this.needPax;
        this.needPax = encNumber(buf, off + 108, 8, this.uid) || this.needPax;
        this.needPax = encNumber(buf, off + 116, 8, this.gid) || this.needPax;
        this.needPax = encNumber(buf, off + 124, 12, this.size) || this.needPax;
        this.needPax = encDate(buf, off + 136, 12, this.mtime) || this.needPax;
        buf[off + 156] = this[TYPE].charCodeAt(0);
        this.needPax = encString(buf, off + 157, 100, this.linkpath) || this.needPax;
        buf.write("ustar\x0000", off + 257, 8);
        this.needPax = encString(buf, off + 265, 32, this.uname) || this.needPax;
        this.needPax = encString(buf, off + 297, 32, this.gname) || this.needPax;
        this.needPax = encNumber(buf, off + 329, 8, this.devmaj) || this.needPax;
        this.needPax = encNumber(buf, off + 337, 8, this.devmin) || this.needPax;
        this.needPax = encString(buf, off + 345, prefixSize, prefix) || this.needPax;
        if (buf[off + 475] !== 0)
          this.needPax = encString(buf, off + 345, 155, prefix) || this.needPax;
        else {
          this.needPax = encString(buf, off + 345, 130, prefix) || this.needPax;
          this.needPax = encDate(buf, off + 476, 12, this.atime) || this.needPax;
          this.needPax = encDate(buf, off + 488, 12, this.ctime) || this.needPax;
        }
        let sum = 8 * 32;
        for (let i = off; i < off + 148; i++) {
          sum += buf[i];
        }
        for (let i = off + 156; i < off + 512; i++) {
          sum += buf[i];
        }
        this.cksum = sum;
        encNumber(buf, off + 148, 8, this.cksum);
        this.cksumValid = true;
        return this.needPax;
      }
      set(data) {
        for (let i in data) {
          if (data[i] !== null && data[i] !== void 0)
            this[i] = data[i];
        }
      }
      get type() {
        return types.name.get(this[TYPE]) || this[TYPE];
      }
      get typeKey() {
        return this[TYPE];
      }
      set type(type) {
        if (types.code.has(type))
          this[TYPE] = types.code.get(type);
        else
          this[TYPE] = type;
      }
    };
    var splitPrefix = (p, prefixSize) => {
      const pathSize = 100;
      let pp = p;
      let prefix = "";
      let ret;
      const root = pathModule.parse(p).root || ".";
      if (Buffer2.byteLength(pp) < pathSize)
        ret = [pp, prefix, false];
      else {
        prefix = pathModule.dirname(pp);
        pp = pathModule.basename(pp);
        do {
          if (Buffer2.byteLength(pp) <= pathSize && Buffer2.byteLength(prefix) <= prefixSize)
            ret = [pp, prefix, false];
          else if (Buffer2.byteLength(pp) > pathSize && Buffer2.byteLength(prefix) <= prefixSize)
            ret = [pp.substr(0, pathSize - 1), prefix, true];
          else {
            pp = pathModule.join(pathModule.basename(prefix), pp);
            prefix = pathModule.dirname(prefix);
          }
        } while (prefix !== root && !ret);
        if (!ret)
          ret = [p.substr(0, pathSize - 1), "", true];
      }
      return ret;
    };
    var decString = (buf, off, size) => buf.slice(off, off + size).toString("utf8").replace(/\0.*/, "");
    var decDate = (buf, off, size) => numToDate(decNumber(buf, off, size));
    var numToDate = (num) => num === null ? null : new Date(num * 1e3);
    var decNumber = (buf, off, size) => buf[off] & 128 ? large.parse(buf.slice(off, off + size)) : decSmallNumber(buf, off, size);
    var nanNull = (value) => isNaN(value) ? null : value;
    var decSmallNumber = (buf, off, size) => nanNull(parseInt(
      buf.slice(off, off + size).toString("utf8").replace(/\0.*$/, "").trim(),
      8
    ));
    var MAXNUM = {
      12: 8589934591,
      8: 2097151
    };
    var encNumber = (buf, off, size, number) => number === null ? false : number > MAXNUM[size] || number < 0 ? (large.encode(number, buf.slice(off, off + size)), true) : (encSmallNumber(buf, off, size, number), false);
    var encSmallNumber = (buf, off, size, number) => buf.write(octalString(number, size), off, size, "ascii");
    var octalString = (number, size) => padOctal(Math.floor(number).toString(8), size);
    var padOctal = (string, size) => (string.length === size - 1 ? string : new Array(size - string.length - 1).join("0") + string + " ") + "\0";
    var encDate = (buf, off, size, date) => date === null ? false : encNumber(buf, off, size, date.getTime() / 1e3);
    var NULLS = new Array(156).join("\0");
    var encString = (buf, off, size, string) => string === null ? false : (buf.write(string + NULLS, off, size, "utf8"), string.length !== Buffer2.byteLength(string) || string.length > size);
    module.exports = Header;
  }
});
var require_pax = __commonJS({
  "node_modules/tar/lib/pax.js"(exports, module) {
    "use strict";
    var Buffer2 = require_buffer();
    var Header = require_header();
    var path = __require2("path");
    var Pax = class {
      constructor(obj, global2) {
        this.atime = obj.atime || null;
        this.charset = obj.charset || null;
        this.comment = obj.comment || null;
        this.ctime = obj.ctime || null;
        this.gid = obj.gid || null;
        this.gname = obj.gname || null;
        this.linkpath = obj.linkpath || null;
        this.mtime = obj.mtime || null;
        this.path = obj.path || null;
        this.size = obj.size || null;
        this.uid = obj.uid || null;
        this.uname = obj.uname || null;
        this.dev = obj.dev || null;
        this.ino = obj.ino || null;
        this.nlink = obj.nlink || null;
        this.global = global2 || false;
      }
      encode() {
        const body = this.encodeBody();
        if (body === "")
          return null;
        const bodyLen = Buffer2.byteLength(body);
        const bufLen = 512 * Math.ceil(1 + bodyLen / 512);
        const buf = Buffer2.allocUnsafe(bufLen);
        for (let i = 0; i < 512; i++) {
          buf[i] = 0;
        }
        new Header({
          // XXX split the path
          // then the path should be PaxHeader + basename, but less than 99,
          // prepend with the dirname
          path: ("PaxHeader/" + path.basename(this.path)).slice(0, 99),
          mode: this.mode || 420,
          uid: this.uid || null,
          gid: this.gid || null,
          size: bodyLen,
          mtime: this.mtime || null,
          type: this.global ? "GlobalExtendedHeader" : "ExtendedHeader",
          linkpath: "",
          uname: this.uname || "",
          gname: this.gname || "",
          devmaj: 0,
          devmin: 0,
          atime: this.atime || null,
          ctime: this.ctime || null
        }).encode(buf);
        buf.write(body, 512, bodyLen, "utf8");
        for (let i = bodyLen + 512; i < buf.length; i++) {
          buf[i] = 0;
        }
        return buf;
      }
      encodeBody() {
        return this.encodeField("path") + this.encodeField("ctime") + this.encodeField("atime") + this.encodeField("dev") + this.encodeField("ino") + this.encodeField("nlink") + this.encodeField("charset") + this.encodeField("comment") + this.encodeField("gid") + this.encodeField("gname") + this.encodeField("linkpath") + this.encodeField("mtime") + this.encodeField("size") + this.encodeField("uid") + this.encodeField("uname");
      }
      encodeField(field) {
        if (this[field] === null || this[field] === void 0)
          return "";
        const v = this[field] instanceof Date ? this[field].getTime() / 1e3 : this[field];
        const s = " " + (field === "dev" || field === "ino" || field === "nlink" ? "SCHILY." : "") + field + "=" + v + "\n";
        const byteLen = Buffer2.byteLength(s);
        let digits = Math.floor(Math.log(byteLen) / Math.log(10)) + 1;
        if (byteLen + digits >= Math.pow(10, digits))
          digits += 1;
        const len = digits + byteLen;
        return len + s;
      }
    };
    Pax.parse = (string, ex, g) => new Pax(merge2(parseKV(string), ex), g);
    var merge2 = (a, b) => b ? Object.keys(a).reduce((s, k) => (s[k] = a[k], s), b) : a;
    var parseKV = (string) => string.replace(/\n$/, "").split("\n").reduce(parseKVLine, /* @__PURE__ */ Object.create(null));
    var parseKVLine = (set, line) => {
      const n = parseInt(line, 10);
      if (n !== Buffer2.byteLength(line) + 1)
        return set;
      line = line.substr((n + " ").length);
      const kv = line.split("=");
      const k = kv.shift().replace(/^SCHILY\.(dev|ino|nlink)/, "$1");
      if (!k)
        return set;
      const v = kv.join("=");
      set[k] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(k) ? new Date(v * 1e3) : /^[0-9]+$/.test(v) ? +v : v;
      return set;
    };
    module.exports = Pax;
  }
});
var require_strip_trailing_slashes = __commonJS({
  "node_modules/tar/lib/strip-trailing-slashes.js"(exports, module) {
    var batchStrings = [
      "/".repeat(1024),
      "/".repeat(512),
      "/".repeat(256),
      "/".repeat(128),
      "/".repeat(64),
      "/".repeat(32),
      "/".repeat(16),
      "/".repeat(8),
      "/".repeat(4),
      "/".repeat(2),
      "/"
    ];
    module.exports = (str) => {
      for (const s of batchStrings) {
        while (str.length >= s.length && str.slice(-1 * s.length) === s)
          str = str.slice(0, -1 * s.length);
      }
      return str;
    };
  }
});
var require_warn_mixin = __commonJS({
  "node_modules/tar/lib/warn-mixin.js"(exports, module) {
    "use strict";
    module.exports = (Base) => class extends Base {
      warn(msg, data) {
        if (!this.strict)
          this.emit("warn", msg, data);
        else if (data instanceof Error)
          this.emit("error", data);
        else {
          const er = new Error(msg);
          er.data = data;
          this.emit("error", er);
        }
      }
    };
  }
});
var require_winchars = __commonJS({
  "node_modules/tar/lib/winchars.js"(exports, module) {
    "use strict";
    var raw = [
      "|",
      "<",
      ">",
      "?",
      ":"
    ];
    var win = raw.map((char) => String.fromCharCode(61440 + char.charCodeAt(0)));
    var toWin = new Map(raw.map((char, i) => [char, win[i]]));
    var toRaw = new Map(win.map((char, i) => [char, raw[i]]));
    module.exports = {
      encode: (s) => raw.reduce((s2, c) => s2.split(c).join(toWin.get(c)), s),
      decode: (s) => win.reduce((s2, c) => s2.split(c).join(toRaw.get(c)), s)
    };
  }
});
var require_strip_absolute_path = __commonJS({
  "node_modules/tar/lib/strip-absolute-path.js"(exports, module) {
    var { isAbsolute, parse } = __require2("path").win32;
    module.exports = (path) => {
      let r = "";
      let parsed = parse(path);
      while (isAbsolute(path) || parsed.root) {
        const root = path.charAt(0) === "/" && path.slice(0, 4) !== "//?/" ? "/" : parsed.root;
        path = path.substr(root.length);
        r += root;
        parsed = parse(path);
      }
      return [r, path];
    };
  }
});
var require_mode_fix = __commonJS({
  "node_modules/tar/lib/mode-fix.js"(exports, module) {
    "use strict";
    module.exports = (mode, isDir) => {
      mode &= 4095;
      if (isDir) {
        if (mode & 256)
          mode |= 64;
        if (mode & 32)
          mode |= 8;
        if (mode & 4)
          mode |= 1;
      }
      return mode;
    };
  }
});
var require_write_entry = __commonJS({
  "node_modules/tar/lib/write-entry.js"(exports, module) {
    "use strict";
    var Buffer2 = require_buffer();
    var MiniPass = require_minipass();
    var Pax = require_pax();
    var Header = require_header();
    var ReadEntry = require_read_entry();
    var fs = __require2("fs");
    var path = __require2("path");
    var normPath = require_normalize_windows_path();
    var stripSlash = require_strip_trailing_slashes();
    var prefixPath = (path2, prefix) => {
      if (!prefix)
        return path2;
      path2 = normPath(path2).replace(/^\.(\/|$)/, "");
      return stripSlash(prefix) + "/" + path2;
    };
    var maxReadSize = 16 * 1024 * 1024;
    var PROCESS = Symbol("process");
    var FILE = Symbol("file");
    var DIRECTORY = Symbol("directory");
    var SYMLINK = Symbol("symlink");
    var HARDLINK = Symbol("hardlink");
    var HEADER = Symbol("header");
    var READ = Symbol("read");
    var LSTAT = Symbol("lstat");
    var ONLSTAT = Symbol("onlstat");
    var ONREAD = Symbol("onread");
    var ONREADLINK = Symbol("onreadlink");
    var OPENFILE = Symbol("openfile");
    var ONOPENFILE = Symbol("onopenfile");
    var CLOSE = Symbol("close");
    var MODE = Symbol("mode");
    var AWAITDRAIN = Symbol("awaitDrain");
    var ONDRAIN = Symbol("ondrain");
    var PREFIX = Symbol("prefix");
    var HAD_ERROR = Symbol("hadError");
    var warner = require_warn_mixin();
    var winchars = require_winchars();
    var stripAbsolutePath = require_strip_absolute_path();
    var modeFix = require_mode_fix();
    var WriteEntry = warner(class WriteEntry extends MiniPass {
      constructor(p, opt) {
        opt = opt || {};
        super(opt);
        if (typeof p !== "string")
          throw new TypeError("path is required");
        this.path = normPath(p);
        this.portable = !!opt.portable;
        this.myuid = process.getuid && process.getuid() || 0;
        this.myuser = process.env.USER || "";
        this.maxReadSize = opt.maxReadSize || maxReadSize;
        this.linkCache = opt.linkCache || /* @__PURE__ */ new Map();
        this.statCache = opt.statCache || /* @__PURE__ */ new Map();
        this.preservePaths = !!opt.preservePaths;
        this.cwd = normPath(opt.cwd || process.cwd());
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.noMtime = !!opt.noMtime;
        this.mtime = opt.mtime || null;
        this.prefix = opt.prefix ? normPath(opt.prefix) : null;
        this.fd = null;
        this.blockLen = null;
        this.blockRemain = null;
        this.buf = null;
        this.offset = null;
        this.length = null;
        this.pos = null;
        this.remain = null;
        if (typeof opt.onwarn === "function")
          this.on("warn", opt.onwarn);
        if (!this.preservePaths) {
          const s = stripAbsolutePath(this.path);
          if (s[0]) {
            this.warn("stripping " + s[0] + " from absolute path", this.path);
            this.path = s[1];
          }
        }
        this.win32 = !!opt.win32 || process.platform === "win32";
        if (this.win32) {
          this.path = winchars.decode(this.path.replace(/\\/g, "/"));
          p = p.replace(/\\/g, "/");
        }
        this.absolute = normPath(opt.absolute || path.resolve(this.cwd, p));
        if (this.path === "")
          this.path = "./";
        if (this.statCache.has(this.absolute))
          this[ONLSTAT](this.statCache.get(this.absolute));
        else
          this[LSTAT]();
      }
      emit(ev, ...data) {
        if (ev === "error")
          this[HAD_ERROR] = true;
        return super.emit(ev, ...data);
      }
      [LSTAT]() {
        fs.lstat(this.absolute, (er, stat) => {
          if (er)
            return this.emit("error", er);
          this[ONLSTAT](stat);
        });
      }
      [ONLSTAT](stat) {
        this.statCache.set(this.absolute, stat);
        this.stat = stat;
        if (!stat.isFile())
          stat.size = 0;
        this.type = getType(stat);
        this.emit("stat", stat);
        this[PROCESS]();
      }
      [PROCESS]() {
        switch (this.type) {
          case "File":
            return this[FILE]();
          case "Directory":
            return this[DIRECTORY]();
          case "SymbolicLink":
            return this[SYMLINK]();
          default:
            return this.end();
        }
      }
      [MODE](mode) {
        return modeFix(mode, this.type === "Directory");
      }
      [PREFIX](path2) {
        return prefixPath(path2, this.prefix);
      }
      [HEADER]() {
        if (this.type === "Directory" && this.portable)
          this.noMtime = true;
        this.header = new Header({
          path: this[PREFIX](this.path),
          // only apply the prefix to hard links.
          linkpath: this.type === "Link" ? this[PREFIX](this.linkpath) : this.linkpath,
          // only the permissions and setuid/setgid/sticky bitflags
          // not the higher-order bits that specify file type
          mode: this[MODE](this.stat.mode),
          uid: this.portable ? null : this.stat.uid,
          gid: this.portable ? null : this.stat.gid,
          size: this.stat.size,
          mtime: this.noMtime ? null : this.mtime || this.stat.mtime,
          type: this.type,
          uname: this.portable ? null : this.stat.uid === this.myuid ? this.myuser : "",
          atime: this.portable ? null : this.stat.atime,
          ctime: this.portable ? null : this.stat.ctime
        });
        if (this.header.encode() && !this.noPax) {
          super.write(new Pax({
            atime: this.portable ? null : this.header.atime,
            ctime: this.portable ? null : this.header.ctime,
            gid: this.portable ? null : this.header.gid,
            mtime: this.noMtime ? null : this.mtime || this.header.mtime,
            path: this[PREFIX](this.path),
            linkpath: this.type === "Link" ? this[PREFIX](this.linkpath) : this.linkpath,
            size: this.header.size,
            uid: this.portable ? null : this.header.uid,
            uname: this.portable ? null : this.header.uname,
            dev: this.portable ? null : this.stat.dev,
            ino: this.portable ? null : this.stat.ino,
            nlink: this.portable ? null : this.stat.nlink
          }).encode());
        }
        super.write(this.header.block);
      }
      [DIRECTORY]() {
        if (this.path.substr(-1) !== "/")
          this.path += "/";
        this.stat.size = 0;
        this[HEADER]();
        this.end();
      }
      [SYMLINK]() {
        fs.readlink(this.absolute, (er, linkpath) => {
          if (er)
            return this.emit("error", er);
          this[ONREADLINK](linkpath);
        });
      }
      [ONREADLINK](linkpath) {
        this.linkpath = normPath(linkpath);
        this[HEADER]();
        this.end();
      }
      [HARDLINK](linkpath) {
        this.type = "Link";
        this.linkpath = normPath(path.relative(this.cwd, linkpath));
        this.stat.size = 0;
        this[HEADER]();
        this.end();
      }
      [FILE]() {
        if (this.stat.nlink > 1) {
          const linkKey = this.stat.dev + ":" + this.stat.ino;
          if (this.linkCache.has(linkKey)) {
            const linkpath = this.linkCache.get(linkKey);
            if (linkpath.indexOf(this.cwd) === 0)
              return this[HARDLINK](linkpath);
          }
          this.linkCache.set(linkKey, this.absolute);
        }
        this[HEADER]();
        if (this.stat.size === 0)
          return this.end();
        this[OPENFILE]();
      }
      [OPENFILE]() {
        fs.open(this.absolute, "r", (er, fd) => {
          if (er)
            return this.emit("error", er);
          this[ONOPENFILE](fd);
        });
      }
      [ONOPENFILE](fd) {
        this.fd = fd;
        if (this[HAD_ERROR])
          return this[CLOSE]();
        this.blockLen = 512 * Math.ceil(this.stat.size / 512);
        this.blockRemain = this.blockLen;
        const bufLen = Math.min(this.blockLen, this.maxReadSize);
        this.buf = Buffer2.allocUnsafe(bufLen);
        this.offset = 0;
        this.pos = 0;
        this.remain = this.stat.size;
        this.length = this.buf.length;
        this[READ]();
      }
      [READ]() {
        const { fd, buf, offset, length, pos } = this;
        fs.read(fd, buf, offset, length, pos, (er, bytesRead) => {
          if (er) {
            return this[CLOSE](() => this.emit("error", er));
          }
          this[ONREAD](bytesRead);
        });
      }
      [CLOSE](cb) {
        fs.close(this.fd, cb);
      }
      [ONREAD](bytesRead) {
        if (bytesRead <= 0 && this.remain > 0) {
          const er = new Error("encountered unexpected EOF");
          er.path = this.absolute;
          er.syscall = "read";
          er.code = "EOF";
          return this[CLOSE](() => this.emit("error", er));
        }
        if (bytesRead > this.remain) {
          const er = new Error("did not encounter expected EOF");
          er.path = this.absolute;
          er.syscall = "read";
          er.code = "EOF";
          return this[CLOSE](() => this.emit("error", er));
        }
        if (bytesRead === this.remain) {
          for (let i = bytesRead; i < this.length && bytesRead < this.blockRemain; i++) {
            this.buf[i + this.offset] = 0;
            bytesRead++;
            this.remain++;
          }
        }
        const writeBuf = this.offset === 0 && bytesRead === this.buf.length ? this.buf : this.buf.slice(this.offset, this.offset + bytesRead);
        const flushed = this.write(writeBuf);
        if (!flushed)
          this[AWAITDRAIN](() => this[ONDRAIN]());
        else
          this[ONDRAIN]();
      }
      [AWAITDRAIN](cb) {
        this.once("drain", cb);
      }
      write(writeBuf) {
        if (this.blockRemain < writeBuf.length) {
          const er = new Error("writing more data than expected");
          er.path = this.absolute;
          return this.emit("error", er);
        }
        this.remain -= writeBuf.length;
        this.blockRemain -= writeBuf.length;
        this.pos += writeBuf.length;
        this.offset += writeBuf.length;
        return super.write(writeBuf);
      }
      [ONDRAIN]() {
        if (!this.remain) {
          if (this.blockRemain)
            super.write(Buffer2.alloc(this.blockRemain));
          return this[CLOSE](
            /* istanbul ignore next - legacy */
            (er) => er ? this.emit("error", er) : this.end()
          );
        }
        if (this.offset >= this.length) {
          this.buf = Buffer2.allocUnsafe(Math.min(this.blockRemain, this.buf.length));
          this.offset = 0;
        }
        this.length = this.buf.length - this.offset;
        this[READ]();
      }
    });
    var WriteEntrySync = class extends WriteEntry {
      constructor(path2, opt) {
        super(path2, opt);
      }
      [LSTAT]() {
        this[ONLSTAT](fs.lstatSync(this.absolute));
      }
      [SYMLINK]() {
        this[ONREADLINK](fs.readlinkSync(this.absolute));
      }
      [OPENFILE]() {
        this[ONOPENFILE](fs.openSync(this.absolute, "r"));
      }
      [READ]() {
        let threw = true;
        try {
          const { fd, buf, offset, length, pos } = this;
          const bytesRead = fs.readSync(fd, buf, offset, length, pos);
          this[ONREAD](bytesRead);
          threw = false;
        } finally {
          if (threw) {
            try {
              this[CLOSE](() => {
              });
            } catch (er) {
            }
          }
        }
      }
      [AWAITDRAIN](cb) {
        cb();
      }
      [CLOSE](cb) {
        fs.closeSync(this.fd);
        cb();
      }
    };
    var WriteEntryTar = warner(class WriteEntryTar extends MiniPass {
      constructor(readEntry, opt) {
        opt = opt || {};
        super(opt);
        this.preservePaths = !!opt.preservePaths;
        this.portable = !!opt.portable;
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.noMtime = !!opt.noMtime;
        this.readEntry = readEntry;
        this.type = readEntry.type;
        if (this.type === "Directory" && this.portable)
          this.noMtime = true;
        this.prefix = opt.prefix || null;
        this.path = normPath(readEntry.path);
        this.mode = this[MODE](readEntry.mode);
        this.uid = this.portable ? null : readEntry.uid;
        this.gid = this.portable ? null : readEntry.gid;
        this.uname = this.portable ? null : readEntry.uname;
        this.gname = this.portable ? null : readEntry.gname;
        this.size = readEntry.size;
        this.mtime = this.noMtime ? null : opt.mtime || readEntry.mtime;
        this.atime = this.portable ? null : readEntry.atime;
        this.ctime = this.portable ? null : readEntry.ctime;
        this.linkpath = normPath(readEntry.linkpath);
        if (typeof opt.onwarn === "function")
          this.on("warn", opt.onwarn);
        if (!this.preservePaths) {
          const s = stripAbsolutePath(this.path);
          if (s[0]) {
            this.warn(
              "stripping " + s[0] + " from absolute path",
              this.path
            );
            this.path = s[1];
          }
        }
        this.remain = readEntry.size;
        this.blockRemain = readEntry.startBlockSize;
        this.header = new Header({
          path: this[PREFIX](this.path),
          linkpath: this.type === "Link" ? this[PREFIX](this.linkpath) : this.linkpath,
          // only the permissions and setuid/setgid/sticky bitflags
          // not the higher-order bits that specify file type
          mode: this.mode,
          uid: this.portable ? null : this.uid,
          gid: this.portable ? null : this.gid,
          size: this.size,
          mtime: this.noMtime ? null : this.mtime,
          type: this.type,
          uname: this.portable ? null : this.uname,
          atime: this.portable ? null : this.atime,
          ctime: this.portable ? null : this.ctime
        });
        if (this.header.encode() && !this.noPax)
          super.write(new Pax({
            atime: this.portable ? null : this.atime,
            ctime: this.portable ? null : this.ctime,
            gid: this.portable ? null : this.gid,
            mtime: this.noMtime ? null : this.mtime,
            path: this[PREFIX](this.path),
            linkpath: this.type === "Link" ? this[PREFIX](this.linkpath) : this.linkpath,
            size: this.size,
            uid: this.portable ? null : this.uid,
            uname: this.portable ? null : this.uname,
            dev: this.portable ? null : this.readEntry.dev,
            ino: this.portable ? null : this.readEntry.ino,
            nlink: this.portable ? null : this.readEntry.nlink
          }).encode());
        super.write(this.header.block);
        readEntry.pipe(this);
      }
      [PREFIX](path2) {
        return prefixPath(path2, this.prefix);
      }
      [MODE](mode) {
        return modeFix(mode, this.type === "Directory");
      }
      write(data) {
        const writeLen = data.length;
        if (writeLen > this.blockRemain)
          throw new Error("writing more to entry than is appropriate");
        this.blockRemain -= writeLen;
        return super.write(data);
      }
      end() {
        if (this.blockRemain)
          super.write(Buffer2.alloc(this.blockRemain));
        return super.end();
      }
    });
    WriteEntry.Sync = WriteEntrySync;
    WriteEntry.Tar = WriteEntryTar;
    var getType = (stat) => stat.isFile() ? "File" : stat.isDirectory() ? "Directory" : stat.isSymbolicLink() ? "SymbolicLink" : "Unsupported";
    module.exports = WriteEntry;
  }
});
var require_pack = __commonJS({
  "node_modules/tar/lib/pack.js"(exports, module) {
    "use strict";
    var Buffer2 = require_buffer();
    var PackJob = class {
      constructor(path2, absolute) {
        this.path = path2 || "./";
        this.absolute = absolute;
        this.entry = null;
        this.stat = null;
        this.readdir = null;
        this.pending = false;
        this.ignore = false;
        this.piped = false;
      }
    };
    var MiniPass = require_minipass();
    var zlib2 = require_minizlib();
    var ReadEntry = require_read_entry();
    var WriteEntry = require_write_entry();
    var WriteEntrySync = WriteEntry.Sync;
    var WriteEntryTar = WriteEntry.Tar;
    var Yallist = require_yallist();
    var EOF = Buffer2.alloc(1024);
    var ONSTAT = Symbol("onStat");
    var ENDED = Symbol("ended");
    var QUEUE = Symbol("queue");
    var CURRENT = Symbol("current");
    var PROCESS = Symbol("process");
    var PROCESSING = Symbol("processing");
    var PROCESSJOB = Symbol("processJob");
    var JOBS = Symbol("jobs");
    var JOBDONE = Symbol("jobDone");
    var ADDFSENTRY = Symbol("addFSEntry");
    var ADDTARENTRY = Symbol("addTarEntry");
    var STAT = Symbol("stat");
    var READDIR = Symbol("readdir");
    var ONREADDIR = Symbol("onreaddir");
    var PIPE = Symbol("pipe");
    var ENTRY = Symbol("entry");
    var ENTRYOPT = Symbol("entryOpt");
    var WRITEENTRYCLASS = Symbol("writeEntryClass");
    var WRITE = Symbol("write");
    var ONDRAIN = Symbol("ondrain");
    var fs = __require2("fs");
    var path = __require2("path");
    var warner = require_warn_mixin();
    var normPath = require_normalize_windows_path();
    var Pack = warner(class Pack extends MiniPass {
      constructor(opt) {
        super(opt);
        opt = opt || /* @__PURE__ */ Object.create(null);
        this.opt = opt;
        this.cwd = opt.cwd || process.cwd();
        this.maxReadSize = opt.maxReadSize;
        this.preservePaths = !!opt.preservePaths;
        this.strict = !!opt.strict;
        this.noPax = !!opt.noPax;
        this.prefix = normPath(opt.prefix || "");
        this.linkCache = opt.linkCache || /* @__PURE__ */ new Map();
        this.statCache = opt.statCache || /* @__PURE__ */ new Map();
        this.readdirCache = opt.readdirCache || /* @__PURE__ */ new Map();
        this[WRITEENTRYCLASS] = WriteEntry;
        if (typeof opt.onwarn === "function")
          this.on("warn", opt.onwarn);
        this.zip = null;
        if (opt.gzip) {
          if (typeof opt.gzip !== "object")
            opt.gzip = {};
          this.zip = new zlib2.Gzip(opt.gzip);
          this.zip.on("data", (chunk) => super.write(chunk));
          this.zip.on("end", (_) => super.end());
          this.zip.on("drain", (_) => this[ONDRAIN]());
          this.on("resume", (_) => this.zip.resume());
        } else
          this.on("drain", this[ONDRAIN]);
        this.portable = !!opt.portable;
        this.noDirRecurse = !!opt.noDirRecurse;
        this.follow = !!opt.follow;
        this.noMtime = !!opt.noMtime;
        this.mtime = opt.mtime || null;
        this.filter = typeof opt.filter === "function" ? opt.filter : (_) => true;
        this[QUEUE] = new Yallist();
        this[JOBS] = 0;
        this.jobs = +opt.jobs || 4;
        this[PROCESSING] = false;
        this[ENDED] = false;
      }
      [WRITE](chunk) {
        return super.write(chunk);
      }
      add(path2) {
        this.write(path2);
        return this;
      }
      end(path2) {
        if (path2)
          this.write(path2);
        this[ENDED] = true;
        this[PROCESS]();
        return this;
      }
      write(path2) {
        if (this[ENDED])
          throw new Error("write after end");
        if (path2 instanceof ReadEntry)
          this[ADDTARENTRY](path2);
        else
          this[ADDFSENTRY](path2);
        return this.flowing;
      }
      [ADDTARENTRY](p) {
        const absolute = normPath(path.resolve(this.cwd, p.path));
        if (!this.filter(p.path, p))
          p.resume();
        else {
          const job = new PackJob(p.path, absolute, false);
          job.entry = new WriteEntryTar(p, this[ENTRYOPT](job));
          job.entry.on("end", (_) => this[JOBDONE](job));
          this[JOBS] += 1;
          this[QUEUE].push(job);
        }
        this[PROCESS]();
      }
      [ADDFSENTRY](p) {
        const absolute = normPath(path.resolve(this.cwd, p));
        this[QUEUE].push(new PackJob(p, absolute));
        this[PROCESS]();
      }
      [STAT](job) {
        job.pending = true;
        this[JOBS] += 1;
        const stat = this.follow ? "stat" : "lstat";
        fs[stat](job.absolute, (er, stat2) => {
          job.pending = false;
          this[JOBS] -= 1;
          if (er)
            this.emit("error", er);
          else
            this[ONSTAT](job, stat2);
        });
      }
      [ONSTAT](job, stat) {
        this.statCache.set(job.absolute, stat);
        job.stat = stat;
        if (!this.filter(job.path, stat))
          job.ignore = true;
        this[PROCESS]();
      }
      [READDIR](job) {
        job.pending = true;
        this[JOBS] += 1;
        fs.readdir(job.absolute, (er, entries) => {
          job.pending = false;
          this[JOBS] -= 1;
          if (er)
            return this.emit("error", er);
          this[ONREADDIR](job, entries);
        });
      }
      [ONREADDIR](job, entries) {
        this.readdirCache.set(job.absolute, entries);
        job.readdir = entries;
        this[PROCESS]();
      }
      [PROCESS]() {
        if (this[PROCESSING])
          return;
        this[PROCESSING] = true;
        for (let w = this[QUEUE].head; w !== null && this[JOBS] < this.jobs; w = w.next) {
          this[PROCESSJOB](w.value);
          if (w.value.ignore) {
            const p = w.next;
            this[QUEUE].removeNode(w);
            w.next = p;
          }
        }
        this[PROCESSING] = false;
        if (this[ENDED] && !this[QUEUE].length && this[JOBS] === 0) {
          if (this.zip)
            this.zip.end(EOF);
          else {
            super.write(EOF);
            super.end();
          }
        }
      }
      get [CURRENT]() {
        return this[QUEUE] && this[QUEUE].head && this[QUEUE].head.value;
      }
      [JOBDONE](job) {
        this[QUEUE].shift();
        this[JOBS] -= 1;
        this[PROCESS]();
      }
      [PROCESSJOB](job) {
        if (job.pending)
          return;
        if (job.entry) {
          if (job === this[CURRENT] && !job.piped)
            this[PIPE](job);
          return;
        }
        if (!job.stat) {
          if (this.statCache.has(job.absolute))
            this[ONSTAT](job, this.statCache.get(job.absolute));
          else
            this[STAT](job);
        }
        if (!job.stat)
          return;
        if (job.ignore)
          return;
        if (!this.noDirRecurse && job.stat.isDirectory() && !job.readdir) {
          if (this.readdirCache.has(job.absolute))
            this[ONREADDIR](job, this.readdirCache.get(job.absolute));
          else
            this[READDIR](job);
          if (!job.readdir)
            return;
        }
        job.entry = this[ENTRY](job);
        if (!job.entry) {
          job.ignore = true;
          return;
        }
        if (job === this[CURRENT] && !job.piped)
          this[PIPE](job);
      }
      [ENTRYOPT](job) {
        return {
          onwarn: (msg, data) => {
            this.warn(msg, data);
          },
          noPax: this.noPax,
          cwd: this.cwd,
          absolute: job.absolute,
          preservePaths: this.preservePaths,
          maxReadSize: this.maxReadSize,
          strict: this.strict,
          portable: this.portable,
          linkCache: this.linkCache,
          statCache: this.statCache,
          noMtime: this.noMtime,
          mtime: this.mtime,
          prefix: this.prefix
        };
      }
      [ENTRY](job) {
        this[JOBS] += 1;
        try {
          return new this[WRITEENTRYCLASS](job.path, this[ENTRYOPT](job)).on("end", () => this[JOBDONE](job)).on("error", (er) => this.emit("error", er));
        } catch (er) {
          this.emit("error", er);
        }
      }
      [ONDRAIN]() {
        if (this[CURRENT] && this[CURRENT].entry)
          this[CURRENT].entry.resume();
      }
      // like .pipe() but using super, because our write() is special
      [PIPE](job) {
        job.piped = true;
        if (job.readdir)
          job.readdir.forEach((entry) => {
            const p = job.path;
            const base = p === "./" ? "" : p.replace(/\/*$/, "/");
            this[ADDFSENTRY](base + entry);
          });
        const source = job.entry;
        const zip = this.zip;
        if (zip)
          source.on("data", (chunk) => {
            if (!zip.write(chunk))
              source.pause();
          });
        else
          source.on("data", (chunk) => {
            if (!super.write(chunk))
              source.pause();
          });
      }
      pause() {
        if (this.zip)
          this.zip.pause();
        return super.pause();
      }
    });
    var PackSync = class extends Pack {
      constructor(opt) {
        super(opt);
        this[WRITEENTRYCLASS] = WriteEntrySync;
      }
      // pause/resume are no-ops in sync streams.
      pause() {
      }
      resume() {
      }
      [STAT](job) {
        const stat = this.follow ? "statSync" : "lstatSync";
        this[ONSTAT](job, fs[stat](job.absolute));
      }
      [READDIR](job, stat) {
        this[ONREADDIR](job, fs.readdirSync(job.absolute));
      }
      // gotta get it all in this tick
      [PIPE](job) {
        const source = job.entry;
        const zip = this.zip;
        if (job.readdir)
          job.readdir.forEach((entry) => {
            const p = job.path;
            const base = p === "./" ? "" : p.replace(/\/*$/, "/");
            this[ADDFSENTRY](base + entry);
          });
        if (zip)
          source.on("data", (chunk) => {
            zip.write(chunk);
          });
        else
          source.on("data", (chunk) => {
            super[WRITE](chunk);
          });
      }
    };
    Pack.Sync = PackSync;
    module.exports = Pack;
  }
});
var require_minipass3 = __commonJS({
  "node_modules/fs-minipass/node_modules/minipass/index.js"(exports, module) {
    "use strict";
    var EE = __require2("events");
    var Yallist = require_yallist();
    var SD = __require2("string_decoder").StringDecoder;
    var EOF = Symbol("EOF");
    var MAYBE_EMIT_END = Symbol("maybeEmitEnd");
    var EMITTED_END = Symbol("emittedEnd");
    var EMITTING_END = Symbol("emittingEnd");
    var CLOSED = Symbol("closed");
    var READ = Symbol("read");
    var FLUSH = Symbol("flush");
    var FLUSHCHUNK = Symbol("flushChunk");
    var ENCODING = Symbol("encoding");
    var DECODER = Symbol("decoder");
    var FLOWING = Symbol("flowing");
    var PAUSED = Symbol("paused");
    var RESUME = Symbol("resume");
    var BUFFERLENGTH = Symbol("bufferLength");
    var BUFFERPUSH = Symbol("bufferPush");
    var BUFFERSHIFT = Symbol("bufferShift");
    var OBJECTMODE = Symbol("objectMode");
    var DESTROYED = Symbol("destroyed");
    var doIter = global._MP_NO_ITERATOR_SYMBOLS_ !== "1";
    var ASYNCITERATOR = doIter && Symbol.asyncIterator || Symbol("asyncIterator not implemented");
    var ITERATOR = doIter && Symbol.iterator || Symbol("iterator not implemented");
    var B = Buffer.alloc ? Buffer : (
      /* istanbul ignore next */
      require_safe_buffer().Buffer
    );
    var isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
    var isArrayBuffer2 = (b) => b instanceof ArrayBuffer || typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0;
    var isArrayBufferView2 = (b) => !B.isBuffer(b) && ArrayBuffer.isView(b);
    module.exports = class Minipass extends EE {
      constructor(options) {
        super();
        this[FLOWING] = false;
        this[PAUSED] = false;
        this.pipes = new Yallist();
        this.buffer = new Yallist();
        this[OBJECTMODE] = options && options.objectMode || false;
        if (this[OBJECTMODE])
          this[ENCODING] = null;
        else
          this[ENCODING] = options && options.encoding || null;
        if (this[ENCODING] === "buffer")
          this[ENCODING] = null;
        this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null;
        this[EOF] = false;
        this[EMITTED_END] = false;
        this[EMITTING_END] = false;
        this[CLOSED] = false;
        this.writable = true;
        this.readable = true;
        this[BUFFERLENGTH] = 0;
        this[DESTROYED] = false;
      }
      get bufferLength() {
        return this[BUFFERLENGTH];
      }
      get encoding() {
        return this[ENCODING];
      }
      set encoding(enc) {
        if (this[OBJECTMODE])
          throw new Error("cannot set encoding in objectMode");
        if (this[ENCODING] && enc !== this[ENCODING] && (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
          throw new Error("cannot change encoding");
        if (this[ENCODING] !== enc) {
          this[DECODER] = enc ? new SD(enc) : null;
          if (this.buffer.length)
            this.buffer = this.buffer.map((chunk) => this[DECODER].write(chunk));
        }
        this[ENCODING] = enc;
      }
      setEncoding(enc) {
        this.encoding = enc;
      }
      get objectMode() {
        return this[OBJECTMODE];
      }
      set objectMode(\u0950) {
        this[OBJECTMODE] = this[OBJECTMODE] || !!\u0950;
      }
      write(chunk, encoding, cb) {
        if (this[EOF])
          throw new Error("write after end");
        if (this[DESTROYED]) {
          this.emit("error", Object.assign(
            new Error("Cannot call write after a stream was destroyed"),
            { code: "ERR_STREAM_DESTROYED" }
          ));
          return true;
        }
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (!encoding)
          encoding = "utf8";
        if (!this[OBJECTMODE] && !B.isBuffer(chunk)) {
          if (isArrayBufferView2(chunk))
            chunk = B.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
          else if (isArrayBuffer2(chunk))
            chunk = B.from(chunk);
          else if (typeof chunk !== "string")
            this.objectMode = true;
        }
        if (!this.objectMode && !chunk.length) {
          const ret = this.flowing;
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            cb();
          return ret;
        }
        if (typeof chunk === "string" && !this[OBJECTMODE] && // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER].lastNeed)) {
          chunk = B.from(chunk, encoding);
        }
        if (B.isBuffer(chunk) && this[ENCODING])
          chunk = this[DECODER].write(chunk);
        try {
          return this.flowing ? (this.emit("data", chunk), this.flowing) : (this[BUFFERPUSH](chunk), false);
        } finally {
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            cb();
        }
      }
      read(n) {
        if (this[DESTROYED])
          return null;
        try {
          if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH])
            return null;
          if (this[OBJECTMODE])
            n = null;
          if (this.buffer.length > 1 && !this[OBJECTMODE]) {
            if (this.encoding)
              this.buffer = new Yallist([
                Array.from(this.buffer).join("")
              ]);
            else
              this.buffer = new Yallist([
                B.concat(Array.from(this.buffer), this[BUFFERLENGTH])
              ]);
          }
          return this[READ](n || null, this.buffer.head.value);
        } finally {
          this[MAYBE_EMIT_END]();
        }
      }
      [READ](n, chunk) {
        if (n === chunk.length || n === null)
          this[BUFFERSHIFT]();
        else {
          this.buffer.head.value = chunk.slice(n);
          chunk = chunk.slice(0, n);
          this[BUFFERLENGTH] -= n;
        }
        this.emit("data", chunk);
        if (!this.buffer.length && !this[EOF])
          this.emit("drain");
        return chunk;
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === "function")
          cb = chunk, chunk = null;
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (chunk)
          this.write(chunk, encoding);
        if (cb)
          this.once("end", cb);
        this[EOF] = true;
        this.writable = false;
        if (this.flowing || !this[PAUSED])
          this[MAYBE_EMIT_END]();
        return this;
      }
      // don't let the internal resume be overwritten
      [RESUME]() {
        if (this[DESTROYED])
          return;
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit("resume");
        if (this.buffer.length)
          this[FLUSH]();
        else if (this[EOF])
          this[MAYBE_EMIT_END]();
        else
          this.emit("drain");
      }
      resume() {
        return this[RESUME]();
      }
      pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
      }
      get destroyed() {
        return this[DESTROYED];
      }
      get flowing() {
        return this[FLOWING];
      }
      get paused() {
        return this[PAUSED];
      }
      [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] += 1;
        else
          this[BUFFERLENGTH] += chunk.length;
        return this.buffer.push(chunk);
      }
      [BUFFERSHIFT]() {
        if (this.buffer.length) {
          if (this[OBJECTMODE])
            this[BUFFERLENGTH] -= 1;
          else
            this[BUFFERLENGTH] -= this.buffer.head.value.length;
        }
        return this.buffer.shift();
      }
      [FLUSH]() {
        do {
        } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()));
        if (!this.buffer.length && !this[EOF])
          this.emit("drain");
      }
      [FLUSHCHUNK](chunk) {
        return chunk ? (this.emit("data", chunk), this.flowing) : false;
      }
      pipe(dest, opts) {
        if (this[DESTROYED])
          return;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === process.stdout || dest === process.stderr)
          opts.end = false;
        else
          opts.end = opts.end !== false;
        const p = { dest, opts, ondrain: (_) => this[RESUME]() };
        this.pipes.push(p);
        dest.on("drain", p.ondrain);
        this[RESUME]();
        if (ended && p.opts.end)
          p.dest.end();
        return dest;
      }
      addListener(ev, fn) {
        return this.on(ev, fn);
      }
      on(ev, fn) {
        try {
          return super.on(ev, fn);
        } finally {
          if (ev === "data" && !this.pipes.length && !this.flowing)
            this[RESUME]();
          else if (isEndish(ev) && this[EMITTED_END]) {
            super.emit(ev);
            this.removeAllListeners(ev);
          }
        }
      }
      get emittedEnd() {
        return this[EMITTED_END];
      }
      [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this.buffer.length === 0 && this[EOF]) {
          this[EMITTING_END] = true;
          this.emit("end");
          this.emit("prefinish");
          this.emit("finish");
          if (this[CLOSED])
            this.emit("close");
          this[EMITTING_END] = false;
        }
      }
      emit(ev, data) {
        if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED])
          return;
        else if (ev === "data") {
          if (!data)
            return;
          if (this.pipes.length)
            this.pipes.forEach((p) => p.dest.write(data) === false && this.pause());
        } else if (ev === "end") {
          if (this[EMITTED_END] === true)
            return;
          this[EMITTED_END] = true;
          this.readable = false;
          if (this[DECODER]) {
            data = this[DECODER].end();
            if (data) {
              this.pipes.forEach((p) => p.dest.write(data));
              super.emit("data", data);
            }
          }
          this.pipes.forEach((p) => {
            p.dest.removeListener("drain", p.ondrain);
            if (p.opts.end)
              p.dest.end();
          });
        } else if (ev === "close") {
          this[CLOSED] = true;
          if (!this[EMITTED_END] && !this[DESTROYED])
            return;
        }
        const args = new Array(arguments.length);
        args[0] = ev;
        args[1] = data;
        if (arguments.length > 2) {
          for (let i = 2; i < arguments.length; i++) {
            args[i] = arguments[i];
          }
        }
        try {
          return super.emit.apply(this, args);
        } finally {
          if (!isEndish(ev))
            this[MAYBE_EMIT_END]();
          else
            this.removeAllListeners(ev);
        }
      }
      // const all = await stream.collect()
      collect() {
        const buf = [];
        buf.dataLength = 0;
        this.on("data", (c) => {
          buf.push(c);
          buf.dataLength += c.length;
        });
        return this.promise().then(() => buf);
      }
      // const data = await stream.concat()
      concat() {
        return this[OBJECTMODE] ? Promise.reject(new Error("cannot concat in objectMode")) : this.collect().then((buf) => this[OBJECTMODE] ? Promise.reject(new Error("cannot concat in objectMode")) : this[ENCODING] ? buf.join("") : B.concat(buf, buf.dataLength));
      }
      // stream.promise().then(() => done, er => emitted error)
      promise() {
        return new Promise((resolve, reject) => {
          this.on(DESTROYED, () => reject(new Error("stream destroyed")));
          this.on("end", () => resolve());
          this.on("error", (er) => reject(er));
        });
      }
      // for await (let chunk of stream)
      [ASYNCITERATOR]() {
        const next = () => {
          const res = this.read();
          if (res !== null)
            return Promise.resolve({ done: false, value: res });
          if (this[EOF])
            return Promise.resolve({ done: true });
          let resolve = null;
          let reject = null;
          const onerr = (er) => {
            this.removeListener("data", ondata);
            this.removeListener("end", onend);
            reject(er);
          };
          const ondata = (value) => {
            this.removeListener("error", onerr);
            this.removeListener("end", onend);
            this.pause();
            resolve({ value, done: !!this[EOF] });
          };
          const onend = () => {
            this.removeListener("error", onerr);
            this.removeListener("data", ondata);
            resolve({ done: true });
          };
          const ondestroy = () => onerr(new Error("stream destroyed"));
          return new Promise((res2, rej) => {
            reject = rej;
            resolve = res2;
            this.once(DESTROYED, ondestroy);
            this.once("error", onerr);
            this.once("end", onend);
            this.once("data", ondata);
          });
        };
        return { next };
      }
      // for (let chunk of stream)
      [ITERATOR]() {
        const next = () => {
          const value = this.read();
          const done = value === null;
          return { value, done };
        };
        return { next };
      }
      destroy(er) {
        if (this[DESTROYED]) {
          if (er)
            this.emit("error", er);
          else
            this.emit(DESTROYED);
          return this;
        }
        this[DESTROYED] = true;
        this.buffer = new Yallist();
        this[BUFFERLENGTH] = 0;
        if (typeof this.close === "function" && !this[CLOSED])
          this.close();
        if (er)
          this.emit("error", er);
        else
          this.emit(DESTROYED);
        return this;
      }
      static isStream(s) {
        return !!s && (s instanceof Minipass || s instanceof EE && (typeof s.pipe === "function" || // readable
        typeof s.write === "function" && typeof s.end === "function"));
      }
    };
  }
});
var require_fs_minipass = __commonJS({
  "node_modules/fs-minipass/index.js"(exports) {
    "use strict";
    var MiniPass = require_minipass3();
    var EE = __require2("events").EventEmitter;
    var fs = __require2("fs");
    var binding = process.binding("fs");
    var writeBuffers = binding.writeBuffers;
    var FSReqWrap = binding.FSReqWrap || binding.FSReqCallback;
    var _autoClose = Symbol("_autoClose");
    var _close = Symbol("_close");
    var _ended = Symbol("_ended");
    var _fd = Symbol("_fd");
    var _finished = Symbol("_finished");
    var _flags = Symbol("_flags");
    var _flush = Symbol("_flush");
    var _handleChunk = Symbol("_handleChunk");
    var _makeBuf = Symbol("_makeBuf");
    var _mode = Symbol("_mode");
    var _needDrain = Symbol("_needDrain");
    var _onerror = Symbol("_onerror");
    var _onopen = Symbol("_onopen");
    var _onread = Symbol("_onread");
    var _onwrite = Symbol("_onwrite");
    var _open = Symbol("_open");
    var _path = Symbol("_path");
    var _pos = Symbol("_pos");
    var _queue = Symbol("_queue");
    var _read = Symbol("_read");
    var _readSize = Symbol("_readSize");
    var _reading = Symbol("_reading");
    var _remain = Symbol("_remain");
    var _size = Symbol("_size");
    var _write = Symbol("_write");
    var _writing = Symbol("_writing");
    var _defaultFlag = Symbol("_defaultFlag");
    var ReadStream = class extends MiniPass {
      constructor(path, opt) {
        opt = opt || {};
        super(opt);
        this.writable = false;
        if (typeof path !== "string")
          throw new TypeError("path must be a string");
        this[_fd] = typeof opt.fd === "number" ? opt.fd : null;
        this[_path] = path;
        this[_readSize] = opt.readSize || 16 * 1024 * 1024;
        this[_reading] = false;
        this[_size] = typeof opt.size === "number" ? opt.size : Infinity;
        this[_remain] = this[_size];
        this[_autoClose] = typeof opt.autoClose === "boolean" ? opt.autoClose : true;
        if (typeof this[_fd] === "number")
          this[_read]();
        else
          this[_open]();
      }
      get fd() {
        return this[_fd];
      }
      get path() {
        return this[_path];
      }
      write() {
        throw new TypeError("this is a readable stream");
      }
      end() {
        throw new TypeError("this is a readable stream");
      }
      [_open]() {
        fs.open(this[_path], "r", (er, fd) => this[_onopen](er, fd));
      }
      [_onopen](er, fd) {
        if (er)
          this[_onerror](er);
        else {
          this[_fd] = fd;
          this.emit("open", fd);
          this[_read]();
        }
      }
      [_makeBuf]() {
        return Buffer.allocUnsafe(Math.min(this[_readSize], this[_remain]));
      }
      [_read]() {
        if (!this[_reading]) {
          this[_reading] = true;
          const buf = this[_makeBuf]();
          if (buf.length === 0)
            return process.nextTick(() => this[_onread](null, 0, buf));
          fs.read(this[_fd], buf, 0, buf.length, null, (er, br, buf2) => this[_onread](er, br, buf2));
        }
      }
      [_onread](er, br, buf) {
        this[_reading] = false;
        if (er)
          this[_onerror](er);
        else if (this[_handleChunk](br, buf))
          this[_read]();
      }
      [_close]() {
        if (this[_autoClose] && typeof this[_fd] === "number") {
          fs.close(this[_fd], (_) => this.emit("close"));
          this[_fd] = null;
        }
      }
      [_onerror](er) {
        this[_reading] = true;
        this[_close]();
        this.emit("error", er);
      }
      [_handleChunk](br, buf) {
        let ret = false;
        this[_remain] -= br;
        if (br > 0)
          ret = super.write(br < buf.length ? buf.slice(0, br) : buf);
        if (br === 0 || this[_remain] <= 0) {
          ret = false;
          this[_close]();
          super.end();
        }
        return ret;
      }
      emit(ev, data) {
        switch (ev) {
          case "prefinish":
          case "finish":
            break;
          case "drain":
            if (typeof this[_fd] === "number")
              this[_read]();
            break;
          default:
            return super.emit(ev, data);
        }
      }
    };
    var ReadStreamSync = class extends ReadStream {
      [_open]() {
        let threw = true;
        try {
          this[_onopen](null, fs.openSync(this[_path], "r"));
          threw = false;
        } finally {
          if (threw)
            this[_close]();
        }
      }
      [_read]() {
        let threw = true;
        try {
          if (!this[_reading]) {
            this[_reading] = true;
            do {
              const buf = this[_makeBuf]();
              const br = buf.length === 0 ? 0 : fs.readSync(this[_fd], buf, 0, buf.length, null);
              if (!this[_handleChunk](br, buf))
                break;
            } while (true);
            this[_reading] = false;
          }
          threw = false;
        } finally {
          if (threw)
            this[_close]();
        }
      }
      [_close]() {
        if (this[_autoClose] && typeof this[_fd] === "number") {
          try {
            fs.closeSync(this[_fd]);
          } catch (er) {
          }
          this[_fd] = null;
          this.emit("close");
        }
      }
    };
    var WriteStream = class extends EE {
      constructor(path, opt) {
        opt = opt || {};
        super(opt);
        this.readable = false;
        this[_writing] = false;
        this[_ended] = false;
        this[_needDrain] = false;
        this[_queue] = [];
        this[_path] = path;
        this[_fd] = typeof opt.fd === "number" ? opt.fd : null;
        this[_mode] = opt.mode === void 0 ? 438 : opt.mode;
        this[_pos] = typeof opt.start === "number" ? opt.start : null;
        this[_autoClose] = typeof opt.autoClose === "boolean" ? opt.autoClose : true;
        const defaultFlag = this[_pos] !== null ? "r+" : "w";
        this[_defaultFlag] = opt.flags === void 0;
        this[_flags] = this[_defaultFlag] ? defaultFlag : opt.flags;
        if (this[_fd] === null)
          this[_open]();
      }
      get fd() {
        return this[_fd];
      }
      get path() {
        return this[_path];
      }
      [_onerror](er) {
        this[_close]();
        this[_writing] = true;
        this.emit("error", er);
      }
      [_open]() {
        fs.open(
          this[_path],
          this[_flags],
          this[_mode],
          (er, fd) => this[_onopen](er, fd)
        );
      }
      [_onopen](er, fd) {
        if (this[_defaultFlag] && this[_flags] === "r+" && er && er.code === "ENOENT") {
          this[_flags] = "w";
          this[_open]();
        } else if (er)
          this[_onerror](er);
        else {
          this[_fd] = fd;
          this.emit("open", fd);
          this[_flush]();
        }
      }
      end(buf, enc) {
        if (buf)
          this.write(buf, enc);
        this[_ended] = true;
        if (!this[_writing] && !this[_queue].length && typeof this[_fd] === "number")
          this[_onwrite](null, 0);
      }
      write(buf, enc) {
        if (typeof buf === "string")
          buf = new Buffer(buf, enc);
        if (this[_ended]) {
          this.emit("error", new Error("write() after end()"));
          return false;
        }
        if (this[_fd] === null || this[_writing] || this[_queue].length) {
          this[_queue].push(buf);
          this[_needDrain] = true;
          return false;
        }
        this[_writing] = true;
        this[_write](buf);
        return true;
      }
      [_write](buf) {
        fs.write(this[_fd], buf, 0, buf.length, this[_pos], (er, bw) => this[_onwrite](er, bw));
      }
      [_onwrite](er, bw) {
        if (er)
          this[_onerror](er);
        else {
          if (this[_pos] !== null)
            this[_pos] += bw;
          if (this[_queue].length)
            this[_flush]();
          else {
            this[_writing] = false;
            if (this[_ended] && !this[_finished]) {
              this[_finished] = true;
              this[_close]();
              this.emit("finish");
            } else if (this[_needDrain]) {
              this[_needDrain] = false;
              this.emit("drain");
            }
          }
        }
      }
      [_flush]() {
        if (this[_queue].length === 0) {
          if (this[_ended])
            this[_onwrite](null, 0);
        } else if (this[_queue].length === 1)
          this[_write](this[_queue].pop());
        else {
          const iovec = this[_queue];
          this[_queue] = [];
          writev(
            this[_fd],
            iovec,
            this[_pos],
            (er, bw) => this[_onwrite](er, bw)
          );
        }
      }
      [_close]() {
        if (this[_autoClose] && typeof this[_fd] === "number") {
          fs.close(this[_fd], (_) => this.emit("close"));
          this[_fd] = null;
        }
      }
    };
    var WriteStreamSync = class extends WriteStream {
      [_open]() {
        let fd;
        try {
          fd = fs.openSync(this[_path], this[_flags], this[_mode]);
        } catch (er) {
          if (this[_defaultFlag] && this[_flags] === "r+" && er && er.code === "ENOENT") {
            this[_flags] = "w";
            return this[_open]();
          } else
            throw er;
        }
        this[_onopen](null, fd);
      }
      [_close]() {
        if (this[_autoClose] && typeof this[_fd] === "number") {
          try {
            fs.closeSync(this[_fd]);
          } catch (er) {
          }
          this[_fd] = null;
          this.emit("close");
        }
      }
      [_write](buf) {
        try {
          this[_onwrite](
            null,
            fs.writeSync(this[_fd], buf, 0, buf.length, this[_pos])
          );
        } catch (er) {
          this[_onwrite](er, 0);
        }
      }
    };
    var writev = (fd, iovec, pos, cb) => {
      const done = (er, bw) => cb(er, bw, iovec);
      const req = new FSReqWrap();
      req.oncomplete = done;
      binding.writeBuffers(fd, iovec, pos, req);
    };
    exports.ReadStream = ReadStream;
    exports.ReadStreamSync = ReadStreamSync;
    exports.WriteStream = WriteStream;
    exports.WriteStreamSync = WriteStreamSync;
  }
});
var require_parse = __commonJS({
  "node_modules/tar/lib/parse.js"(exports, module) {
    "use strict";
    var warner = require_warn_mixin();
    var path = __require2("path");
    var Header = require_header();
    var EE = __require2("events");
    var Yallist = require_yallist();
    var maxMetaEntrySize = 1024 * 1024;
    var Entry = require_read_entry();
    var Pax = require_pax();
    var zlib2 = require_minizlib();
    var Buffer2 = require_buffer();
    var gzipHeader = Buffer2.from([31, 139]);
    var STATE = Symbol("state");
    var WRITEENTRY = Symbol("writeEntry");
    var READENTRY = Symbol("readEntry");
    var NEXTENTRY = Symbol("nextEntry");
    var PROCESSENTRY = Symbol("processEntry");
    var EX = Symbol("extendedHeader");
    var GEX = Symbol("globalExtendedHeader");
    var META = Symbol("meta");
    var EMITMETA = Symbol("emitMeta");
    var BUFFER = Symbol("buffer");
    var QUEUE = Symbol("queue");
    var ENDED = Symbol("ended");
    var EMITTEDEND = Symbol("emittedEnd");
    var EMIT = Symbol("emit");
    var UNZIP = Symbol("unzip");
    var CONSUMECHUNK = Symbol("consumeChunk");
    var CONSUMECHUNKSUB = Symbol("consumeChunkSub");
    var CONSUMEBODY = Symbol("consumeBody");
    var CONSUMEMETA = Symbol("consumeMeta");
    var CONSUMEHEADER = Symbol("consumeHeader");
    var CONSUMING = Symbol("consuming");
    var BUFFERCONCAT = Symbol("bufferConcat");
    var MAYBEEND = Symbol("maybeEnd");
    var WRITING = Symbol("writing");
    var ABORTED = Symbol("aborted");
    var DONE = Symbol("onDone");
    var noop2 = (_) => true;
    module.exports = warner(class Parser extends EE {
      constructor(opt) {
        opt = opt || {};
        super(opt);
        if (opt.ondone)
          this.on(DONE, opt.ondone);
        else
          this.on(DONE, (_) => {
            this.emit("prefinish");
            this.emit("finish");
            this.emit("end");
            this.emit("close");
          });
        this.strict = !!opt.strict;
        this.maxMetaEntrySize = opt.maxMetaEntrySize || maxMetaEntrySize;
        this.filter = typeof opt.filter === "function" ? opt.filter : noop2;
        this.writable = true;
        this.readable = false;
        this[QUEUE] = new Yallist();
        this[BUFFER] = null;
        this[READENTRY] = null;
        this[WRITEENTRY] = null;
        this[STATE] = "begin";
        this[META] = "";
        this[EX] = null;
        this[GEX] = null;
        this[ENDED] = false;
        this[UNZIP] = null;
        this[ABORTED] = false;
        if (typeof opt.onwarn === "function")
          this.on("warn", opt.onwarn);
        if (typeof opt.onentry === "function")
          this.on("entry", opt.onentry);
      }
      [CONSUMEHEADER](chunk, position) {
        let header;
        try {
          header = new Header(chunk, position, this[EX], this[GEX]);
        } catch (er) {
          return this.warn("invalid entry", er);
        }
        if (header.nullBlock)
          this[EMIT]("nullBlock");
        else if (!header.cksumValid)
          this.warn("invalid entry", header);
        else if (!header.path)
          this.warn("invalid: path is required", header);
        else {
          const type = header.type;
          if (/^(Symbolic)?Link$/.test(type) && !header.linkpath)
            this.warn("invalid: linkpath required", header);
          else if (!/^(Symbolic)?Link$/.test(type) && header.linkpath)
            this.warn("invalid: linkpath forbidden", header);
          else {
            const entry = this[WRITEENTRY] = new Entry(header, this[EX], this[GEX]);
            if (entry.meta) {
              if (entry.size > this.maxMetaEntrySize) {
                entry.ignore = true;
                this[EMIT]("ignoredEntry", entry);
                this[STATE] = "ignore";
              } else if (entry.size > 0) {
                this[META] = "";
                entry.on("data", (c) => this[META] += c);
                this[STATE] = "meta";
              }
            } else {
              this[EX] = null;
              entry.ignore = entry.ignore || !this.filter(entry.path, entry);
              if (entry.ignore) {
                this[EMIT]("ignoredEntry", entry);
                this[STATE] = entry.remain ? "ignore" : "begin";
              } else {
                if (entry.remain)
                  this[STATE] = "body";
                else {
                  this[STATE] = "begin";
                  entry.end();
                }
                if (!this[READENTRY]) {
                  this[QUEUE].push(entry);
                  this[NEXTENTRY]();
                } else
                  this[QUEUE].push(entry);
              }
            }
          }
        }
      }
      [PROCESSENTRY](entry) {
        let go = true;
        if (!entry) {
          this[READENTRY] = null;
          go = false;
        } else if (Array.isArray(entry))
          this.emit.apply(this, entry);
        else {
          this[READENTRY] = entry;
          this.emit("entry", entry);
          if (!entry.emittedEnd) {
            entry.on("end", (_) => this[NEXTENTRY]());
            go = false;
          }
        }
        return go;
      }
      [NEXTENTRY]() {
        do {
        } while (this[PROCESSENTRY](this[QUEUE].shift()));
        if (!this[QUEUE].length) {
          const re = this[READENTRY];
          const drainNow = !re || re.flowing || re.size === re.remain;
          if (drainNow) {
            if (!this[WRITING])
              this.emit("drain");
          } else
            re.once("drain", (_) => this.emit("drain"));
        }
      }
      [CONSUMEBODY](chunk, position) {
        const entry = this[WRITEENTRY];
        const br = entry.blockRemain;
        const c = br >= chunk.length && position === 0 ? chunk : chunk.slice(position, position + br);
        entry.write(c);
        if (!entry.blockRemain) {
          this[STATE] = "begin";
          this[WRITEENTRY] = null;
          entry.end();
        }
        return c.length;
      }
      [CONSUMEMETA](chunk, position) {
        const entry = this[WRITEENTRY];
        const ret = this[CONSUMEBODY](chunk, position);
        if (!this[WRITEENTRY])
          this[EMITMETA](entry);
        return ret;
      }
      [EMIT](ev, data, extra) {
        if (!this[QUEUE].length && !this[READENTRY])
          this.emit(ev, data, extra);
        else
          this[QUEUE].push([ev, data, extra]);
      }
      [EMITMETA](entry) {
        this[EMIT]("meta", this[META]);
        switch (entry.type) {
          case "ExtendedHeader":
          case "OldExtendedHeader":
            this[EX] = Pax.parse(this[META], this[EX], false);
            break;
          case "GlobalExtendedHeader":
            this[GEX] = Pax.parse(this[META], this[GEX], true);
            break;
          case "NextFileHasLongPath":
          case "OldGnuLongPath":
            this[EX] = this[EX] || /* @__PURE__ */ Object.create(null);
            this[EX].path = this[META].replace(/\0.*/, "");
            break;
          case "NextFileHasLongLinkpath":
            this[EX] = this[EX] || /* @__PURE__ */ Object.create(null);
            this[EX].linkpath = this[META].replace(/\0.*/, "");
            break;
          default:
            throw new Error("unknown meta: " + entry.type);
        }
      }
      abort(msg, error) {
        this[ABORTED] = true;
        this.warn(msg, error);
        this.emit("abort", error);
        this.emit("error", error);
      }
      write(chunk) {
        if (this[ABORTED])
          return;
        if (this[UNZIP] === null && chunk) {
          if (this[BUFFER]) {
            chunk = Buffer2.concat([this[BUFFER], chunk]);
            this[BUFFER] = null;
          }
          if (chunk.length < gzipHeader.length) {
            this[BUFFER] = chunk;
            return true;
          }
          for (let i = 0; this[UNZIP] === null && i < gzipHeader.length; i++) {
            if (chunk[i] !== gzipHeader[i])
              this[UNZIP] = false;
          }
          if (this[UNZIP] === null) {
            const ended = this[ENDED];
            this[ENDED] = false;
            this[UNZIP] = new zlib2.Unzip();
            this[UNZIP].on("data", (chunk2) => this[CONSUMECHUNK](chunk2));
            this[UNZIP].on("error", (er) => this.abort(er.message, er));
            this[UNZIP].on("end", (_) => {
              this[ENDED] = true;
              this[CONSUMECHUNK]();
            });
            this[WRITING] = true;
            const ret2 = this[UNZIP][ended ? "end" : "write"](chunk);
            this[WRITING] = false;
            return ret2;
          }
        }
        this[WRITING] = true;
        if (this[UNZIP])
          this[UNZIP].write(chunk);
        else
          this[CONSUMECHUNK](chunk);
        this[WRITING] = false;
        const ret = this[QUEUE].length ? false : this[READENTRY] ? this[READENTRY].flowing : true;
        if (!ret && !this[QUEUE].length)
          this[READENTRY].once("drain", (_) => this.emit("drain"));
        return ret;
      }
      [BUFFERCONCAT](c) {
        if (c && !this[ABORTED])
          this[BUFFER] = this[BUFFER] ? Buffer2.concat([this[BUFFER], c]) : c;
      }
      [MAYBEEND]() {
        if (this[ENDED] && !this[EMITTEDEND] && !this[ABORTED] && !this[CONSUMING]) {
          this[EMITTEDEND] = true;
          const entry = this[WRITEENTRY];
          if (entry && entry.blockRemain) {
            const have = this[BUFFER] ? this[BUFFER].length : 0;
            this.warn("Truncated input (needed " + entry.blockRemain + " more bytes, only " + have + " available)", entry);
            if (this[BUFFER])
              entry.write(this[BUFFER]);
            entry.end();
          }
          this[EMIT](DONE);
        }
      }
      [CONSUMECHUNK](chunk) {
        if (this[CONSUMING]) {
          this[BUFFERCONCAT](chunk);
        } else if (!chunk && !this[BUFFER]) {
          this[MAYBEEND]();
        } else {
          this[CONSUMING] = true;
          if (this[BUFFER]) {
            this[BUFFERCONCAT](chunk);
            const c = this[BUFFER];
            this[BUFFER] = null;
            this[CONSUMECHUNKSUB](c);
          } else {
            this[CONSUMECHUNKSUB](chunk);
          }
          while (this[BUFFER] && this[BUFFER].length >= 512 && !this[ABORTED]) {
            const c = this[BUFFER];
            this[BUFFER] = null;
            this[CONSUMECHUNKSUB](c);
          }
          this[CONSUMING] = false;
        }
        if (!this[BUFFER] || this[ENDED])
          this[MAYBEEND]();
      }
      [CONSUMECHUNKSUB](chunk) {
        let position = 0;
        let length = chunk.length;
        while (position + 512 <= length && !this[ABORTED]) {
          switch (this[STATE]) {
            case "begin":
              this[CONSUMEHEADER](chunk, position);
              position += 512;
              break;
            case "ignore":
            case "body":
              position += this[CONSUMEBODY](chunk, position);
              break;
            case "meta":
              position += this[CONSUMEMETA](chunk, position);
              break;
            default:
              throw new Error("invalid state: " + this[STATE]);
          }
        }
        if (position < length) {
          if (this[BUFFER])
            this[BUFFER] = Buffer2.concat([chunk.slice(position), this[BUFFER]]);
          else
            this[BUFFER] = chunk.slice(position);
        }
      }
      end(chunk) {
        if (!this[ABORTED]) {
          if (this[UNZIP])
            this[UNZIP].end(chunk);
          else {
            this[ENDED] = true;
            this.write(chunk);
          }
        }
      }
    });
  }
});
var require_list = __commonJS({
  "node_modules/tar/lib/list.js"(exports, module) {
    "use strict";
    var Buffer2 = require_buffer();
    var hlo = require_high_level_opt();
    var Parser = require_parse();
    var fs = __require2("fs");
    var fsm = require_fs_minipass();
    var path = __require2("path");
    var stripSlash = require_strip_trailing_slashes();
    var t = module.exports = (opt_, files, cb) => {
      if (typeof opt_ === "function")
        cb = opt_, files = null, opt_ = {};
      else if (Array.isArray(opt_))
        files = opt_, opt_ = {};
      if (typeof files === "function")
        cb = files, files = null;
      if (!files)
        files = [];
      else
        files = Array.from(files);
      const opt = hlo(opt_);
      if (opt.sync && typeof cb === "function")
        throw new TypeError("callback not supported for sync tar functions");
      if (!opt.file && typeof cb === "function")
        throw new TypeError("callback only supported with file option");
      if (files.length)
        filesFilter(opt, files);
      if (!opt.noResume)
        onentryFunction(opt);
      return opt.file && opt.sync ? listFileSync(opt) : opt.file ? listFile(opt, cb) : list(opt);
    };
    var onentryFunction = (opt) => {
      const onentry = opt.onentry;
      opt.onentry = onentry ? (e) => {
        onentry(e);
        e.resume();
      } : (e) => e.resume();
    };
    var filesFilter = (opt, files) => {
      const map = new Map(files.map((f) => [stripSlash(f), true]));
      const filter2 = opt.filter;
      const mapHas = (file2, r) => {
        const root = r || path.parse(file2).root || ".";
        const ret = file2 === root ? false : map.has(file2) ? map.get(file2) : mapHas(path.dirname(file2), root);
        map.set(file2, ret);
        return ret;
      };
      opt.filter = filter2 ? (file2, entry) => filter2(file2, entry) && mapHas(stripSlash(file2)) : (file2) => mapHas(stripSlash(file2));
    };
    var listFileSync = (opt) => {
      const p = list(opt);
      const file2 = opt.file;
      let threw = true;
      let fd;
      try {
        const stat = fs.statSync(file2);
        const readSize = opt.maxReadSize || 16 * 1024 * 1024;
        if (stat.size < readSize) {
          p.end(fs.readFileSync(file2));
        } else {
          let pos = 0;
          const buf = Buffer2.allocUnsafe(readSize);
          fd = fs.openSync(file2, "r");
          while (pos < stat.size) {
            let bytesRead = fs.readSync(fd, buf, 0, readSize, pos);
            pos += bytesRead;
            p.write(buf.slice(0, bytesRead));
          }
          p.end();
        }
        threw = false;
      } finally {
        if (threw && fd)
          try {
            fs.closeSync(fd);
          } catch (er) {
          }
      }
    };
    var listFile = (opt, cb) => {
      const parse = new Parser(opt);
      const readSize = opt.maxReadSize || 16 * 1024 * 1024;
      const file2 = opt.file;
      const p = new Promise((resolve, reject) => {
        parse.on("error", reject);
        parse.on("end", resolve);
        fs.stat(file2, (er, stat) => {
          if (er)
            reject(er);
          else {
            const stream4 = new fsm.ReadStream(file2, {
              readSize,
              size: stat.size
            });
            stream4.on("error", reject);
            stream4.pipe(parse);
          }
        });
      });
      return cb ? p.then(cb, cb) : p;
    };
    var list = (opt) => new Parser(opt);
  }
});
var require_create = __commonJS({
  "node_modules/tar/lib/create.js"(exports, module) {
    "use strict";
    var hlo = require_high_level_opt();
    var Pack = require_pack();
    var fs = __require2("fs");
    var fsm = require_fs_minipass();
    var t = require_list();
    var path = __require2("path");
    var c = module.exports = (opt_, files, cb) => {
      if (typeof files === "function")
        cb = files;
      if (Array.isArray(opt_))
        files = opt_, opt_ = {};
      if (!files || !Array.isArray(files) || !files.length)
        throw new TypeError("no files or directories specified");
      files = Array.from(files);
      const opt = hlo(opt_);
      if (opt.sync && typeof cb === "function")
        throw new TypeError("callback not supported for sync tar functions");
      if (!opt.file && typeof cb === "function")
        throw new TypeError("callback only supported with file option");
      return opt.file && opt.sync ? createFileSync(opt, files) : opt.file ? createFile(opt, files, cb) : opt.sync ? createSync(opt, files) : create(opt, files);
    };
    var createFileSync = (opt, files) => {
      const p = new Pack.Sync(opt);
      const stream4 = new fsm.WriteStreamSync(opt.file, {
        mode: opt.mode || 438
      });
      p.pipe(stream4);
      addFilesSync(p, files);
    };
    var createFile = (opt, files, cb) => {
      const p = new Pack(opt);
      const stream4 = new fsm.WriteStream(opt.file, {
        mode: opt.mode || 438
      });
      p.pipe(stream4);
      const promise = new Promise((res, rej) => {
        stream4.on("error", rej);
        stream4.on("close", res);
        p.on("error", rej);
      });
      addFilesAsync(p, files);
      return cb ? promise.then(cb, cb) : promise;
    };
    var addFilesSync = (p, files) => {
      files.forEach((file2) => {
        if (file2.charAt(0) === "@")
          t({
            file: path.resolve(p.cwd, file2.substr(1)),
            sync: true,
            noResume: true,
            onentry: (entry) => p.add(entry)
          });
        else
          p.add(file2);
      });
      p.end();
    };
    var addFilesAsync = (p, files) => {
      while (files.length) {
        const file2 = files.shift();
        if (file2.charAt(0) === "@")
          return t({
            file: path.resolve(p.cwd, file2.substr(1)),
            noResume: true,
            onentry: (entry) => p.add(entry)
          }).then((_) => addFilesAsync(p, files));
        else
          p.add(file2);
      }
      p.end();
    };
    var createSync = (opt, files) => {
      const p = new Pack.Sync(opt);
      addFilesSync(p, files);
      return p;
    };
    var create = (opt, files) => {
      const p = new Pack(opt);
      addFilesAsync(p, files);
      return p;
    };
  }
});
var require_replace = __commonJS({
  "node_modules/tar/lib/replace.js"(exports, module) {
    "use strict";
    var Buffer2 = require_buffer();
    var hlo = require_high_level_opt();
    var Pack = require_pack();
    var Parse = require_parse();
    var fs = __require2("fs");
    var fsm = require_fs_minipass();
    var t = require_list();
    var path = __require2("path");
    var Header = require_header();
    var r = module.exports = (opt_, files, cb) => {
      const opt = hlo(opt_);
      if (!opt.file)
        throw new TypeError("file is required");
      if (opt.gzip)
        throw new TypeError("cannot append to compressed archives");
      if (!files || !Array.isArray(files) || !files.length)
        throw new TypeError("no files or directories specified");
      files = Array.from(files);
      return opt.sync ? replaceSync(opt, files) : replace(opt, files, cb);
    };
    var replaceSync = (opt, files) => {
      const p = new Pack.Sync(opt);
      let threw = true;
      let fd;
      let position;
      try {
        try {
          fd = fs.openSync(opt.file, "r+");
        } catch (er) {
          if (er.code === "ENOENT")
            fd = fs.openSync(opt.file, "w+");
          else
            throw er;
        }
        const st = fs.fstatSync(fd);
        const headBuf = Buffer2.alloc(512);
        POSITION:
          for (position = 0; position < st.size; position += 512) {
            for (let bufPos = 0, bytes = 0; bufPos < 512; bufPos += bytes) {
              bytes = fs.readSync(
                fd,
                headBuf,
                bufPos,
                headBuf.length - bufPos,
                position + bufPos
              );
              if (position === 0 && headBuf[0] === 31 && headBuf[1] === 139)
                throw new Error("cannot append to compressed archives");
              if (!bytes)
                break POSITION;
            }
            let h = new Header(headBuf);
            if (!h.cksumValid)
              break;
            let entryBlockSize = 512 * Math.ceil(h.size / 512);
            if (position + entryBlockSize + 512 > st.size)
              break;
            position += entryBlockSize;
            if (opt.mtimeCache)
              opt.mtimeCache.set(h.path, h.mtime);
          }
        threw = false;
        streamSync(opt, p, position, fd, files);
      } finally {
        if (threw)
          try {
            fs.closeSync(fd);
          } catch (er) {
          }
      }
    };
    var streamSync = (opt, p, position, fd, files) => {
      const stream4 = new fsm.WriteStreamSync(opt.file, {
        fd,
        start: position
      });
      p.pipe(stream4);
      addFilesSync(p, files);
    };
    var replace = (opt, files, cb) => {
      files = Array.from(files);
      const p = new Pack(opt);
      const getPos = (fd, size, cb_) => {
        const cb2 = (er, pos) => {
          if (er)
            fs.close(fd, (_) => cb_(er));
          else
            cb_(null, pos);
        };
        let position = 0;
        if (size === 0)
          return cb2(null, 0);
        let bufPos = 0;
        const headBuf = Buffer2.alloc(512);
        const onread = (er, bytes) => {
          if (er)
            return cb2(er);
          bufPos += bytes;
          if (bufPos < 512 && bytes)
            return fs.read(
              fd,
              headBuf,
              bufPos,
              headBuf.length - bufPos,
              position + bufPos,
              onread
            );
          if (position === 0 && headBuf[0] === 31 && headBuf[1] === 139)
            return cb2(new Error("cannot append to compressed archives"));
          if (bufPos < 512)
            return cb2(null, position);
          const h = new Header(headBuf);
          if (!h.cksumValid)
            return cb2(null, position);
          const entryBlockSize = 512 * Math.ceil(h.size / 512);
          if (position + entryBlockSize + 512 > size)
            return cb2(null, position);
          position += entryBlockSize + 512;
          if (position >= size)
            return cb2(null, position);
          if (opt.mtimeCache)
            opt.mtimeCache.set(h.path, h.mtime);
          bufPos = 0;
          fs.read(fd, headBuf, 0, 512, position, onread);
        };
        fs.read(fd, headBuf, 0, 512, position, onread);
      };
      const promise = new Promise((resolve, reject) => {
        p.on("error", reject);
        let flag = "r+";
        const onopen = (er, fd) => {
          if (er && er.code === "ENOENT" && flag === "r+") {
            flag = "w+";
            return fs.open(opt.file, flag, onopen);
          }
          if (er)
            return reject(er);
          fs.fstat(fd, (er2, st) => {
            if (er2)
              return fs.close(fd, () => reject(er2));
            getPos(fd, st.size, (er3, position) => {
              if (er3)
                return reject(er3);
              const stream4 = new fsm.WriteStream(opt.file, {
                fd,
                start: position
              });
              p.pipe(stream4);
              stream4.on("error", reject);
              stream4.on("close", resolve);
              addFilesAsync(p, files);
            });
          });
        };
        fs.open(opt.file, flag, onopen);
      });
      return cb ? promise.then(cb, cb) : promise;
    };
    var addFilesSync = (p, files) => {
      files.forEach((file2) => {
        if (file2.charAt(0) === "@")
          t({
            file: path.resolve(p.cwd, file2.substr(1)),
            sync: true,
            noResume: true,
            onentry: (entry) => p.add(entry)
          });
        else
          p.add(file2);
      });
      p.end();
    };
    var addFilesAsync = (p, files) => {
      while (files.length) {
        const file2 = files.shift();
        if (file2.charAt(0) === "@")
          return t({
            file: path.resolve(p.cwd, file2.substr(1)),
            noResume: true,
            onentry: (entry) => p.add(entry)
          }).then((_) => addFilesAsync(p, files));
        else
          p.add(file2);
      }
      p.end();
    };
  }
});
var require_update = __commonJS({
  "node_modules/tar/lib/update.js"(exports, module) {
    "use strict";
    var hlo = require_high_level_opt();
    var r = require_replace();
    var u = module.exports = (opt_, files, cb) => {
      const opt = hlo(opt_);
      if (!opt.file)
        throw new TypeError("file is required");
      if (opt.gzip)
        throw new TypeError("cannot append to compressed archives");
      if (!files || !Array.isArray(files) || !files.length)
        throw new TypeError("no files or directories specified");
      files = Array.from(files);
      mtimeFilter(opt);
      return r(opt, files, cb);
    };
    var mtimeFilter = (opt) => {
      const filter2 = opt.filter;
      if (!opt.mtimeCache)
        opt.mtimeCache = /* @__PURE__ */ new Map();
      opt.filter = filter2 ? (path, stat) => filter2(path, stat) && !(opt.mtimeCache.get(path) > stat.mtime) : (path, stat) => !(opt.mtimeCache.get(path) > stat.mtime);
    };
  }
});
var require_mkdirp = __commonJS({
  "node_modules/mkdirp/index.js"(exports, module) {
    var path = __require2("path");
    var fs = __require2("fs");
    var _0777 = parseInt("0777", 8);
    module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
    function mkdirP(p, opts, f, made) {
      if (typeof opts === "function") {
        f = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      var cb = f || /* istanbul ignore next */
      function() {
      };
      p = path.resolve(p);
      xfs.mkdir(p, mode, function(er) {
        if (!er) {
          made = made || p;
          return cb(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            if (path.dirname(p) === p)
              return cb(er);
            mkdirP(path.dirname(p), opts, function(er2, made2) {
              if (er2)
                cb(er2, made2);
              else
                mkdirP(p, opts, cb, made2);
            });
            break;
          default:
            xfs.stat(p, function(er2, stat) {
              if (er2 || !stat.isDirectory())
                cb(er, made);
              else
                cb(null, made);
            });
            break;
        }
      });
    }
    mkdirP.sync = function sync(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      p = path.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        switch (err0.code) {
          case "ENOENT":
            made = sync(path.dirname(p), opts, made);
            sync(p, opts, made);
            break;
          default:
            var stat;
            try {
              stat = xfs.statSync(p);
            } catch (err1) {
              throw err0;
            }
            if (!stat.isDirectory())
              throw err0;
            break;
        }
      }
      return made;
    };
  }
});
var require_chownr = __commonJS({
  "node_modules/chownr/chownr.js"(exports, module) {
    "use strict";
    var fs = __require2("fs");
    var path = __require2("path");
    var LCHOWN = fs.lchown ? "lchown" : "chown";
    var LCHOWNSYNC = fs.lchownSync ? "lchownSync" : "chownSync";
    var needEISDIRHandled = fs.lchown && !process.version.match(/v1[1-9]+\./) && !process.version.match(/v10\.[6-9]/);
    var lchownSync = (path2, uid, gid) => {
      try {
        return fs[LCHOWNSYNC](path2, uid, gid);
      } catch (er) {
        if (er.code !== "ENOENT")
          throw er;
      }
    };
    var chownSync = (path2, uid, gid) => {
      try {
        return fs.chownSync(path2, uid, gid);
      } catch (er) {
        if (er.code !== "ENOENT")
          throw er;
      }
    };
    var handleEISDIR = needEISDIRHandled ? (path2, uid, gid, cb) => (er) => {
      if (!er || er.code !== "EISDIR")
        cb(er);
      else
        fs.chown(path2, uid, gid, cb);
    } : (_, __, ___, cb) => cb;
    var handleEISDirSync = needEISDIRHandled ? (path2, uid, gid) => {
      try {
        return lchownSync(path2, uid, gid);
      } catch (er) {
        if (er.code !== "EISDIR")
          throw er;
        chownSync(path2, uid, gid);
      }
    } : (path2, uid, gid) => lchownSync(path2, uid, gid);
    var nodeVersion = process.version;
    var readdir = (path2, options, cb) => fs.readdir(path2, options, cb);
    var readdirSync = (path2, options) => fs.readdirSync(path2, options);
    if (/^v4\./.test(nodeVersion))
      readdir = (path2, options, cb) => fs.readdir(path2, cb);
    var chown = (cpath, uid, gid, cb) => {
      fs[LCHOWN](cpath, uid, gid, handleEISDIR(cpath, uid, gid, (er) => {
        cb(er && er.code !== "ENOENT" ? er : null);
      }));
    };
    var chownrKid = (p, child, uid, gid, cb) => {
      if (typeof child === "string")
        return fs.lstat(path.resolve(p, child), (er, stats) => {
          if (er)
            return cb(er.code !== "ENOENT" ? er : null);
          stats.name = child;
          chownrKid(p, stats, uid, gid, cb);
        });
      if (child.isDirectory()) {
        chownr(path.resolve(p, child.name), uid, gid, (er) => {
          if (er)
            return cb(er);
          const cpath = path.resolve(p, child.name);
          chown(cpath, uid, gid, cb);
        });
      } else {
        const cpath = path.resolve(p, child.name);
        chown(cpath, uid, gid, cb);
      }
    };
    var chownr = (p, uid, gid, cb) => {
      readdir(p, { withFileTypes: true }, (er, children) => {
        if (er) {
          if (er.code === "ENOENT")
            return cb();
          else if (er.code !== "ENOTDIR" && er.code !== "ENOTSUP")
            return cb(er);
        }
        if (er || !children.length)
          return chown(p, uid, gid, cb);
        let len = children.length;
        let errState = null;
        const then = (er2) => {
          if (errState)
            return;
          if (er2)
            return cb(errState = er2);
          if (--len === 0)
            return chown(p, uid, gid, cb);
        };
        children.forEach((child) => chownrKid(p, child, uid, gid, then));
      });
    };
    var chownrKidSync = (p, child, uid, gid) => {
      if (typeof child === "string") {
        try {
          const stats = fs.lstatSync(path.resolve(p, child));
          stats.name = child;
          child = stats;
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          else
            throw er;
        }
      }
      if (child.isDirectory())
        chownrSync(path.resolve(p, child.name), uid, gid);
      handleEISDirSync(path.resolve(p, child.name), uid, gid);
    };
    var chownrSync = (p, uid, gid) => {
      let children;
      try {
        children = readdirSync(p, { withFileTypes: true });
      } catch (er) {
        if (er.code === "ENOENT")
          return;
        else if (er.code === "ENOTDIR" || er.code === "ENOTSUP")
          return handleEISDirSync(p, uid, gid);
        else
          throw er;
      }
      if (children && children.length)
        children.forEach((child) => chownrKidSync(p, child, uid, gid));
      return handleEISDirSync(p, uid, gid);
    };
    module.exports = chownr;
    chownr.sync = chownrSync;
  }
});
var require_mkdir = __commonJS({
  "node_modules/tar/lib/mkdir.js"(exports, module) {
    "use strict";
    var mkdirp = require_mkdirp();
    var fs = __require2("fs");
    var path = __require2("path");
    var chownr = require_chownr();
    var normPath = require_normalize_windows_path();
    var SymlinkError = class extends Error {
      constructor(symlink, path2) {
        super("Cannot extract through symbolic link");
        this.path = path2;
        this.symlink = symlink;
      }
      get name() {
        return "SylinkError";
      }
    };
    var CwdError = class extends Error {
      constructor(path2, code) {
        super(code + ": Cannot cd into '" + path2 + "'");
        this.path = path2;
        this.code = code;
      }
      get name() {
        return "CwdError";
      }
    };
    var cGet = (cache, key) => cache.get(normPath(key));
    var cSet = (cache, key, val) => cache.set(normPath(key), val);
    var checkCwd = (dir, cb) => {
      fs.stat(dir, (er, st) => {
        if (er || !st.isDirectory())
          er = new CwdError(dir, er && er.code || "ENOTDIR");
        cb(er);
      });
    };
    module.exports = (dir, opt, cb) => {
      dir = normPath(dir);
      const umask = opt.umask;
      const mode = opt.mode | 448;
      const needChmod = (mode & umask) !== 0;
      const uid = opt.uid;
      const gid = opt.gid;
      const doChown = typeof uid === "number" && typeof gid === "number" && (uid !== opt.processUid || gid !== opt.processGid);
      const preserve = opt.preserve;
      const unlink = opt.unlink;
      const cache = opt.cache;
      const cwd = normPath(opt.cwd);
      const done = (er, created) => {
        if (er)
          cb(er);
        else {
          cSet(cache, dir, true);
          if (created && doChown)
            chownr(created, uid, gid, (er2) => done(er2));
          else if (needChmod)
            fs.chmod(dir, mode, cb);
          else
            cb();
        }
      };
      if (cache && cGet(cache, dir) === true)
        return done();
      if (dir === cwd)
        return checkCwd(dir, done);
      if (preserve)
        return mkdirp(dir, mode, done);
      const sub6 = normPath(path.relative(cwd, dir));
      const parts = sub6.split("/");
      mkdir_(cwd, parts, mode, cache, unlink, cwd, null, done);
    };
    var mkdir_ = (base, parts, mode, cache, unlink, cwd, created, cb) => {
      if (!parts.length)
        return cb(null, created);
      const p = parts.shift();
      const part = normPath(path.resolve(base + "/" + p));
      if (cGet(cache, part))
        return mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
      fs.mkdir(part, mode, onmkdir(part, parts, mode, cache, unlink, cwd, created, cb));
    };
    var onmkdir = (part, parts, mode, cache, unlink, cwd, created, cb) => (er) => {
      if (er) {
        fs.lstat(part, (statEr, st) => {
          if (statEr) {
            statEr.path = statEr.path && normPath(statEr.path);
            cb(statEr);
          } else if (st.isDirectory())
            mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
          else if (unlink)
            fs.unlink(part, (er2) => {
              if (er2)
                return cb(er2);
              fs.mkdir(part, mode, onmkdir(part, parts, mode, cache, unlink, cwd, created, cb));
            });
          else if (st.isSymbolicLink())
            return cb(new SymlinkError(part, part + "/" + parts.join("/")));
          else
            cb(er);
        });
      } else {
        created = created || part;
        mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
      }
    };
    var checkCwdSync = (dir) => {
      let ok = false;
      let code = "ENOTDIR";
      try {
        ok = fs.statSync(dir).isDirectory();
      } catch (er) {
        code = er.code;
      } finally {
        if (!ok)
          throw new CwdError(dir, code);
      }
    };
    module.exports.sync = (dir, opt) => {
      dir = normPath(dir);
      const umask = opt.umask;
      const mode = opt.mode | 448;
      const needChmod = (mode & umask) !== 0;
      const uid = opt.uid;
      const gid = opt.gid;
      const doChown = typeof uid === "number" && typeof gid === "number" && (uid !== opt.processUid || gid !== opt.processGid);
      const preserve = opt.preserve;
      const unlink = opt.unlink;
      const cache = opt.cache;
      const cwd = normPath(opt.cwd);
      const done = (created2) => {
        cSet(cache, dir, true);
        if (created2 && doChown)
          chownr.sync(created2, uid, gid);
        if (needChmod)
          fs.chmodSync(dir, mode);
      };
      if (cache && cGet(cache, dir) === true)
        return done();
      if (dir === cwd) {
        checkCwdSync(cwd);
        return done();
      }
      if (preserve)
        return done(mkdirp.sync(dir, mode));
      const sub6 = normPath(path.relative(cwd, dir));
      const parts = sub6.split("/");
      let created = null;
      for (let p = parts.shift(), part = cwd; p && (part += "/" + p); p = parts.shift()) {
        part = normPath(path.resolve(part));
        if (cGet(cache, part))
          continue;
        try {
          fs.mkdirSync(part, mode);
          created = created || part;
          cSet(cache, part, true);
        } catch (er) {
          const st = fs.lstatSync(part);
          if (st.isDirectory()) {
            cSet(cache, part, true);
            continue;
          } else if (unlink) {
            fs.unlinkSync(part);
            fs.mkdirSync(part, mode);
            created = created || part;
            cSet(cache, part, true);
            continue;
          } else if (st.isSymbolicLink())
            return new SymlinkError(part, part + "/" + parts.join("/"));
        }
      }
      return done(created);
    };
  }
});
var require_path_reservations = __commonJS({
  "node_modules/tar/lib/path-reservations.js"(exports, module) {
    var assert = __require2("assert");
    var normPath = require_normalize_windows_path();
    var stripSlashes = require_strip_trailing_slashes();
    var { join } = __require2("path");
    var platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
    var isWindows = platform === "win32";
    module.exports = () => {
      const queues = /* @__PURE__ */ new Map();
      const reservations = /* @__PURE__ */ new Map();
      const getDirs = (path) => {
        const dirs = path.split("/").slice(0, -1).reduce((set, path2) => {
          if (set.length)
            path2 = normPath(join(set[set.length - 1], path2));
          set.push(path2 || "/");
          return set;
        }, []);
        return dirs;
      };
      const running = /* @__PURE__ */ new Set();
      const getQueues = (fn) => {
        const res = reservations.get(fn);
        if (!res)
          throw new Error("function does not have any path reservations");
        return {
          paths: res.paths.map((path) => queues.get(path)),
          dirs: [...res.dirs].map((path) => queues.get(path))
        };
      };
      const check = (fn) => {
        const { paths, dirs } = getQueues(fn);
        return paths.every((q) => q[0] === fn) && dirs.every((q) => q[0] instanceof Set && q[0].has(fn));
      };
      const run = (fn) => {
        if (running.has(fn) || !check(fn))
          return false;
        running.add(fn);
        fn(() => clear(fn));
        return true;
      };
      const clear = (fn) => {
        if (!running.has(fn))
          return false;
        const { paths, dirs } = reservations.get(fn);
        const next = /* @__PURE__ */ new Set();
        paths.forEach((path) => {
          const q = queues.get(path);
          assert.equal(q[0], fn);
          if (q.length === 1)
            queues.delete(path);
          else {
            q.shift();
            if (typeof q[0] === "function")
              next.add(q[0]);
            else
              q[0].forEach((fn2) => next.add(fn2));
          }
        });
        dirs.forEach((dir) => {
          const q = queues.get(dir);
          assert(q[0] instanceof Set);
          if (q[0].size === 1 && q.length === 1) {
            queues.delete(dir);
          } else if (q[0].size === 1) {
            q.shift();
            next.add(q[0]);
          } else
            q[0].delete(fn);
        });
        running.delete(fn);
        next.forEach((fn2) => run(fn2));
        return true;
      };
      const reserve = (paths, fn) => {
        paths = isWindows ? ["win32 parallelization disabled"] : paths.map((p) => {
          return stripSlashes(normPath(join(p))).normalize("NFKD").toLowerCase();
        });
        const dirs = new Set(
          paths.map((path) => getDirs(path)).reduce((a, b) => a.concat(b))
        );
        reservations.set(fn, { dirs, paths });
        paths.forEach((path) => {
          const q = queues.get(path);
          if (!q)
            queues.set(path, [fn]);
          else
            q.push(fn);
        });
        dirs.forEach((dir) => {
          const q = queues.get(dir);
          if (!q)
            queues.set(dir, [/* @__PURE__ */ new Set([fn])]);
          else if (q[q.length - 1] instanceof Set)
            q[q.length - 1].add(fn);
          else
            q.push(/* @__PURE__ */ new Set([fn]));
        });
        return run(fn);
      };
      return { check, reserve };
    };
  }
});
var require_unpack = __commonJS({
  "node_modules/tar/lib/unpack.js"(exports, module) {
    "use strict";
    var assert = __require2("assert");
    var EE = __require2("events").EventEmitter;
    var Parser = require_parse();
    var fs = __require2("fs");
    var fsm = require_fs_minipass();
    var path = __require2("path");
    var mkdir = require_mkdir();
    var mkdirSync = mkdir.sync;
    var wc = require_winchars();
    var stripAbsolutePath = require_strip_absolute_path();
    var pathReservations = require_path_reservations();
    var normPath = require_normalize_windows_path();
    var stripSlash = require_strip_trailing_slashes();
    var ONENTRY = Symbol("onEntry");
    var CHECKFS = Symbol("checkFs");
    var CHECKFS2 = Symbol("checkFs2");
    var PRUNECACHE = Symbol("pruneCache");
    var ISREUSABLE = Symbol("isReusable");
    var MAKEFS = Symbol("makeFs");
    var FILE = Symbol("file");
    var DIRECTORY = Symbol("directory");
    var LINK = Symbol("link");
    var SYMLINK = Symbol("symlink");
    var HARDLINK = Symbol("hardlink");
    var UNSUPPORTED = Symbol("unsupported");
    var UNKNOWN = Symbol("unknown");
    var CHECKPATH = Symbol("checkPath");
    var MKDIR = Symbol("mkdir");
    var ONERROR = Symbol("onError");
    var PENDING = Symbol("pending");
    var PEND = Symbol("pend");
    var UNPEND = Symbol("unpend");
    var ENDED = Symbol("ended");
    var MAYBECLOSE = Symbol("maybeClose");
    var SKIP = Symbol("skip");
    var DOCHOWN = Symbol("doChown");
    var UID = Symbol("uid");
    var GID = Symbol("gid");
    var CHECKED_CWD = Symbol("checkedCwd");
    var crypto = __require2("crypto");
    var platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
    var isWindows = platform === "win32";
    var unlinkFile = (path2, cb) => {
      if (!isWindows)
        return fs.unlink(path2, cb);
      const name = path2 + ".DELETE." + crypto.randomBytes(16).toString("hex");
      fs.rename(path2, name, (er) => {
        if (er)
          return cb(er);
        fs.unlink(name, cb);
      });
    };
    var unlinkFileSync = (path2) => {
      if (!isWindows)
        return fs.unlinkSync(path2);
      const name = path2 + ".DELETE." + crypto.randomBytes(16).toString("hex");
      fs.renameSync(path2, name);
      fs.unlinkSync(name);
    };
    var uint32 = (a, b, c) => a === a >>> 0 ? a : b === b >>> 0 ? b : c;
    var cacheKeyNormalize = (path2) => stripSlash(normPath(path2)).normalize("NFKD").toLowerCase();
    var pruneCache = (cache, abs) => {
      abs = cacheKeyNormalize(abs);
      for (const path2 of cache.keys()) {
        const pnorm = cacheKeyNormalize(path2);
        if (pnorm === abs || pnorm.indexOf(abs + "/") === 0)
          cache.delete(path2);
      }
    };
    var dropCache = (cache) => {
      for (const key of cache.keys())
        cache.delete(key);
    };
    var Unpack = class extends Parser {
      constructor(opt) {
        if (!opt)
          opt = {};
        opt.ondone = (_) => {
          this[ENDED] = true;
          this[MAYBECLOSE]();
        };
        super(opt);
        this[CHECKED_CWD] = false;
        this.reservations = pathReservations();
        this.transform = typeof opt.transform === "function" ? opt.transform : null;
        this.writable = true;
        this.readable = false;
        this[PENDING] = 0;
        this[ENDED] = false;
        this.dirCache = opt.dirCache || /* @__PURE__ */ new Map();
        if (typeof opt.uid === "number" || typeof opt.gid === "number") {
          if (typeof opt.uid !== "number" || typeof opt.gid !== "number")
            throw new TypeError("cannot set owner without number uid and gid");
          if (opt.preserveOwner)
            throw new TypeError(
              "cannot preserve owner in archive and also set owner explicitly"
            );
          this.uid = opt.uid;
          this.gid = opt.gid;
          this.setOwner = true;
        } else {
          this.uid = null;
          this.gid = null;
          this.setOwner = false;
        }
        if (opt.preserveOwner === void 0 && typeof opt.uid !== "number")
          this.preserveOwner = process.getuid && process.getuid() === 0;
        else
          this.preserveOwner = !!opt.preserveOwner;
        this.processUid = (this.preserveOwner || this.setOwner) && process.getuid ? process.getuid() : null;
        this.processGid = (this.preserveOwner || this.setOwner) && process.getgid ? process.getgid() : null;
        this.forceChown = opt.forceChown === true;
        this.win32 = !!opt.win32 || isWindows;
        this.newer = !!opt.newer;
        this.keep = !!opt.keep;
        this.noMtime = !!opt.noMtime;
        this.preservePaths = !!opt.preservePaths;
        this.unlink = !!opt.unlink;
        this.cwd = normPath(path.resolve(opt.cwd || process.cwd()));
        this.strip = +opt.strip || 0;
        this.processUmask = process.umask();
        this.umask = typeof opt.umask === "number" ? opt.umask : this.processUmask;
        this.dmode = opt.dmode || 511 & ~this.umask;
        this.fmode = opt.fmode || 438 & ~this.umask;
        this.on("entry", (entry) => this[ONENTRY](entry));
      }
      [MAYBECLOSE]() {
        if (this[ENDED] && this[PENDING] === 0) {
          this.emit("prefinish");
          this.emit("finish");
          this.emit("end");
          this.emit("close");
        }
      }
      [CHECKPATH](entry) {
        if (this.strip) {
          const parts = normPath(entry.path).split("/");
          if (parts.length < this.strip)
            return false;
          entry.path = parts.slice(this.strip).join("/");
          if (entry.type === "Link") {
            const linkparts = normPath(entry.linkpath).split("/");
            if (linkparts.length >= this.strip)
              entry.linkpath = linkparts.slice(this.strip).join("/");
            else
              return false;
          }
        }
        if (!this.preservePaths) {
          const p = normPath(entry.path);
          const parts = p.split("/");
          if (parts.includes("..") || isWindows && /^[a-z]:\.\.$/i.test(parts[0])) {
            this.warn(`path contains '..'`, p);
            return false;
          }
          const s = stripAbsolutePath(p);
          if (s[0]) {
            entry.path = s[1];
            this.warn(`stripping ${s[0]} from absolute path`, p);
          }
        }
        if (path.isAbsolute(entry.path))
          entry.absolute = normPath(path.resolve(entry.path));
        else
          entry.absolute = normPath(path.resolve(this.cwd, entry.path));
        if (!this.preservePaths && entry.absolute.indexOf(this.cwd + "/") !== 0 && entry.absolute !== this.cwd) {
          this.warn("TAR_ENTRY_ERROR", "path escaped extraction target", {
            entry,
            path: normPath(entry.path),
            resolvedPath: entry.absolute,
            cwd: this.cwd
          });
          return false;
        }
        if (entry.absolute === this.cwd && entry.type !== "Directory" && entry.type !== "GNUDumpDir")
          return false;
        if (this.win32) {
          const { root: aRoot } = path.win32.parse(entry.absolute);
          entry.absolute = aRoot + wc.encode(entry.absolute.substr(aRoot.length));
          const { root: pRoot } = path.win32.parse(entry.path);
          entry.path = pRoot + wc.encode(entry.path.substr(pRoot.length));
        }
        return true;
      }
      [ONENTRY](entry) {
        if (!this[CHECKPATH](entry))
          return entry.resume();
        assert.equal(typeof entry.absolute, "string");
        switch (entry.type) {
          case "Directory":
          case "GNUDumpDir":
            if (entry.mode)
              entry.mode = entry.mode | 448;
          case "File":
          case "OldFile":
          case "ContiguousFile":
          case "Link":
          case "SymbolicLink":
            return this[CHECKFS](entry);
          case "CharacterDevice":
          case "BlockDevice":
          case "FIFO":
            return this[UNSUPPORTED](entry);
        }
      }
      [ONERROR](er, entry) {
        if (er.name === "CwdError")
          this.emit("error", er);
        else {
          this.warn(er.message, er);
          this[UNPEND]();
          entry.resume();
        }
      }
      [MKDIR](dir, mode, cb) {
        mkdir(normPath(dir), {
          uid: this.uid,
          gid: this.gid,
          processUid: this.processUid,
          processGid: this.processGid,
          umask: this.processUmask,
          preserve: this.preservePaths,
          unlink: this.unlink,
          cache: this.dirCache,
          cwd: this.cwd,
          mode
        }, cb);
      }
      [DOCHOWN](entry) {
        return this.forceChown || this.preserveOwner && (typeof entry.uid === "number" && entry.uid !== this.processUid || typeof entry.gid === "number" && entry.gid !== this.processGid) || (typeof this.uid === "number" && this.uid !== this.processUid || typeof this.gid === "number" && this.gid !== this.processGid);
      }
      [UID](entry) {
        return uint32(this.uid, entry.uid, this.processUid);
      }
      [GID](entry) {
        return uint32(this.gid, entry.gid, this.processGid);
      }
      [FILE](entry, fullyDone) {
        const mode = entry.mode & 4095 || this.fmode;
        const stream4 = new fsm.WriteStream(entry.absolute, {
          mode,
          autoClose: false
        });
        stream4.on("error", (er) => {
          if (stream4.fd)
            fs.close(stream4.fd, () => {
            });
          stream4.write = () => true;
          this[ONERROR](er, entry);
          fullyDone();
        });
        let actions = 1;
        const done = (er) => {
          if (er) {
            if (stream4.fd)
              fs.close(stream4.fd, () => {
              });
            this[ONERROR](er, entry);
            fullyDone();
            return;
          }
          if (--actions === 0) {
            fs.close(stream4.fd, (er2) => {
              fullyDone();
              er2 ? this[ONERROR](er2, entry) : this[UNPEND]();
            });
          }
        };
        stream4.on("finish", (_) => {
          const abs = entry.absolute;
          const fd = stream4.fd;
          if (entry.mtime && !this.noMtime) {
            actions++;
            const atime = entry.atime || /* @__PURE__ */ new Date();
            const mtime = entry.mtime;
            fs.futimes(fd, atime, mtime, (er) => er ? fs.utimes(abs, atime, mtime, (er2) => done(er2 && er)) : done());
          }
          if (this[DOCHOWN](entry)) {
            actions++;
            const uid = this[UID](entry);
            const gid = this[GID](entry);
            fs.fchown(fd, uid, gid, (er) => er ? fs.chown(abs, uid, gid, (er2) => done(er2 && er)) : done());
          }
          done();
        });
        const tx = this.transform ? this.transform(entry) || entry : entry;
        if (tx !== entry) {
          tx.on("error", (er) => this[ONERROR](er, entry));
          entry.pipe(tx);
        }
        tx.pipe(stream4);
      }
      [DIRECTORY](entry, fullyDone) {
        const mode = entry.mode & 4095 || this.dmode;
        this[MKDIR](entry.absolute, mode, (er) => {
          if (er) {
            fullyDone();
            return this[ONERROR](er, entry);
          }
          let actions = 1;
          const done = (_) => {
            if (--actions === 0) {
              fullyDone();
              this[UNPEND]();
              entry.resume();
            }
          };
          if (entry.mtime && !this.noMtime) {
            actions++;
            fs.utimes(entry.absolute, entry.atime || /* @__PURE__ */ new Date(), entry.mtime, done);
          }
          if (this[DOCHOWN](entry)) {
            actions++;
            fs.chown(entry.absolute, this[UID](entry), this[GID](entry), done);
          }
          done();
        });
      }
      [UNSUPPORTED](entry) {
        this.warn("unsupported entry type: " + entry.type, entry);
        entry.resume();
      }
      [SYMLINK](entry, done) {
        this[LINK](entry, entry.linkpath, "symlink", done);
      }
      [HARDLINK](entry, done) {
        const linkpath = normPath(path.resolve(this.cwd, entry.linkpath));
        this[LINK](entry, linkpath, "link", done);
      }
      [PEND]() {
        this[PENDING]++;
      }
      [UNPEND]() {
        this[PENDING]--;
        this[MAYBECLOSE]();
      }
      [SKIP](entry) {
        this[UNPEND]();
        entry.resume();
      }
      // Check if we can reuse an existing filesystem entry safely and
      // overwrite it, rather than unlinking and recreating
      // Windows doesn't report a useful nlink, so we just never reuse entries
      [ISREUSABLE](entry, st) {
        return entry.type === "File" && !this.unlink && st.isFile() && st.nlink <= 1 && !isWindows;
      }
      // check if a thing is there, and if so, try to clobber it
      [CHECKFS](entry) {
        this[PEND]();
        const paths = [entry.path];
        if (entry.linkpath)
          paths.push(entry.linkpath);
        this.reservations.reserve(paths, (done) => this[CHECKFS2](entry, done));
      }
      [PRUNECACHE](entry) {
        if (entry.type === "SymbolicLink")
          dropCache(this.dirCache);
        else if (entry.type !== "Directory")
          pruneCache(this.dirCache, entry.absolute);
      }
      [CHECKFS2](entry, fullyDone) {
        this[PRUNECACHE](entry);
        const done = (er) => {
          this[PRUNECACHE](entry);
          fullyDone(er);
        };
        const checkCwd = () => {
          this[MKDIR](this.cwd, this.dmode, (er) => {
            if (er) {
              this[ONERROR](er, entry);
              done();
              return;
            }
            this[CHECKED_CWD] = true;
            start();
          });
        };
        const start = () => {
          if (entry.absolute !== this.cwd) {
            const parent = normPath(path.dirname(entry.absolute));
            if (parent !== this.cwd) {
              return this[MKDIR](parent, this.dmode, (er) => {
                if (er) {
                  this[ONERROR](er, entry);
                  done();
                  return;
                }
                afterMakeParent();
              });
            }
          }
          afterMakeParent();
        };
        const afterMakeParent = () => {
          fs.lstat(entry.absolute, (lstatEr, st) => {
            if (st && (this.keep || this.newer && st.mtime > entry.mtime)) {
              this[SKIP](entry);
              done();
              return;
            }
            if (lstatEr || this[ISREUSABLE](entry, st))
              return this[MAKEFS](null, entry, done);
            if (st.isDirectory()) {
              if (entry.type === "Directory") {
                const needChmod = !this.noChmod && entry.mode && (st.mode & 4095) !== entry.mode;
                const afterChmod = (er) => this[MAKEFS](er, entry, done);
                if (!needChmod)
                  return afterChmod();
                return fs.chmod(entry.absolute, entry.mode, afterChmod);
              }
              if (entry.absolute !== this.cwd) {
                return fs.rmdir(entry.absolute, (er) => this[MAKEFS](er, entry, done));
              }
            }
            if (entry.absolute === this.cwd)
              return this[MAKEFS](null, entry, done);
            unlinkFile(entry.absolute, (er) => this[MAKEFS](er, entry, done));
          });
        };
        if (this[CHECKED_CWD])
          start();
        else
          checkCwd();
      }
      [MAKEFS](er, entry, done) {
        if (er)
          return this[ONERROR](er, entry);
        switch (entry.type) {
          case "File":
          case "OldFile":
          case "ContiguousFile":
            return this[FILE](entry, done);
          case "Link":
            return this[HARDLINK](entry, done);
          case "SymbolicLink":
            return this[SYMLINK](entry, done);
          case "Directory":
          case "GNUDumpDir":
            return this[DIRECTORY](entry, done);
        }
      }
      [LINK](entry, linkpath, link, done) {
        fs[link](linkpath, entry.absolute, (er) => {
          if (er)
            return this[ONERROR](er, entry);
          done();
          this[UNPEND]();
          entry.resume();
        });
      }
    };
    var callSync = (fn) => {
      try {
        return [null, fn()];
      } catch (er) {
        return [er, null];
      }
    };
    var UnpackSync = class extends Unpack {
      [MAKEFS](er, entry) {
        return super[MAKEFS](
          er,
          entry,
          /* istanbul ignore next */
          () => {
          }
        );
      }
      [CHECKFS](entry) {
        this[PRUNECACHE](entry);
        if (!this[CHECKED_CWD]) {
          const er2 = this[MKDIR](this.cwd, this.dmode);
          if (er2)
            return this[ONERROR](er2, entry);
          this[CHECKED_CWD] = true;
        }
        if (entry.absolute !== this.cwd) {
          const parent = normPath(path.dirname(entry.absolute));
          if (parent !== this.cwd) {
            const mkParent = this[MKDIR](parent, this.dmode);
            if (mkParent)
              return this[ONERROR](mkParent, entry);
          }
        }
        const [lstatEr, st] = callSync(() => fs.lstatSync(entry.absolute));
        if (st && (this.keep || this.newer && st.mtime > entry.mtime))
          return this[SKIP](entry);
        if (lstatEr || this[ISREUSABLE](entry, st))
          return this[MAKEFS](null, entry);
        if (st.isDirectory()) {
          if (entry.type === "Directory") {
            const needChmod = !this.noChmod && entry.mode && (st.mode & 4095) !== entry.mode;
            const [er3] = needChmod ? callSync(() => {
              fs.chmodSync(entry.absolute, entry.mode);
            }) : [];
            return this[MAKEFS](er3, entry);
          }
          const [er2] = callSync(() => fs.rmdirSync(entry.absolute));
          this[MAKEFS](er2, entry);
        }
        const [er] = entry.absolute === this.cwd ? [] : callSync(() => unlinkFileSync(entry.absolute));
        this[MAKEFS](er, entry);
      }
      [FILE](entry, done) {
        const mode = entry.mode & 4095 || this.fmode;
        const oner = (er) => {
          let closeError;
          try {
            fs.closeSync(fd);
          } catch (e) {
            closeError = e;
          }
          if (er || closeError)
            this[ONERROR](er || closeError, entry);
          done();
        };
        let stream4;
        let fd;
        try {
          fd = fs.openSync(entry.absolute, "w", mode);
        } catch (er) {
          return oner(er);
        }
        const tx = this.transform ? this.transform(entry) || entry : entry;
        if (tx !== entry) {
          tx.on("error", (er) => this[ONERROR](er, entry));
          entry.pipe(tx);
        }
        tx.on("data", (chunk) => {
          try {
            fs.writeSync(fd, chunk, 0, chunk.length);
          } catch (er) {
            oner(er);
          }
        });
        tx.on("end", (_) => {
          let er = null;
          if (entry.mtime && !this.noMtime) {
            const atime = entry.atime || /* @__PURE__ */ new Date();
            const mtime = entry.mtime;
            try {
              fs.futimesSync(fd, atime, mtime);
            } catch (futimeser) {
              try {
                fs.utimesSync(entry.absolute, atime, mtime);
              } catch (utimeser) {
                er = futimeser;
              }
            }
          }
          if (this[DOCHOWN](entry)) {
            const uid = this[UID](entry);
            const gid = this[GID](entry);
            try {
              fs.fchownSync(fd, uid, gid);
            } catch (fchowner) {
              try {
                fs.chownSync(entry.absolute, uid, gid);
              } catch (chowner) {
                er = er || fchowner;
              }
            }
          }
          oner(er);
        });
      }
      [DIRECTORY](entry, done) {
        const mode = entry.mode & 4095 || this.dmode;
        const er = this[MKDIR](entry.absolute, mode);
        if (er) {
          this[ONERROR](er, entry);
          done();
          return;
        }
        if (entry.mtime && !this.noMtime) {
          try {
            fs.utimesSync(entry.absolute, entry.atime || /* @__PURE__ */ new Date(), entry.mtime);
          } catch (er2) {
          }
        }
        if (this[DOCHOWN](entry)) {
          try {
            fs.chownSync(entry.absolute, this[UID](entry), this[GID](entry));
          } catch (er2) {
          }
        }
        done();
        entry.resume();
      }
      [MKDIR](dir, mode) {
        try {
          return mkdir.sync(normPath(dir), {
            uid: this.uid,
            gid: this.gid,
            processUid: this.processUid,
            processGid: this.processGid,
            umask: this.processUmask,
            preserve: this.preservePaths,
            unlink: this.unlink,
            cache: this.dirCache,
            cwd: this.cwd,
            mode
          });
        } catch (er) {
          return er;
        }
      }
      [LINK](entry, linkpath, link, done) {
        try {
          fs[link + "Sync"](linkpath, entry.absolute);
          done();
          entry.resume();
        } catch (er) {
          return this[ONERROR](er, entry);
        }
      }
    };
    Unpack.Sync = UnpackSync;
    module.exports = Unpack;
  }
});
var require_extract = __commonJS({
  "node_modules/tar/lib/extract.js"(exports, module) {
    "use strict";
    var hlo = require_high_level_opt();
    var Unpack = require_unpack();
    var fs = __require2("fs");
    var fsm = require_fs_minipass();
    var path = __require2("path");
    var stripSlash = require_strip_trailing_slashes();
    var x = module.exports = (opt_, files, cb) => {
      if (typeof opt_ === "function")
        cb = opt_, files = null, opt_ = {};
      else if (Array.isArray(opt_))
        files = opt_, opt_ = {};
      if (typeof files === "function")
        cb = files, files = null;
      if (!files)
        files = [];
      else
        files = Array.from(files);
      const opt = hlo(opt_);
      if (opt.sync && typeof cb === "function")
        throw new TypeError("callback not supported for sync tar functions");
      if (!opt.file && typeof cb === "function")
        throw new TypeError("callback only supported with file option");
      if (files.length)
        filesFilter(opt, files);
      return opt.file && opt.sync ? extractFileSync(opt) : opt.file ? extractFile(opt, cb) : opt.sync ? extractSync(opt) : extract(opt);
    };
    var filesFilter = (opt, files) => {
      const map = new Map(files.map((f) => [stripSlash(f), true]));
      const filter2 = opt.filter;
      const mapHas = (file2, r) => {
        const root = r || path.parse(file2).root || ".";
        const ret = file2 === root ? false : map.has(file2) ? map.get(file2) : mapHas(path.dirname(file2), root);
        map.set(file2, ret);
        return ret;
      };
      opt.filter = filter2 ? (file2, entry) => filter2(file2, entry) && mapHas(stripSlash(file2)) : (file2) => mapHas(stripSlash(file2));
    };
    var extractFileSync = (opt) => {
      const u = new Unpack.Sync(opt);
      const file2 = opt.file;
      let threw = true;
      let fd;
      const stat = fs.statSync(file2);
      const readSize = opt.maxReadSize || 16 * 1024 * 1024;
      const stream4 = new fsm.ReadStreamSync(file2, {
        readSize,
        size: stat.size
      });
      stream4.pipe(u);
    };
    var extractFile = (opt, cb) => {
      const u = new Unpack(opt);
      const readSize = opt.maxReadSize || 16 * 1024 * 1024;
      const file2 = opt.file;
      const p = new Promise((resolve, reject) => {
        u.on("error", reject);
        u.on("close", resolve);
        fs.stat(file2, (er, stat) => {
          if (er)
            reject(er);
          else {
            const stream4 = new fsm.ReadStream(file2, {
              readSize,
              size: stat.size
            });
            stream4.on("error", reject);
            stream4.pipe(u);
          }
        });
      });
      return cb ? p.then(cb, cb) : p;
    };
    var extractSync = (opt) => {
      return new Unpack.Sync(opt);
    };
    var extract = (opt) => {
      return new Unpack(opt);
    };
  }
});
var require_tar = __commonJS({
  "node_modules/tar/index.js"(exports) {
    "use strict";
    exports.c = exports.create = require_create();
    exports.r = exports.replace = require_replace();
    exports.t = exports.list = require_list();
    exports.u = exports.update = require_update();
    exports.x = exports.extract = require_extract();
    exports.Pack = require_pack();
    exports.Unpack = require_unpack();
    exports.Parse = require_parse();
    exports.ReadEntry = require_read_entry();
    exports.WriteEntry = require_write_entry();
    exports.Header = require_header();
    exports.Pax = require_pax();
    exports.types = require_types();
  }
});
var require_tfjs_node_lambda = __commonJS({
  "node_modules/tfjs-node-lambda/index.js"(exports, module) {
    var tar = require_tar();
    var fs = __require2("fs");
    var zlib2 = __require2("zlib");
    var path = __require2("path");
    var os = __require2("os");
    var TFJS_PATH = path.join(os.tmpdir(), "tfjs-node");
    var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require2;
    function isLambda() {
      if (process.env.NOW_REGION === "dev1")
        return false;
      return Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
    }
    async function requireTf() {
      const tf2 = requireFunc(TFJS_PATH);
      tf2.disableDeprecationWarnings();
      return tf2;
    }
    async function createTfPromise(readStream2) {
      if (!isLambda()) {
        return requireFunc("@tensorflow/tfjs-node");
      }
      if (fs.existsSync(TFJS_PATH)) {
        return requireTf();
      }
      fs.mkdirSync(TFJS_PATH);
      await new Promise((resolve, reject) => {
        const x = tar.x({ cwd: TFJS_PATH });
        x.on("finish", resolve);
        x.on("error", reject);
        readStream2.pipe(zlib2.createBrotliDecompress()).pipe(x);
      });
      return requireTf();
    }
    var tfPromise;
    module.exports = function loadTf2(readStream2) {
      if (!tfPromise) {
        tfPromise = createTfPromise(readStream2);
      }
      return tfPromise;
    };
  }
});
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
var kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
var isString = typeOfTest("string");
var isFunction = typeOfTest("function");
var isNumber = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype3 = getPrototypeOf(val);
  return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream = (val) => isObject(val) && isFunction(val.pipe);
var isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
var _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
var stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
var inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
var endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i = thing.length;
  if (!isNumber(i))
    return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
var isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
var matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
var toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
var noop = () => {
};
var toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};
var ALPHA = "abcdefghijklmnopqrstuvwxyz";
var DIGIT = "0123456789";
var ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
var generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
var toJSONObject = (obj) => {
  const stack4 = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack4.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack4[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack4[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
var utils_default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}
utils_default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils_default.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
var prototype = AxiosError.prototype;
var descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  utils_default.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error.message, code, config, request, response);
  axiosError.cause = error;
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_default = AxiosError;
var import_form_data = __toESM(require_form_data(), 1);
var FormData_default = import_form_data.default;
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path)
    return key;
  return path.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (FormData_default || FormData)();
  options = utils_default.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils_default.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    }
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack4 = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils_default.isUndefined(value))
      return;
    if (stack4.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack4.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils_default.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack4.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var toFormData_default = toFormData;
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype2 = AxiosURLSearchParams.prototype;
prototype2.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype2.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;
function encode2(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url2, params, options) {
  if (!params) {
    return url2;
  }
  const _encode = options && options.encode || encode2;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
var InterceptorManager = class {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
};
var InterceptorManager_default = InterceptorManager;
var transitional_default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
var URLSearchParams_default = url.URLSearchParams;
var node_default = {
  isNode: true,
  classes: {
    URLSearchParams: URLSearchParams_default,
    FormData: FormData_default,
    Blob: typeof Blob !== "undefined" && Blob || null
  },
  protocols: ["http", "https", "file", "data"]
};
function toURLEncodedForm(data, options) {
  return toFormData_default(data, new node_default.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (node_default.isNode && utils_default.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default = formDataToJSON;
var DEFAULT_CONTENT_TYPE = {
  "Content-Type": void 0
};
function stringifySafely(rawValue, parser, encoder) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
  transitional: transitional_default,
  adapter: ["xhr", "http"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils_default.isObject(data);
    if (isObjectPayload && utils_default.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils_default.isFormData(data);
    if (isFormData2) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
    }
    if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data)) {
      return data;
    }
    if (utils_default.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils_default.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData_default(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: node_default.classes.FormData,
    Blob: node_default.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*"
    }
  }
};
utils_default.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults.headers[method] = utils_default.merge(DEFAULT_CONTENT_TYPE);
});
var defaults_default = defaults;
var ignoreDuplicateOf = utils_default.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
var parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
var $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value))
    return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
var AxiosHeaders = class {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils_default.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders_default(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils_default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils_default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils_default.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils_default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils_default.forEach(this, (value, header) => {
      const key = utils_default.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype3 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype3, _header);
        accessors[lHeader] = true;
      }
    }
    utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils_default.freezeMethods(AxiosHeaders.prototype);
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;
function transformData(fns, response) {
  const config = this || defaults_default;
  const context = response || config;
  const headers = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError(message, config, request) {
  AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, {
  __CANCEL__: true
});
var CanceledError_default = CanceledError;
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError_default(
      "Request failed with status code " + response.status,
      [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
function isAbsoluteURL(url2) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
var import_proxy_from_env = __toESM(require_proxy_from_env(), 1);
var import_follow_redirects = __toESM(require_follow_redirects(), 1);
var VERSION = "1.4.0";
function parseProtocol(url2) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url2);
  return match && match[1] || "";
}
var DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
function fromDataURI(uri, asBlob, options) {
  const _Blob = options && options.Blob || node_default.classes.Blob;
  const protocol = parseProtocol(uri);
  if (asBlob === void 0 && _Blob) {
    asBlob = true;
  }
  if (protocol === "data") {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;
    const match = DATA_URL_PATTERN.exec(uri);
    if (!match) {
      throw new AxiosError_default("Invalid URL", AxiosError_default.ERR_INVALID_URL);
    }
    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? "base64" : "utf8");
    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError_default("Blob is not supported", AxiosError_default.ERR_NOT_SUPPORT);
      }
      return new _Blob([buffer], { type: mime });
    }
    return buffer;
  }
  throw new AxiosError_default("Unsupported protocol " + protocol, AxiosError_default.ERR_NOT_SUPPORT);
}
function throttle(fn, freq) {
  let timestamp = 0;
  const threshold = 1e3 / freq;
  let timer = null;
  return function throttled(force, args) {
    const now = Date.now();
    if (force || now - timestamp > threshold) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timestamp = now;
      return fn.apply(null, args);
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        timestamp = Date.now();
        return fn.apply(null, args);
      }, threshold - (now - timestamp));
    }
  };
}
var throttle_default = throttle;
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
var speedometer_default = speedometer;
var kInternals = Symbol("internals");
var AxiosTransformStream = class extends stream.Transform {
  constructor(options) {
    options = utils_default.toFlatObject(options, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (prop, source) => {
      return !utils_default.isUndefined(source[prop]);
    });
    super({
      readableHighWaterMark: options.chunkSize
    });
    const self2 = this;
    const internals = this[kInternals] = {
      length: options.length,
      timeWindow: options.timeWindow,
      ticksRate: options.ticksRate,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };
    const _speedometer = speedometer_default(internals.ticksRate * options.samplesCount, internals.timeWindow);
    this.on("newListener", (event) => {
      if (event === "progress") {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });
    let bytesNotified = 0;
    internals.updateProgress = throttle_default(function throttledHandler() {
      const totalBytes = internals.length;
      const bytesTransferred = internals.bytesSeen;
      const progressBytes = bytesTransferred - bytesNotified;
      if (!progressBytes || self2.destroyed)
        return;
      const rate = _speedometer(progressBytes);
      bytesNotified = bytesTransferred;
      process.nextTick(() => {
        self2.emit("progress", {
          "loaded": bytesTransferred,
          "total": totalBytes,
          "progress": totalBytes ? bytesTransferred / totalBytes : void 0,
          "bytes": progressBytes,
          "rate": rate ? rate : void 0,
          "estimated": rate && totalBytes && bytesTransferred <= totalBytes ? (totalBytes - bytesTransferred) / rate : void 0
        });
      });
    }, internals.ticksRate);
    const onFinish = () => {
      internals.updateProgress(true);
    };
    this.once("end", onFinish);
    this.once("error", onFinish);
  }
  _read(size) {
    const internals = this[kInternals];
    if (internals.onReadCallback) {
      internals.onReadCallback();
    }
    return super._read(size);
  }
  _transform(chunk, encoding, callback) {
    const self2 = this;
    const internals = this[kInternals];
    const maxRate = internals.maxRate;
    const readableHighWaterMark = this.readableHighWaterMark;
    const timeWindow = internals.timeWindow;
    const divider = 1e3 / timeWindow;
    const bytesThreshold = maxRate / divider;
    const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;
    function pushChunk(_chunk, _callback) {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;
      if (internals.isCaptured) {
        internals.updateProgress();
      }
      if (self2.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    }
    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;
      if (maxRate) {
        const now = Date.now();
        if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }
        bytesLeft = bytesThreshold - internals.bytes;
      }
      if (maxRate) {
        if (bytesLeft <= 0) {
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }
        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }
      if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }
      pushChunk(_chunk, chunkRemainder ? () => {
        process.nextTick(_callback, null, chunkRemainder);
      } : _callback);
    };
    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }
      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }
  setLength(length) {
    this[kInternals].length = +length;
    return this;
  }
};
var AxiosTransformStream_default = AxiosTransformStream;
var { asyncIterator } = Symbol;
var readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};
var readBlob_default = readBlob;
var BOUNDARY_ALPHABET = utils_default.ALPHABET.ALPHA_DIGIT + "-_";
var textEncoder = new TextEncoder();
var CRLF = "\r\n";
var CRLF_BYTES = textEncoder.encode(CRLF);
var CRLF_BYTES_COUNT = 2;
var FormDataPart = class {
  constructor(name, value) {
    const { escapeName } = this.constructor;
    const isStringValue = utils_default.isString(value);
    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
    }
    this.headers = textEncoder.encode(headers + CRLF);
    this.contentLength = isStringValue ? value.byteLength : value.size;
    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
    this.name = name;
    this.value = value;
  }
  async *encode() {
    yield this.headers;
    const { value } = this;
    if (utils_default.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob_default(value);
    }
    yield CRLF_BYTES;
  }
  static escapeName(name) {
    return String(name).replace(/[\r\n"]/g, (match) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[match]);
  }
};
var formDataToStream = (form, headersHandler, options) => {
  const {
    tag = "form-data-boundary",
    size = 25,
    boundary = tag + "-" + utils_default.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};
  if (!utils_default.isFormData(form)) {
    throw TypeError("FormData instance required");
  }
  if (boundary.length < 1 || boundary.length > 70) {
    throw Error("boundary must be 10-70 characters long");
  }
  const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
  const footerBytes = textEncoder.encode("--" + boundary + "--" + CRLF + CRLF);
  let contentLength = footerBytes.byteLength;
  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });
  contentLength += boundaryBytes.byteLength * parts.length;
  contentLength = utils_default.toFiniteNumber(contentLength);
  const computedHeaders = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`
  };
  if (Number.isFinite(contentLength)) {
    computedHeaders["Content-Length"] = contentLength;
  }
  headersHandler && headersHandler(computedHeaders);
  return Readable.from(async function* () {
    for (const part of parts) {
      yield boundaryBytes;
      yield* part.encode();
    }
    yield footerBytes;
  }());
};
var formDataToStream_default = formDataToStream;
var ZlibHeaderTransformStream = class extends stream2.Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }
  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;
      if (chunk[0] !== 120) {
        const header = Buffer.alloc(2);
        header[0] = 120;
        header[1] = 156;
        this.push(header, encoding);
      }
    }
    this.__transform(chunk, encoding, callback);
  }
};
var ZlibHeaderTransformStream_default = ZlibHeaderTransformStream;
var callbackify = (fn, reducer) => {
  return utils_default.isAsyncFn(fn) ? function(...args) {
    const cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
};
var callbackify_default = callbackify;
var zlibOptions = {
  flush: zlib.constants.Z_SYNC_FLUSH,
  finishFlush: zlib.constants.Z_SYNC_FLUSH
};
var brotliOptions = {
  flush: zlib.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
};
var isBrotliSupported = utils_default.isFunction(zlib.createBrotliDecompress);
var { http: httpFollow, https: httpsFollow } = import_follow_redirects.default;
var isHttps = /https:?/;
var supportedProtocols = node_default.protocols.map((protocol) => {
  return protocol + ":";
});
function dispatchBeforeRedirect(options) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options);
  }
}
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = (0, import_proxy_from_env.getProxyForUrl)(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    if (proxy.username) {
      proxy.auth = (proxy.username || "") + ":" + (proxy.password || "");
    }
    if (proxy.auth) {
      if (proxy.auth.username || proxy.auth.password) {
        proxy.auth = (proxy.auth.username || "") + ":" + (proxy.auth.password || "");
      }
      const base64 = Buffer.from(proxy.auth, "utf8").toString("base64");
      options.headers["Proxy-Authorization"] = "Basic " + base64;
    }
    options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(":") ? proxy.protocol : `${proxy.protocol}:`;
    }
  }
  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}
var isHttpAdapterSupported = typeof process !== "undefined" && utils_default.kindOf(process) === "process";
var wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;
    const done = (value, isRejected) => {
      if (isDone)
        return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };
    const _resolve = (value) => {
      done(value);
      resolve(value);
    };
    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };
    asyncExecutor(_resolve, _reject, (onDoneHandler) => onDone = onDoneHandler).catch(_reject);
  });
};
var http_default = isHttpAdapterSupported && function httpAdapter(config) {
  return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
    let { data, lookup, family } = config;
    const { responseType, responseEncoding } = config;
    const method = config.method.toUpperCase();
    let isDone;
    let rejected = false;
    let req;
    if (lookup && utils_default.isAsyncFn(lookup)) {
      lookup = callbackify_default(lookup, (entry) => {
        if (utils_default.isString(entry)) {
          entry = [entry, entry.indexOf(".") < 0 ? 6 : 4];
        } else if (!utils_default.isArray(entry)) {
          throw new TypeError("lookup async function must return an array [ip: string, family: number]]");
        }
        return entry;
      });
    }
    const emitter = new EventEmitter();
    const onFinished = () => {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(abort);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", abort);
      }
      emitter.removeAllListeners();
    };
    onDone((value, isRejected) => {
      isDone = true;
      if (isRejected) {
        rejected = true;
        onFinished();
      }
    });
    function abort(reason) {
      emitter.emit("abort", !reason || reason.type ? new CanceledError_default(null, config, req) : reason);
    }
    emitter.once("abort", reject);
    if (config.cancelToken || config.signal) {
      config.cancelToken && config.cancelToken.subscribe(abort);
      if (config.signal) {
        config.signal.aborted ? abort() : config.signal.addEventListener("abort", abort);
      }
    }
    const fullPath = buildFullPath(config.baseURL, config.url);
    const parsed = new URL(fullPath, "http://localhost");
    const protocol = parsed.protocol || supportedProtocols[0];
    if (protocol === "data:") {
      let convertedData;
      if (method !== "GET") {
        return settle(resolve, reject, {
          status: 405,
          statusText: "method not allowed",
          headers: {},
          config
        });
      }
      try {
        convertedData = fromDataURI(config.url, responseType === "blob", {
          Blob: config.env && config.env.Blob
        });
      } catch (err) {
        throw AxiosError_default.from(err, AxiosError_default.ERR_BAD_REQUEST, config);
      }
      if (responseType === "text") {
        convertedData = convertedData.toString(responseEncoding);
        if (!responseEncoding || responseEncoding === "utf8") {
          convertedData = utils_default.stripBOM(convertedData);
        }
      } else if (responseType === "stream") {
        convertedData = stream3.Readable.from(convertedData);
      }
      return settle(resolve, reject, {
        data: convertedData,
        status: 200,
        statusText: "OK",
        headers: new AxiosHeaders_default(),
        config
      });
    }
    if (supportedProtocols.indexOf(protocol) === -1) {
      return reject(new AxiosError_default(
        "Unsupported protocol " + protocol,
        AxiosError_default.ERR_BAD_REQUEST,
        config
      ));
    }
    const headers = AxiosHeaders_default.from(config.headers).normalize();
    headers.set("User-Agent", "axios/" + VERSION, false);
    const onDownloadProgress = config.onDownloadProgress;
    const onUploadProgress = config.onUploadProgress;
    const maxRate = config.maxRate;
    let maxUploadRate = void 0;
    let maxDownloadRate = void 0;
    if (utils_default.isSpecCompliantForm(data)) {
      const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
      data = formDataToStream_default(data, (formHeaders) => {
        headers.set(formHeaders);
      }, {
        tag: `axios-${VERSION}-boundary`,
        boundary: userBoundary && userBoundary[1] || void 0
      });
    } else if (utils_default.isFormData(data) && utils_default.isFunction(data.getHeaders)) {
      headers.set(data.getHeaders());
      if (!headers.hasContentLength()) {
        try {
          const knownLength = await util.promisify(data.getLength).call(data);
          Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
        } catch (e) {
        }
      }
    } else if (utils_default.isBlob(data)) {
      data.size && headers.setContentType(data.type || "application/octet-stream");
      headers.setContentLength(data.size || 0);
      data = stream3.Readable.from(readBlob_default(data));
    } else if (data && !utils_default.isStream(data)) {
      if (Buffer.isBuffer(data)) {
      } else if (utils_default.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils_default.isString(data)) {
        data = Buffer.from(data, "utf-8");
      } else {
        return reject(new AxiosError_default(
          "Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
          AxiosError_default.ERR_BAD_REQUEST,
          config
        ));
      }
      headers.setContentLength(data.length, false);
      if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
        return reject(new AxiosError_default(
          "Request body larger than maxBodyLength limit",
          AxiosError_default.ERR_BAD_REQUEST,
          config
        ));
      }
    }
    const contentLength = utils_default.toFiniteNumber(headers.getContentLength());
    if (utils_default.isArray(maxRate)) {
      maxUploadRate = maxRate[0];
      maxDownloadRate = maxRate[1];
    } else {
      maxUploadRate = maxDownloadRate = maxRate;
    }
    if (data && (onUploadProgress || maxUploadRate)) {
      if (!utils_default.isStream(data)) {
        data = stream3.Readable.from(data, { objectMode: false });
      }
      data = stream3.pipeline([data, new AxiosTransformStream_default({
        length: contentLength,
        maxRate: utils_default.toFiniteNumber(maxUploadRate)
      })], utils_default.noop);
      onUploadProgress && data.on("progress", (progress) => {
        onUploadProgress(Object.assign(progress, {
          upload: true
        }));
      });
    }
    let auth = void 0;
    if (config.auth) {
      const username = config.auth.username || "";
      const password = config.auth.password || "";
      auth = username + ":" + password;
    }
    if (!auth && parsed.username) {
      const urlUsername = parsed.username;
      const urlPassword = parsed.password;
      auth = urlUsername + ":" + urlPassword;
    }
    auth && headers.delete("authorization");
    let path;
    try {
      path = buildURL(
        parsed.pathname + parsed.search,
        config.params,
        config.paramsSerializer
      ).replace(/^\?/, "");
    } catch (err) {
      const customErr = new Error(err.message);
      customErr.config = config;
      customErr.url = config.url;
      customErr.exists = true;
      return reject(customErr);
    }
    headers.set(
      "Accept-Encoding",
      "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""),
      false
    );
    const options = {
      path,
      method,
      headers: headers.toJSON(),
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth,
      protocol,
      family,
      lookup,
      beforeRedirect: dispatchBeforeRedirect,
      beforeRedirects: {}
    };
    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
      setProxy(options, config.proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
    }
    let transport;
    const isHttpsRequest = isHttps.test(options.protocol);
    options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsRequest ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      if (config.beforeRedirect) {
        options.beforeRedirects.config = config.beforeRedirect;
      }
      transport = isHttpsRequest ? httpsFollow : httpFollow;
    }
    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    } else {
      options.maxBodyLength = Infinity;
    }
    if (config.insecureHTTPParser) {
      options.insecureHTTPParser = config.insecureHTTPParser;
    }
    req = transport.request(options, function handleResponse(res) {
      if (req.destroyed)
        return;
      const streams = [res];
      const responseLength = +res.headers["content-length"];
      if (onDownloadProgress) {
        const transformStream = new AxiosTransformStream_default({
          length: utils_default.toFiniteNumber(responseLength),
          maxRate: utils_default.toFiniteNumber(maxDownloadRate)
        });
        onDownloadProgress && transformStream.on("progress", (progress) => {
          onDownloadProgress(Object.assign(progress, {
            download: true
          }));
        });
        streams.push(transformStream);
      }
      let responseStream = res;
      const lastRequest = res.req || req;
      if (config.decompress !== false && res.headers["content-encoding"]) {
        if (method === "HEAD" || res.statusCode === 204) {
          delete res.headers["content-encoding"];
        }
        switch (res.headers["content-encoding"]) {
          case "gzip":
          case "x-gzip":
          case "compress":
          case "x-compress":
            streams.push(zlib.createUnzip(zlibOptions));
            delete res.headers["content-encoding"];
            break;
          case "deflate":
            streams.push(new ZlibHeaderTransformStream_default());
            streams.push(zlib.createUnzip(zlibOptions));
            delete res.headers["content-encoding"];
            break;
          case "br":
            if (isBrotliSupported) {
              streams.push(zlib.createBrotliDecompress(brotliOptions));
              delete res.headers["content-encoding"];
            }
        }
      }
      responseStream = streams.length > 1 ? stream3.pipeline(streams, utils_default.noop) : streams[0];
      const offListeners = stream3.finished(responseStream, () => {
        offListeners();
        onFinished();
      });
      const response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: new AxiosHeaders_default(res.headers),
        config,
        request: lastRequest
      };
      if (responseType === "stream") {
        response.data = responseStream;
        settle(resolve, reject, response);
      } else {
        const responseBuffer = [];
        let totalResponseBytes = 0;
        responseStream.on("data", function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            rejected = true;
            responseStream.destroy();
            reject(new AxiosError_default(
              "maxContentLength size of " + config.maxContentLength + " exceeded",
              AxiosError_default.ERR_BAD_RESPONSE,
              config,
              lastRequest
            ));
          }
        });
        responseStream.on("aborted", function handlerStreamAborted() {
          if (rejected) {
            return;
          }
          const err = new AxiosError_default(
            "maxContentLength size of " + config.maxContentLength + " exceeded",
            AxiosError_default.ERR_BAD_RESPONSE,
            config,
            lastRequest
          );
          responseStream.destroy(err);
          reject(err);
        });
        responseStream.on("error", function handleStreamError(err) {
          if (req.destroyed)
            return;
          reject(AxiosError_default.from(err, null, config, lastRequest));
        });
        responseStream.on("end", function handleStreamEnd() {
          try {
            let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (responseType !== "arraybuffer") {
              responseData = responseData.toString(responseEncoding);
              if (!responseEncoding || responseEncoding === "utf8") {
                responseData = utils_default.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            reject(AxiosError_default.from(err, null, config, response.request, response));
          }
          settle(resolve, reject, response);
        });
      }
      emitter.once("abort", (err) => {
        if (!responseStream.destroyed) {
          responseStream.emit("error", err);
          responseStream.destroy();
        }
      });
    });
    emitter.once("abort", (err) => {
      reject(err);
      req.destroy(err);
    });
    req.on("error", function handleRequestError(err) {
      reject(AxiosError_default.from(err, null, config, req));
    });
    req.on("socket", function handleRequestSocket(socket) {
      socket.setKeepAlive(true, 1e3 * 60);
    });
    if (config.timeout) {
      const timeout = parseInt(config.timeout, 10);
      if (isNaN(timeout)) {
        reject(new AxiosError_default(
          "error trying to parse `config.timeout` to int",
          AxiosError_default.ERR_BAD_OPTION_VALUE,
          config,
          req
        ));
        return;
      }
      req.setTimeout(timeout, function handleRequestTimeout() {
        if (isDone)
          return;
        let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = config.transitional || transitional_default;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(new AxiosError_default(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
          config,
          req
        ));
        abort();
      });
    }
    if (utils_default.isStream(data)) {
      let ended = false;
      let errored = false;
      data.on("end", () => {
        ended = true;
      });
      data.once("error", (err) => {
        errored = true;
        req.destroy(err);
      });
      data.on("close", () => {
        if (!ended && !errored) {
          abort(new CanceledError_default("Request stream has been aborted", config, req));
        }
      });
      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};
var cookies_default = node_default.isStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils_default.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils_default.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils_default.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }()
) : (
  // Non standard browser env (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove() {
      }
    };
  }()
);
var isURLSameOrigin_default = node_default.isStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv2() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    function resolveURL(url2) {
      let href = url2;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin(requestURL) {
      const parsed = utils_default.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv2() {
    return function isURLSameOrigin() {
      return true;
    };
  }()
);
function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return (e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  };
}
var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
var xhr_default = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders_default.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }
    if (utils_default.isFormData(requestData)) {
      if (node_default.isStandardBrowserEnv || node_default.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false);
      } else {
        requestHeaders.setContentType("multipart/form-data;", false);
      }
    }
    let request = new XMLHttpRequest();
    if (config.auth) {
      const username = config.auth.username || "";
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
      requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
    }
    const fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    request.timeout = config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders_default.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = config.transitional || transitional_default;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError_default(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    if (node_default.isStandardBrowserEnv) {
      const xsrfValue = (config.withCredentials || isURLSameOrigin_default(fullPath)) && config.xsrfCookieName && cookies_default.read(config.xsrfCookieName);
      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils_default.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = config.responseType;
    }
    if (typeof config.onDownloadProgress === "function") {
      request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
    }
    if (typeof config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
    }
    if (config.cancelToken || config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(fullPath);
    if (protocol && node_default.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};
var knownAdapters = {
  http: http_default,
  xhr: xhr_default
};
utils_default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
var adapters_default = {
  getAdapter: (adapters) => {
    adapters = utils_default.isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;
    let nameOrAdapter;
    let adapter;
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if (adapter = utils_default.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter) {
        break;
      }
    }
    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError_default(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          "ERR_NOT_SUPPORT"
        );
      }
      throw new Error(
        utils_default.hasOwnProp(knownAdapters, nameOrAdapter) ? `Adapter '${nameOrAdapter}' is not available in the build` : `Unknown adapter '${nameOrAdapter}'`
      );
    }
    if (!utils_default.isFunction(adapter)) {
      throw new TypeError("adapter is not a function");
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError_default(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders_default.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters_default.getAdapter(config.adapter || defaults_default.adapter);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders_default.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? thing.toJSON() : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils_default.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
var validators = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators.transitional = function transitional(validator, version72, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError_default(
        formatMessage(opt, " has been removed" + (version72 ? " in " + version72 : "")),
        AxiosError_default.ERR_DEPRECATED
      );
    }
    if (version72 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version72 + " and will be removed in the near future"
        )
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
    }
  }
}
var validator_default = {
  assertOptions,
  validators
};
var validators2 = validator_default.validators;
var Axios = class {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_default(),
      response: new InterceptorManager_default()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator_default.assertOptions(transitional2, {
        silentJSONParsing: validators2.transitional(validators2.boolean),
        forcedJSONParsing: validators2.transitional(validators2.boolean),
        clarifyTimeoutError: validators2.transitional(validators2.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator_default.assertOptions(paramsSerializer, {
          encode: validators2.function,
          serialize: validators2.function
        }, true);
      }
    }
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders;
    contextHeaders = headers && utils_default.merge(
      headers.common,
      headers[config.method]
    );
    contextHeaders && utils_default.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {
  Axios.prototype[method] = function(url2, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url: url2,
      data: (config || {}).data
    }));
  };
});
utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url2, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: url2,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
var Axios_default = Axios;
var CancelToken = class {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
var CancelToken_default = CancelToken;
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}
var HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;
var {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel: isCancel2,
  CancelToken: CancelToken2,
  VERSION: VERSION2,
  all: all2,
  Cancel,
  isAxiosError: isAxiosError2,
  spread: spread2,
  toFormData: toFormData2,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode: HttpStatusCode2,
  formToJSON,
  mergeConfig: mergeConfig2
} = axios_default;
var import_tfjs_node_lambda = __toESM(require_tfjs_node_lambda(), 1);
var version = "4.9.0";
var version2 = "4.9.0";
var version3 = "4.9.0";
var version4 = "4.9.0";
var version5 = "4.9.0";
var version6 = {
  // tfjs: tfjsVersion,
  tfjs: version,
  "tfjs-core": version,
  // 'tfjs-data': tfjsDataVersion,
  // 'tfjs-layers': tfjsLayersVersion,
  "tfjs-converter": version2,
  "tfjs-backend-cpu": version3,
  "tfjs-backend-webgl": version4,
  "tfjs-backend-wasm": version5
};
var downloadFile = async (url2) => {
  const req = await axios_default.get(
    url2,
    { responseType: "arraybuffer" }
  );
  return req.data;
};
var file = await downloadFile("https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.10/nodejs12.x-tf2.8.6.br");
var readStream = Readable2.from(file);
var tf = await (0, import_tfjs_node_lambda.default)(readStream);
var tf_node_default = tf;

// src/draw/index.ts
var draw_exports = {};
__export(draw_exports, {
  AnchorPosition: () => AnchorPosition,
  DrawBox: () => DrawBox,
  DrawBoxOptions: () => DrawBoxOptions,
  DrawFaceLandmarks: () => DrawFaceLandmarks,
  DrawFaceLandmarksOptions: () => DrawFaceLandmarksOptions,
  DrawTextField: () => DrawTextField,
  DrawTextFieldOptions: () => DrawTextFieldOptions,
  drawContour: () => drawContour,
  drawDetections: () => drawDetections,
  drawFaceExpressions: () => drawFaceExpressions,
  drawFaceLandmarks: () => drawFaceLandmarks
});

// src/draw/drawContour.ts
function drawContour(ctx, points, isClosed = false) {
  ctx.beginPath();
  points.slice(1).forEach(({ x, y }, prevIdx) => {
    const from = points[prevIdx];
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
  });
  if (isClosed) {
    const from = points[points.length - 1];
    const to = points[0];
    if (!from || !to) {
      return;
    }
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
  }
  ctx.stroke();
}

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  computeReshapedDimensions: () => computeReshapedDimensions,
  getCenterPoint: () => getCenterPoint,
  isDimensions: () => isDimensions,
  isEven: () => isEven,
  isFloat: () => isFloat,
  isTensor: () => isTensor,
  isTensor1D: () => isTensor1D,
  isTensor2D: () => isTensor2D,
  isTensor3D: () => isTensor3D,
  isTensor4D: () => isTensor4D,
  isValidNumber: () => isValidNumber,
  isValidProbablitiy: () => isValidProbablitiy,
  range: () => range,
  round: () => round
});

// src/classes/Dimensions.ts
var Dimensions = class {
  _width;
  _height;
  constructor(width, height) {
    if (!isValidNumber(width) || !isValidNumber(height)) {
      throw new Error(`Dimensions.constructor - expected width and height to be valid numbers, instead have ${JSON.stringify({ width, height })}`);
    }
    this._width = width;
    this._height = height;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  reverse() {
    return new Dimensions(1 / this.width, 1 / this.height);
  }
};

// src/utils/index.ts
function isTensor(tensor2, dim) {
  return tensor2 instanceof void 0 && tensor2.shape.length === dim;
}
function isTensor1D(tensor2) {
  return isTensor(tensor2, 1);
}
function isTensor2D(tensor2) {
  return isTensor(tensor2, 2);
}
function isTensor3D(tensor2) {
  return isTensor(tensor2, 3);
}
function isTensor4D(tensor2) {
  return isTensor(tensor2, 4);
}
function isFloat(num) {
  return num % 1 !== 0;
}
function isEven(num) {
  return num % 2 === 0;
}
function round(num, prec = 2) {
  const f = 10 ** prec;
  return Math.floor(num * f) / f;
}
function isDimensions(obj) {
  return obj && obj.width && obj.height;
}
function computeReshapedDimensions({ width, height }, inputSize) {
  const scale2 = inputSize / Math.max(height, width);
  return new Dimensions(Math.round(width * scale2), Math.round(height * scale2));
}
function getCenterPoint(pts) {
  return pts.reduce((sum, pt) => sum.add(pt), new Point(0, 0)).div(new Point(pts.length, pts.length));
}
function range(num, start, step) {
  return Array(num).fill(0).map((_, i) => start + i * step);
}
function isValidNumber(num) {
  return !!num && num !== Infinity && num !== -Infinity && !Number.isNaN(num) || num === 0;
}
function isValidProbablitiy(num) {
  return isValidNumber(num) && num >= 0 && num <= 1;
}

// src/classes/Point.ts
var Point = class {
  _x;
  _y;
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  add(pt) {
    return new Point(this.x + pt.x, this.y + pt.y);
  }
  sub(pt) {
    return new Point(this.x - pt.x, this.y - pt.y);
  }
  mul(pt) {
    return new Point(this.x * pt.x, this.y * pt.y);
  }
  div(pt) {
    return new Point(this.x / pt.x, this.y / pt.y);
  }
  abs() {
    return new Point(Math.abs(this.x), Math.abs(this.y));
  }
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  floor() {
    return new Point(Math.floor(this.x), Math.floor(this.y));
  }
};

// src/classes/Box.ts
var Box = class {
  static isRect(rect) {
    return !!rect && [rect.x, rect.y, rect.width, rect.height].every(isValidNumber);
  }
  static assertIsValidBox(box, callee, allowNegativeDimensions = false) {
    if (!Box.isRect(box)) {
      throw new Error(`${callee} - invalid box: ${JSON.stringify(box)}, expected object with properties x, y, width, height`);
    }
    if (!allowNegativeDimensions && (box.width < 0 || box.height < 0)) {
      throw new Error(`${callee} - width (${box.width}) and height (${box.height}) must be positive numbers`);
    }
  }
  _x;
  _y;
  _width;
  _height;
  constructor(_box, allowNegativeDimensions = true) {
    const box = _box || {};
    const isBbox = [box.left, box.top, box.right, box.bottom].every(isValidNumber);
    const isRect = [box.x, box.y, box.width, box.height].every(isValidNumber);
    if (!isRect && !isBbox) {
      throw new Error(`Box.constructor - expected box to be IBoundingBox | IRect, instead have ${JSON.stringify(box)}`);
    }
    const [x, y, width, height] = isRect ? [box.x, box.y, box.width, box.height] : [box.left, box.top, box.right - box.left, box.bottom - box.top];
    Box.assertIsValidBox({
      x,
      y,
      width,
      height
    }, "Box.constructor", allowNegativeDimensions);
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get left() {
    return this.x;
  }
  get top() {
    return this.y;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  get area() {
    return this.width * this.height;
  }
  get topLeft() {
    return new Point(this.left, this.top);
  }
  get topRight() {
    return new Point(this.right, this.top);
  }
  get bottomLeft() {
    return new Point(this.left, this.bottom);
  }
  get bottomRight() {
    return new Point(this.right, this.bottom);
  }
  round() {
    const [x, y, width, height] = [this.x, this.y, this.width, this.height].map((val) => Math.round(val));
    return new Box({
      x,
      y,
      width,
      height
    });
  }
  floor() {
    const [x, y, width, height] = [this.x, this.y, this.width, this.height].map((val) => Math.floor(val));
    return new Box({
      x,
      y,
      width,
      height
    });
  }
  toSquare() {
    let {
      x,
      y,
      width,
      height
    } = this;
    const diff = Math.abs(width - height);
    if (width < height) {
      x -= diff / 2;
      width += diff;
    }
    if (height < width) {
      y -= diff / 2;
      height += diff;
    }
    return new Box({ x, y, width, height });
  }
  rescale(s) {
    const scaleX = isDimensions(s) ? s.width : s;
    const scaleY = isDimensions(s) ? s.height : s;
    return new Box({
      x: this.x * scaleX,
      y: this.y * scaleY,
      width: this.width * scaleX,
      height: this.height * scaleY
    });
  }
  pad(padX, padY) {
    const [x, y, width, height] = [
      this.x - padX / 2,
      this.y - padY / 2,
      this.width + padX,
      this.height + padY
    ];
    return new Box({ x, y, width, height });
  }
  clipAtImageBorders(imgWidth, imgHeight) {
    const { x, y, right, bottom } = this;
    const clippedX = Math.max(x, 0);
    const clippedY = Math.max(y, 0);
    const newWidth = right - clippedX;
    const newHeight = bottom - clippedY;
    const clippedWidth = Math.min(newWidth, imgWidth - clippedX);
    const clippedHeight = Math.min(newHeight, imgHeight - clippedY);
    return new Box({ x: clippedX, y: clippedY, width: clippedWidth, height: clippedHeight }).floor();
  }
  shift(sx, sy) {
    const { width, height } = this;
    const x = this.x + sx;
    const y = this.y + sy;
    return new Box({ x, y, width, height });
  }
  padAtBorders(imageHeight, imageWidth) {
    const w = this.width + 1;
    const h = this.height + 1;
    const dx = 1;
    const dy = 1;
    let edx = w;
    let edy = h;
    let x = this.left;
    let y = this.top;
    let ex = this.right;
    let ey = this.bottom;
    if (ex > imageWidth) {
      edx = -ex + imageWidth + w;
      ex = imageWidth;
    }
    if (ey > imageHeight) {
      edy = -ey + imageHeight + h;
      ey = imageHeight;
    }
    if (x < 1) {
      edy = 2 - x;
      x = 1;
    }
    if (y < 1) {
      edy = 2 - y;
      y = 1;
    }
    return { dy, edy, dx, edx, y, ey, x, ex, w, h };
  }
  calibrate(region) {
    return new Box({
      left: this.left + region.left * this.width,
      top: this.top + region.top * this.height,
      right: this.right + region.right * this.width,
      bottom: this.bottom + region.bottom * this.height
    }).toSquare().round();
  }
};

// src/classes/BoundingBox.ts
var BoundingBox = class extends Box {
  constructor(left, top, right, bottom, allowNegativeDimensions = false) {
    super({ left, top, right, bottom }, allowNegativeDimensions);
  }
};

// src/classes/ObjectDetection.ts
var ObjectDetection = class {
  _score;
  _classScore;
  _className;
  _box;
  _imageDims;
  constructor(score, classScore, className, relativeBox, imageDims) {
    this._imageDims = new Dimensions(imageDims.width, imageDims.height);
    this._score = score;
    this._classScore = classScore;
    this._className = className;
    this._box = new Box(relativeBox).rescale(this._imageDims);
  }
  get score() {
    return this._score;
  }
  get classScore() {
    return this._classScore;
  }
  get className() {
    return this._className;
  }
  get box() {
    return this._box;
  }
  get imageDims() {
    return this._imageDims;
  }
  get imageWidth() {
    return this.imageDims.width;
  }
  get imageHeight() {
    return this.imageDims.height;
  }
  get relativeBox() {
    return new Box(this._box).rescale(this.imageDims.reverse());
  }
  forSize(width, height) {
    return new ObjectDetection(
      this.score,
      this.classScore,
      this.className,
      this.relativeBox,
      { width, height }
    );
  }
};

// src/classes/FaceDetection.ts
var FaceDetection = class extends ObjectDetection {
  constructor(score, relativeBox, imageDims) {
    super(score, score, "", relativeBox, imageDims);
  }
  forSize(width, height) {
    const { score, relativeBox, imageDims } = super.forSize(width, height);
    return new FaceDetection(score, relativeBox, imageDims);
  }
};

// src/ops/iou.ts
function iou(box1, box2, isIOU = true) {
  const width = Math.max(0, Math.min(box1.right, box2.right) - Math.max(box1.left, box2.left));
  const height = Math.max(0, Math.min(box1.bottom, box2.bottom) - Math.max(box1.top, box2.top));
  const interSection = width * height;
  return isIOU ? interSection / (box1.area + box2.area - interSection) : interSection / Math.min(box1.area, box2.area);
}

// src/ops/minBbox.ts
function minBbox(pts) {
  const xs = pts.map((pt) => pt.x);
  const ys = pts.map((pt) => pt.y);
  const minX = xs.reduce((min, x) => x < min ? x : min, Infinity);
  const minY = ys.reduce((min, y) => y < min ? y : min, Infinity);
  const maxX = xs.reduce((max, x) => max < x ? x : max, 0);
  const maxY = ys.reduce((max, y) => max < y ? y : max, 0);
  return new BoundingBox(minX, minY, maxX, maxY);
}

// src/ops/nonMaxSuppression.ts
function nonMaxSuppression(boxes, scores, iouThreshold, isIOU = true) {
  let indicesSortedByScore = scores.map((score, boxIndex) => ({ score, boxIndex })).sort((c1, c2) => c1.score - c2.score).map((c) => c.boxIndex);
  const pick = [];
  while (indicesSortedByScore.length > 0) {
    const curr = indicesSortedByScore.pop();
    pick.push(curr);
    const indices = indicesSortedByScore;
    const outputs = [];
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const currBox = boxes[curr];
      const idxBox = boxes[idx];
      outputs.push(iou(currBox, idxBox, isIOU));
    }
    indicesSortedByScore = indicesSortedByScore.filter(
      (_, j) => outputs[j] <= iouThreshold
    );
  }
  return pick;
}

// src/ops/normalize.ts
function normalize(x, meanRgb) {
  return (void 0)(() => {
    const [r, g, b] = meanRgb;
    const avg_r = (void 0)([...x.shape.slice(0, 3), 1], r, "float32");
    const avg_g = (void 0)([...x.shape.slice(0, 3), 1], g, "float32");
    const avg_b = (void 0)([...x.shape.slice(0, 3), 1], b, "float32");
    const avg_rgb = (void 0)([avg_r, avg_g, avg_b], 3);
    return (void 0)(x, avg_rgb);
  });
}

// src/ops/padToSquare.ts
function padToSquare(imgTensor, isCenterImage = false) {
  return (void 0)(() => {
    const [height, width] = imgTensor.shape.slice(1);
    if (height === width)
      return imgTensor;
    const dimDiff = Math.abs(height - width);
    const paddingAmount = Math.round(dimDiff * (isCenterImage ? 0.5 : 1));
    const paddingAxis = height > width ? 2 : 1;
    const createPaddingTensor = (paddingAmountLocal) => {
      const paddingTensorShape = imgTensor.shape.slice();
      paddingTensorShape[paddingAxis] = paddingAmountLocal;
      return (void 0)(paddingTensorShape, 0, "float32");
    };
    const paddingTensorAppend = createPaddingTensor(paddingAmount);
    const remainingPaddingAmount = dimDiff - paddingTensorAppend.shape[paddingAxis];
    const paddingTensorPrepend = isCenterImage && remainingPaddingAmount ? createPaddingTensor(remainingPaddingAmount) : null;
    const tensorsToStack = [paddingTensorPrepend, imgTensor, paddingTensorAppend].filter((t) => !!t).map((t) => (void 0)(t, "float32"));
    return (void 0)(tensorsToStack, paddingAxis);
  });
}

// src/ops/shuffleArray.ts
function shuffleArray(inputArray) {
  const array = inputArray.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
}

// src/ops/index.ts
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
function inverseSigmoid(x) {
  return Math.log(x / (1 - x));
}

// src/classes/Rect.ts
var Rect = class extends Box {
  constructor(x, y, width, height, allowNegativeDimensions = false) {
    super({ x, y, width, height }, allowNegativeDimensions);
  }
};

// src/classes/FaceLandmarks.ts
var relX = 0.5;
var relY = 0.43;
var relScale = 0.45;
var FaceLandmarks = class {
  _shift;
  _positions;
  _imgDims;
  constructor(relativeFaceLandmarkPositions, imgDims, shift = new Point(0, 0)) {
    const { width, height } = imgDims;
    this._imgDims = new Dimensions(width, height);
    this._shift = shift;
    this._positions = relativeFaceLandmarkPositions.map(
      (pt) => pt.mul(new Point(width, height)).add(shift)
    );
  }
  get shift() {
    return new Point(this._shift.x, this._shift.y);
  }
  get imageWidth() {
    return this._imgDims.width;
  }
  get imageHeight() {
    return this._imgDims.height;
  }
  get positions() {
    return this._positions;
  }
  get relativePositions() {
    return this._positions.map(
      (pt) => pt.sub(this._shift).div(new Point(this.imageWidth, this.imageHeight))
    );
  }
  forSize(width, height) {
    return new this.constructor(
      this.relativePositions,
      { width, height }
    );
  }
  shiftBy(x, y) {
    return new this.constructor(
      this.relativePositions,
      this._imgDims,
      new Point(x, y)
    );
  }
  shiftByPoint(pt) {
    return this.shiftBy(pt.x, pt.y);
  }
  /**
   * Aligns the face landmarks after face detection from the relative positions of the faces
   * bounding box, or it's current shift. This function should be used to align the face images
   * after face detection has been performed, before they are passed to the face recognition net.
   * This will make the computed face descriptor more accurate.
   *
   * @param detection (optional) The bounding box of the face or the face detection result. If
   * no argument was passed the position of the face landmarks are assumed to be relative to
   * it's current shift.
   * @returns The bounding box of the aligned face.
   */
  align(detection, options = {}) {
    if (detection) {
      const box = detection instanceof FaceDetection ? detection.box.floor() : new Box(detection);
      return this.shiftBy(box.x, box.y).align(null, options);
    }
    const { useDlibAlignment, minBoxPadding } = { useDlibAlignment: false, minBoxPadding: 0.2, ...options };
    if (useDlibAlignment) {
      return this.alignDlib();
    }
    return this.alignMinBbox(minBoxPadding);
  }
  alignDlib() {
    const centers = this.getRefPointsForAlignment();
    const [leftEyeCenter, rightEyeCenter, mouthCenter] = centers;
    const distToMouth = (pt) => mouthCenter.sub(pt).magnitude();
    const eyeToMouthDist = (distToMouth(leftEyeCenter) + distToMouth(rightEyeCenter)) / 2;
    const size = Math.floor(eyeToMouthDist / relScale);
    const refPoint = getCenterPoint(centers);
    const x = Math.floor(Math.max(0, refPoint.x - relX * size));
    const y = Math.floor(Math.max(0, refPoint.y - relY * size));
    return new Rect(x, y, Math.min(size, this.imageWidth + x), Math.min(size, this.imageHeight + y));
  }
  alignMinBbox(padding) {
    const box = minBbox(this.positions);
    return box.pad(box.width * padding, box.height * padding);
  }
  getRefPointsForAlignment() {
    throw new Error("getRefPointsForAlignment not implemented by base class");
  }
};

// src/classes/FaceLandmarks5.ts
var FaceLandmarks5 = class extends FaceLandmarks {
  getRefPointsForAlignment() {
    const pts = this.positions;
    return [
      pts[0],
      pts[1],
      getCenterPoint([pts[3], pts[4]])
    ];
  }
};

// src/classes/FaceLandmarks68.ts
var FaceLandmarks68 = class extends FaceLandmarks {
  getJawOutline() {
    return this.positions.slice(0, 17);
  }
  getLeftEyeBrow() {
    return this.positions.slice(17, 22);
  }
  getRightEyeBrow() {
    return this.positions.slice(22, 27);
  }
  getNose() {
    return this.positions.slice(27, 36);
  }
  getLeftEye() {
    return this.positions.slice(36, 42);
  }
  getRightEye() {
    return this.positions.slice(42, 48);
  }
  getMouth() {
    return this.positions.slice(48, 68);
  }
  getRefPointsForAlignment() {
    return [
      this.getLeftEye(),
      this.getRightEye(),
      this.getMouth()
    ].map(getCenterPoint);
  }
};

// src/classes/FaceMatch.ts
var FaceMatch = class {
  _label;
  _distance;
  constructor(label, distance) {
    this._label = label;
    this._distance = distance;
  }
  get label() {
    return this._label;
  }
  get distance() {
    return this._distance;
  }
  toString(withDistance = true) {
    return `${this.label}${withDistance ? ` (${round(this.distance)})` : ""}`;
  }
};

// src/classes/LabeledBox.ts
var LabeledBox = class extends Box {
  static assertIsValidLabeledBox(box, callee) {
    Box.assertIsValidBox(box, callee);
    if (!isValidNumber(box.label)) {
      throw new Error(`${callee} - expected property label (${box.label}) to be a number`);
    }
  }
  _label;
  constructor(box, label) {
    super(box);
    this._label = label;
  }
  get label() {
    return this._label;
  }
};

// src/classes/LabeledFaceDescriptors.ts
var LabeledFaceDescriptors = class {
  _label;
  _descriptors;
  constructor(label, descriptors2) {
    if (!(typeof label === "string")) {
      throw new Error("LabeledFaceDescriptors - constructor expected label to be a string");
    }
    if (!Array.isArray(descriptors2) || descriptors2.some((desc) => !(desc instanceof Float32Array))) {
      throw new Error("LabeledFaceDescriptors - constructor expected descriptors to be an array of Float32Array");
    }
    this._label = label;
    this._descriptors = descriptors2;
  }
  get label() {
    return this._label;
  }
  get descriptors() {
    return this._descriptors;
  }
  toJSON() {
    return {
      label: this.label,
      descriptors: this.descriptors.map((d) => Array.from(d))
    };
  }
  static fromJSON(json) {
    const descriptors2 = json.descriptors.map((d) => new Float32Array(d));
    return new LabeledFaceDescriptors(json.label, descriptors2);
  }
};

// src/classes/PredictedBox.ts
var PredictedBox = class extends LabeledBox {
  static assertIsValidPredictedBox(box, callee) {
    LabeledBox.assertIsValidLabeledBox(box, callee);
    if (!isValidProbablitiy(box.score) || !isValidProbablitiy(box.classScore)) {
      throw new Error(`${callee} - expected properties score (${box.score}) and (${box.classScore}) to be a number between [0, 1]`);
    }
  }
  _score;
  _classScore;
  constructor(box, label, score, classScore) {
    super(box, label);
    this._score = score;
    this._classScore = classScore;
  }
  get score() {
    return this._score;
  }
  get classScore() {
    return this._classScore;
  }
};

// src/factories/WithFaceDetection.ts
function isWithFaceDetection(obj) {
  return obj.detection instanceof FaceDetection;
}
function extendWithFaceDetection(sourceObj, detection) {
  const extension = { detection };
  return { ...sourceObj, ...extension };
}

// src/env/createBrowserEnv.ts
function createBrowserEnv() {
  const fetch = window.fetch;
  if (!fetch)
    throw new Error("fetch - missing fetch implementation for browser environment");
  const readFile = () => {
    throw new Error("readFile - filesystem not available for browser environment");
  };
  return {
    Canvas: HTMLCanvasElement,
    CanvasRenderingContext2D,
    Image: HTMLImageElement,
    ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement("canvas"),
    createImageElement: () => document.createElement("img"),
    createVideoElement: () => document.createElement("video"),
    fetch,
    readFile
  };
}

// src/env/createFileSystem.ts
function createFileSystem(fs) {
  const requireFsError = "";
  const readFile = fs ? (filePath) => new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, buffer) => err ? reject(err) : resolve(buffer));
  }) : () => {
    throw new Error(`readFile - failed to require fs in nodejs environment with error: ${requireFsError}`);
  };
  return { readFile };
}

// src/env/createNodejsEnv.ts
function createNodejsEnv() {
  const Canvas = global["Canvas"] || global.HTMLCanvasElement;
  const Image = global.Image || global.HTMLImageElement;
  const Video = global["Video"] || global.HTMLVideoElement;
  const createCanvasElement = () => {
    if (Canvas)
      return new Canvas();
    throw new Error("createCanvasElement - missing Canvas implementation for nodejs environment");
  };
  const createImageElement = () => {
    if (Image)
      return new Image();
    throw new Error("createImageElement - missing Image implementation for nodejs environment");
  };
  const createVideoElement = () => {
    if (Video)
      return new Video();
    throw new Error("createVideoElement - missing Video implementation for nodejs environment");
  };
  const fetch = global.fetch;
  const fileSystem = createFileSystem();
  return {
    Canvas: Canvas || class {
    },
    CanvasRenderingContext2D: global.CanvasRenderingContext2D || class {
    },
    Image: Image || class {
    },
    ImageData: global.ImageData || class {
    },
    Video: global.HTMLVideoElement || class {
    },
    createCanvasElement,
    createImageElement,
    createVideoElement,
    fetch,
    ...fileSystem
  };
}

// src/env/isBrowser.ts
function isBrowser() {
  return typeof window === "object" && typeof document !== "undefined" && typeof HTMLImageElement !== "undefined" && typeof HTMLCanvasElement !== "undefined" && typeof HTMLVideoElement !== "undefined" && typeof ImageData !== "undefined" && typeof CanvasRenderingContext2D !== "undefined";
}

// src/env/isNodejs.ts
function isNodejs() {
  return typeof global === "object" && typeof process !== "undefined" && process.versions != null && process.versions.node != null;
}

// src/env/index.ts
var environment;
function getEnv() {
  if (!environment) {
    throw new Error("getEnv - environment is not defined, check isNodejs() and isBrowser()");
  }
  return environment;
}
function setEnv(env2) {
  environment = env2;
}
function initialize() {
  if (isBrowser())
    return setEnv(createBrowserEnv());
  if (isNodejs())
    return setEnv(createNodejsEnv());
  return null;
}
function monkeyPatch(env2) {
  if (!environment) {
    initialize();
  }
  if (!environment) {
    throw new Error("monkeyPatch - environment is not defined, check isNodejs() and isBrowser()");
  }
  const { Canvas = environment.Canvas, Image = environment.Image } = env2;
  environment.Canvas = Canvas;
  environment.Image = Image;
  environment.createCanvasElement = env2.createCanvasElement || (() => new Canvas());
  environment.createImageElement = env2.createImageElement || (() => new Image());
  environment.ImageData = env2.ImageData || environment.ImageData;
  environment.Video = env2.Video || environment.Video;
  environment.fetch = env2.fetch || environment.fetch;
  environment.readFile = env2.readFile || environment.readFile;
}
var env = {
  getEnv,
  setEnv,
  initialize,
  createBrowserEnv,
  createFileSystem,
  createNodejsEnv,
  monkeyPatch,
  isBrowser,
  isNodejs
};
initialize();

// src/dom/resolveInput.ts
function resolveInput(arg) {
  if (!env.isNodejs() && typeof arg === "string") {
    return document.getElementById(arg);
  }
  return arg;
}

// src/dom/getContext2dOrThrow.ts
function getContext2dOrThrow(canvasArg) {
  const { Canvas, CanvasRenderingContext2D: CanvasRenderingContext2D2 } = env.getEnv();
  if (canvasArg instanceof CanvasRenderingContext2D2)
    return canvasArg;
  const canvas = resolveInput(canvasArg);
  if (!(canvas instanceof Canvas))
    throw new Error("resolveContext2d - expected canvas to be of instance of Canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx)
    throw new Error("resolveContext2d - canvas 2d context is null");
  return ctx;
}

// src/draw/DrawTextField.ts
var AnchorPosition = /* @__PURE__ */ ((AnchorPosition2) => {
  AnchorPosition2["TOP_LEFT"] = "TOP_LEFT";
  AnchorPosition2["TOP_RIGHT"] = "TOP_RIGHT";
  AnchorPosition2["BOTTOM_LEFT"] = "BOTTOM_LEFT";
  AnchorPosition2["BOTTOM_RIGHT"] = "BOTTOM_RIGHT";
  return AnchorPosition2;
})(AnchorPosition || {});
var DrawTextFieldOptions = class {
  anchorPosition;
  backgroundColor;
  fontColor;
  fontSize;
  fontStyle;
  padding;
  constructor(options = {}) {
    const {
      anchorPosition,
      backgroundColor,
      fontColor,
      fontSize,
      fontStyle,
      padding
    } = options;
    this.anchorPosition = anchorPosition || "TOP_LEFT" /* TOP_LEFT */;
    this.backgroundColor = backgroundColor || "rgba(0, 0, 0, 0.5)";
    this.fontColor = fontColor || "rgba(255, 255, 255, 1)";
    this.fontSize = fontSize || 14;
    this.fontStyle = fontStyle || "Georgia";
    this.padding = padding || 4;
  }
};
var DrawTextField = class {
  text;
  anchor;
  options;
  constructor(text, anchor, options = {}) {
    this.text = typeof text === "string" ? [text] : text instanceof DrawTextField ? text.text : text;
    this.anchor = anchor;
    this.options = new DrawTextFieldOptions(options);
  }
  measureWidth(ctx) {
    const { padding } = this.options;
    return this.text.map((l) => ctx.measureText(l).width).reduce((w0, w1) => w0 < w1 ? w1 : w0, 0) + 2 * padding;
  }
  measureHeight() {
    const { fontSize, padding } = this.options;
    return this.text.length * fontSize + 2 * padding;
  }
  getUpperLeft(ctx, canvasDims) {
    const { anchorPosition } = this.options;
    const isShiftLeft = anchorPosition === "BOTTOM_RIGHT" /* BOTTOM_RIGHT */ || anchorPosition === "TOP_RIGHT" /* TOP_RIGHT */;
    const isShiftTop = anchorPosition === "BOTTOM_LEFT" /* BOTTOM_LEFT */ || anchorPosition === "BOTTOM_RIGHT" /* BOTTOM_RIGHT */;
    const textFieldWidth = this.measureWidth(ctx);
    const textFieldHeight = this.measureHeight();
    const x = isShiftLeft ? this.anchor.x - textFieldWidth : this.anchor.x;
    const y = isShiftTop ? this.anchor.y - textFieldHeight : this.anchor.y;
    if (canvasDims) {
      const { width, height } = canvasDims;
      const newX = Math.max(Math.min(x, width - textFieldWidth), 0);
      const newY = Math.max(Math.min(y, height - textFieldHeight), 0);
      return { x: newX, y: newY };
    }
    return { x, y };
  }
  draw(canvasArg) {
    const canvas = resolveInput(canvasArg);
    const ctx = getContext2dOrThrow(canvas);
    const {
      backgroundColor,
      fontColor,
      fontSize,
      fontStyle,
      padding
    } = this.options;
    ctx.font = `${fontSize}px ${fontStyle}`;
    const maxTextWidth = this.measureWidth(ctx);
    const textHeight = this.measureHeight();
    ctx.fillStyle = backgroundColor;
    const upperLeft = this.getUpperLeft(ctx, canvas);
    ctx.fillRect(upperLeft.x, upperLeft.y, maxTextWidth, textHeight);
    ctx.fillStyle = fontColor;
    this.text.forEach((textLine, i) => {
      const x = padding + upperLeft.x;
      const y = padding + upperLeft.y + (i + 1) * fontSize;
      ctx.fillText(textLine, x, y);
    });
  }
};

// src/draw/DrawBox.ts
var DrawBoxOptions = class {
  boxColor;
  lineWidth;
  drawLabelOptions;
  label;
  constructor(options = {}) {
    const {
      boxColor,
      lineWidth,
      label,
      drawLabelOptions
    } = options;
    this.boxColor = boxColor || "rgba(0, 0, 255, 1)";
    this.lineWidth = lineWidth || 2;
    this.label = label;
    const defaultDrawLabelOptions = {
      anchorPosition: "BOTTOM_LEFT" /* BOTTOM_LEFT */,
      backgroundColor: this.boxColor
    };
    this.drawLabelOptions = new DrawTextFieldOptions({ ...defaultDrawLabelOptions, ...drawLabelOptions });
  }
};
var DrawBox = class {
  box;
  options;
  constructor(box, options = {}) {
    this.box = new Box(box);
    this.options = new DrawBoxOptions(options);
  }
  draw(canvasArg) {
    const ctx = getContext2dOrThrow(canvasArg);
    const { boxColor, lineWidth } = this.options;
    const {
      x,
      y,
      width,
      height
    } = this.box;
    ctx.strokeStyle = boxColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
    const { label } = this.options;
    if (label) {
      new DrawTextField([label], { x: x - lineWidth / 2, y }, this.options.drawLabelOptions).draw(canvasArg);
    }
  }
};

// src/draw/drawDetections.ts
function drawDetections(canvasArg, detections) {
  const detectionsArray = Array.isArray(detections) ? detections : [detections];
  detectionsArray.forEach((det) => {
    const score = det instanceof FaceDetection ? det.score : isWithFaceDetection(det) ? det.detection.score : void 0;
    const box = det instanceof FaceDetection ? det.box : isWithFaceDetection(det) ? det.detection.box : new Box(det);
    const label = score ? `${round(score)}` : void 0;
    new DrawBox(box, { label }).draw(canvasArg);
  });
}

// src/dom/isMediaLoaded.ts
function isMediaLoaded(media) {
  const { Image, Video } = env.getEnv();
  return media instanceof Image && media.complete || media instanceof Video && media.readyState >= 3;
}

// src/dom/awaitMediaLoaded.ts
function awaitMediaLoaded(media) {
  return new Promise((resolve, reject) => {
    if (media instanceof env.getEnv().Canvas || isMediaLoaded(media))
      resolve(null);
    function onError(e) {
      if (!e.currentTarget)
        return;
      e.currentTarget.removeEventListener("load", onLoad);
      e.currentTarget.removeEventListener("error", onError);
      reject(e);
    }
    function onLoad(e) {
      if (!e.currentTarget)
        return;
      e.currentTarget.removeEventListener("load", onLoad);
      e.currentTarget.removeEventListener("error", onError);
      resolve(e);
    }
    media.addEventListener("load", onLoad);
    media.addEventListener("error", onError);
  });
}

// src/dom/bufferToImage.ts
function bufferToImage(buf) {
  return new Promise((resolve, reject) => {
    if (!(buf instanceof Blob))
      reject(new Error("bufferToImage - expected buf to be of type: Blob"));
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string")
        reject(new Error("bufferToImage - expected reader.result to be a string, in onload"));
      const img = env.getEnv().createImageElement();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(buf);
  });
}

// src/dom/getMediaDimensions.ts
function getMediaDimensions(input) {
  const { Image, Video } = env.getEnv();
  if (input instanceof Image) {
    return new Dimensions(input.naturalWidth, input.naturalHeight);
  }
  if (input instanceof Video) {
    return new Dimensions(input.videoWidth, input.videoHeight);
  }
  return new Dimensions(input.width, input.height);
}

// src/dom/createCanvas.ts
function createCanvas({ width, height }) {
  const { createCanvasElement } = env.getEnv();
  const canvas = createCanvasElement();
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
function createCanvasFromMedia(media, dims) {
  const { ImageData: ImageData2 } = env.getEnv();
  if (!(media instanceof ImageData2) && !isMediaLoaded(media)) {
    throw new Error("createCanvasFromMedia - media has not finished loading yet");
  }
  const { width, height } = dims || getMediaDimensions(media);
  const canvas = createCanvas({ width, height });
  if (media instanceof ImageData2) {
    getContext2dOrThrow(canvas).putImageData(media, 0, 0);
  } else {
    getContext2dOrThrow(canvas).drawImage(media, 0, 0, width, height);
  }
  return canvas;
}

// src/dom/imageTensorToCanvas.ts
async function imageTensorToCanvas(imgTensor, canvas) {
  const targetCanvas = canvas || env.getEnv().createCanvasElement();
  const [height, width, numChannels] = imgTensor.shape.slice(isTensor4D(imgTensor) ? 1 : 0);
  const imgTensor3D = (void 0)(() => imgTensor.as3D(height, width, numChannels).toInt());
  await (void 0).toPixels(imgTensor3D, targetCanvas);
  imgTensor3D.dispose();
  return targetCanvas;
}

// src/dom/isMediaElement.ts
function isMediaElement(input) {
  const { Image, Canvas, Video } = env.getEnv();
  return input instanceof Image || input instanceof Canvas || input instanceof Video;
}

// src/dom/imageToSquare.ts
function imageToSquare(input, inputSize, centerImage = false) {
  const { Image, Canvas } = env.getEnv();
  if (!(input instanceof Image || input instanceof Canvas)) {
    throw new Error("imageToSquare - expected arg0 to be HTMLImageElement | HTMLCanvasElement");
  }
  if (inputSize <= 0)
    return createCanvas({ width: 1, height: 1 });
  const dims = getMediaDimensions(input);
  const scale2 = inputSize / Math.max(dims.height, dims.width);
  const width = scale2 * dims.width;
  const height = scale2 * dims.height;
  const targetCanvas = createCanvas({ width: inputSize, height: inputSize });
  const inputCanvas = input instanceof Canvas ? input : createCanvasFromMedia(input);
  const offset = Math.abs(width - height) / 2;
  const dx = centerImage && width < height ? offset : 0;
  const dy = centerImage && height < width ? offset : 0;
  if (inputCanvas.width > 0 && inputCanvas.height > 0)
    getContext2dOrThrow(targetCanvas).drawImage(inputCanvas, dx, dy, width, height);
  return targetCanvas;
}

// src/dom/NetInput.ts
var NetInput = class {
  _imageTensors = [];
  _canvases = [];
  _batchSize;
  _treatAsBatchInput = false;
  _inputDimensions = [];
  _inputSize = 0;
  constructor(inputs, treatAsBatchInput = false) {
    if (!Array.isArray(inputs)) {
      throw new Error(`NetInput.constructor - expected inputs to be an Array of TResolvedNetInput or to be instanceof tf.Tensor4D, instead have ${inputs}`);
    }
    this._treatAsBatchInput = treatAsBatchInput;
    this._batchSize = inputs.length;
    inputs.forEach((input, idx) => {
      if (isTensor3D(input)) {
        this._imageTensors[idx] = input;
        this._inputDimensions[idx] = input.shape;
        return;
      }
      if (isTensor4D(input)) {
        const batchSize = input.shape[0];
        if (batchSize !== 1) {
          throw new Error(`NetInput - tf.Tensor4D with batchSize ${batchSize} passed, but not supported in input array`);
        }
        this._imageTensors[idx] = input;
        this._inputDimensions[idx] = input.shape.slice(1);
        return;
      }
      const canvas = input instanceof env.getEnv().Canvas ? input : createCanvasFromMedia(input);
      this._canvases[idx] = canvas;
      this._inputDimensions[idx] = [canvas.height, canvas.width, 3];
    });
  }
  get imageTensors() {
    return this._imageTensors;
  }
  get canvases() {
    return this._canvases;
  }
  get isBatchInput() {
    return this.batchSize > 1 || this._treatAsBatchInput;
  }
  get batchSize() {
    return this._batchSize;
  }
  get inputDimensions() {
    return this._inputDimensions;
  }
  get inputSize() {
    return this._inputSize;
  }
  get reshapedInputDimensions() {
    return range(this.batchSize, 0, 1).map(
      (_, batchIdx) => this.getReshapedInputDimensions(batchIdx)
    );
  }
  getInput(batchIdx) {
    return this.canvases[batchIdx] || this.imageTensors[batchIdx];
  }
  getInputDimensions(batchIdx) {
    return this._inputDimensions[batchIdx];
  }
  getInputHeight(batchIdx) {
    return this._inputDimensions[batchIdx][0];
  }
  getInputWidth(batchIdx) {
    return this._inputDimensions[batchIdx][1];
  }
  getReshapedInputDimensions(batchIdx) {
    if (typeof this.inputSize !== "number") {
      throw new Error("getReshapedInputDimensions - inputSize not set, toBatchTensor has not been called yet");
    }
    const width = this.getInputWidth(batchIdx);
    const height = this.getInputHeight(batchIdx);
    return computeReshapedDimensions({ width, height }, this.inputSize);
  }
  /**
   * Create a batch tensor from all input canvases and tensors
   * with size [batchSize, inputSize, inputSize, 3].
   *
   * @param inputSize Height and width of the tensor.
   * @param isCenterImage (optional, default: false) If true, add an equal amount of padding on
   * both sides of the minor dimension oof the image.
   * @returns The batch tensor.
   */
  toBatchTensor(inputSize, isCenterInputs = true) {
    this._inputSize = inputSize;
    return (void 0)(() => {
      const inputTensors = range(this.batchSize, 0, 1).map((batchIdx) => {
        const input = this.getInput(batchIdx);
        if (input instanceof void 0) {
          let imgTensor = isTensor4D(input) ? input : (void 0)(input);
          imgTensor = padToSquare(imgTensor, isCenterInputs);
          if (imgTensor.shape[1] !== inputSize || imgTensor.shape[2] !== inputSize) {
            imgTensor = (void 0).resizeBilinear(imgTensor, [inputSize, inputSize], false, false);
          }
          return imgTensor.as3D(inputSize, inputSize, 3);
        }
        if (input instanceof env.getEnv().Canvas) {
          return (void 0).fromPixels(imageToSquare(input, inputSize, isCenterInputs));
        }
        throw new Error(`toBatchTensor - at batchIdx ${batchIdx}, expected input to be instanceof tf.Tensor or instanceof HTMLCanvasElement, instead have ${input}`);
      });
      const batchTensor = (void 0)(inputTensors.map((t) => (void 0)(t, "float32"))).as4D(this.batchSize, inputSize, inputSize, 3);
      return batchTensor;
    });
  }
};

// src/dom/toNetInput.ts
async function toNetInput(inputs) {
  if (inputs instanceof NetInput)
    return inputs;
  const inputArgArray = Array.isArray(inputs) ? inputs : [inputs];
  if (!inputArgArray.length)
    throw new Error("toNetInput - empty array passed as input");
  const getIdxHint = (idx) => Array.isArray(inputs) ? ` at input index ${idx}:` : "";
  const inputArray = inputArgArray.map(resolveInput);
  inputArray.forEach((input, i) => {
    if (!isMediaElement(input) && !isTensor3D(input) && !isTensor4D(input)) {
      if (typeof inputArgArray[i] === "string")
        throw new Error(`toNetInput -${getIdxHint(i)} string passed, but could not resolve HTMLElement for element id ${inputArgArray[i]}`);
      throw new Error(`toNetInput -${getIdxHint(i)} expected media to be of type HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | tf.Tensor3D, or to be an element id`);
    }
    if (isTensor4D(input)) {
      const batchSize = input.shape[0];
      if (batchSize !== 1)
        throw new Error(`toNetInput -${getIdxHint(i)} tf.Tensor4D with batchSize ${batchSize} passed, but not supported in input array`);
    }
  });
  await Promise.all(inputArray.map((input) => isMediaElement(input) && awaitMediaLoaded(input)));
  return new NetInput(inputArray, Array.isArray(inputs));
}

// src/dom/extractFaces.ts
async function extractFaces(input, detections) {
  const { Canvas } = env.getEnv();
  let canvas = input;
  if (!(input instanceof Canvas)) {
    const netInput = await toNetInput(input);
    if (netInput.batchSize > 1)
      throw new Error("extractFaces - batchSize > 1 not supported");
    const tensorOrCanvas = netInput.getInput(0);
    canvas = tensorOrCanvas instanceof Canvas ? tensorOrCanvas : await imageTensorToCanvas(tensorOrCanvas);
  }
  const ctx = getContext2dOrThrow(canvas);
  const boxes = detections.map((det) => det instanceof FaceDetection ? det.forSize(canvas.width, canvas.height).box.floor() : det).map((box) => box.clipAtImageBorders(canvas.width, canvas.height));
  return boxes.map(({ x, y, width, height }) => {
    const faceImg = createCanvas({ width, height });
    if (width > 0 && height > 0)
      getContext2dOrThrow(faceImg).putImageData(ctx.getImageData(x, y, width, height), 0, 0);
    return faceImg;
  });
}

// src/dom/extractFaceTensors.ts
async function extractFaceTensors(imageTensor, detections) {
  if (!isTensor3D(imageTensor) && !isTensor4D(imageTensor)) {
    throw new Error("extractFaceTensors - expected image tensor to be 3D or 4D");
  }
  if (isTensor4D(imageTensor) && imageTensor.shape[0] > 1) {
    throw new Error("extractFaceTensors - batchSize > 1 not supported");
  }
  return (void 0)(() => {
    const [imgHeight, imgWidth, numChannels] = imageTensor.shape.slice(isTensor4D(imageTensor) ? 1 : 0);
    const boxes = detections.map((det) => det instanceof FaceDetection ? det.forSize(imgWidth, imgHeight).box : det).map((box) => box.clipAtImageBorders(imgWidth, imgHeight));
    const faceTensors = boxes.filter((box) => box.width > 0 && box.height > 0).map(({ x, y, width, height }) => (void 0)(imageTensor.as3D(imgHeight, imgWidth, numChannels), [y, x, 0], [height, width, numChannels]));
    return faceTensors;
  });
}

// src/dom/fetchOrThrow.ts
async function fetchOrThrow(url2, init) {
  const { fetch } = env.getEnv();
  const res = await fetch(url2, init);
  if (!(res.status < 400)) {
    throw new Error(`failed to fetch: (${res.status}) ${res.statusText}, from url: ${res.url}`);
  }
  return res;
}

// src/dom/fetchImage.ts
async function fetchImage(uri) {
  const res = await fetchOrThrow(uri);
  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error(`fetchImage - expected blob type to be of type image/*, instead have: ${blob.type}, for url: ${res.url}`);
  }
  return bufferToImage(blob);
}

// src/dom/fetchJson.ts
async function fetchJson(uri) {
  return (await fetchOrThrow(uri)).json();
}

// src/dom/fetchNetWeights.ts
async function fetchNetWeights(uri) {
  return new Float32Array(await (await fetchOrThrow(uri)).arrayBuffer());
}

// src/dom/bufferToVideo.ts
function bufferToVideo(buf) {
  return new Promise((resolve, reject) => {
    if (!(buf instanceof Blob))
      reject(new Error("bufferToVideo - expected buf to be of type: Blob"));
    const video = env.getEnv().createVideoElement();
    video.oncanplay = () => resolve(video);
    video.onerror = reject;
    video.playsInline = true;
    video.muted = true;
    video.src = URL.createObjectURL(buf);
    video.play();
  });
}

// src/dom/fetchVideo.ts
async function fetchVideo(uri) {
  const res = await fetchOrThrow(uri);
  const blob = await res.blob();
  if (!blob.type.startsWith("video/")) {
    throw new Error(`fetchVideo - expected blob type to be of type video/*, instead have: ${blob.type}, for url: ${res.url}`);
  }
  return bufferToVideo(blob);
}

// src/common/getModelUris.ts
function getModelUris(uri, defaultModelName) {
  const defaultManifestFilename = `${defaultModelName}-weights_manifest.json`;
  if (!uri) {
    return {
      modelBaseUri: "",
      manifestUri: defaultManifestFilename
    };
  }
  if (uri === "/") {
    return {
      modelBaseUri: "/",
      manifestUri: `/${defaultManifestFilename}`
    };
  }
  const protocol = uri.startsWith("http://") ? "http://" : uri.startsWith("https://") ? "https://" : "";
  uri = uri.replace(protocol, "");
  const parts = uri.split("/").filter((s) => s);
  const manifestFile = uri.endsWith(".json") ? parts[parts.length - 1] : defaultManifestFilename;
  let modelBaseUri = protocol + (uri.endsWith(".json") ? parts.slice(0, parts.length - 1) : parts).join("/");
  modelBaseUri = uri.startsWith("/") ? `/${modelBaseUri}` : modelBaseUri;
  return {
    modelBaseUri,
    manifestUri: modelBaseUri === "/" ? `/${manifestFile}` : `${modelBaseUri}/${manifestFile}`
  };
}

// src/dom/loadWeightMap.ts
async function loadWeightMap(uri, defaultModelName) {
  const { manifestUri, modelBaseUri } = getModelUris(uri, defaultModelName);
  const manifest = await fetchJson(manifestUri);
  return (void 0).loadWeights(manifest, modelBaseUri);
}

// src/dom/matchDimensions.ts
function matchDimensions(input, reference, useMediaDimensions = false) {
  const { width, height } = useMediaDimensions ? getMediaDimensions(reference) : reference;
  input.width = width;
  input.height = height;
  return { width, height };
}

// src/NeuralNetwork.ts
var NeuralNetwork = class {
  constructor(name) {
    this._name = name;
  }
  _params = void 0;
  _paramMappings = [];
  _name;
  get params() {
    return this._params;
  }
  get paramMappings() {
    return this._paramMappings;
  }
  get isLoaded() {
    return !!this.params;
  }
  getParamFromPath(paramPath) {
    const { obj, objProp } = this.traversePropertyPath(paramPath);
    return obj[objProp];
  }
  reassignParamFromPath(paramPath, tensor2) {
    const { obj, objProp } = this.traversePropertyPath(paramPath);
    obj[objProp].dispose();
    obj[objProp] = tensor2;
  }
  getParamList() {
    return this._paramMappings.map(({ paramPath }) => ({
      path: paramPath,
      tensor: this.getParamFromPath(paramPath)
    }));
  }
  getTrainableParams() {
    return this.getParamList().filter((param) => param.tensor instanceof void 0);
  }
  getFrozenParams() {
    return this.getParamList().filter((param) => !(param.tensor instanceof void 0));
  }
  variable() {
    this.getFrozenParams().forEach(({ path, tensor: tensor2 }) => {
      this.reassignParamFromPath(path, tensor2.variable());
    });
  }
  freeze() {
    this.getTrainableParams().forEach(({ path, tensor: variable }) => {
      const tensor2 = (void 0)(variable.dataSync());
      variable.dispose();
      this.reassignParamFromPath(path, tensor2);
    });
  }
  dispose(throwOnRedispose = true) {
    this.getParamList().forEach((param) => {
      if (throwOnRedispose && param.tensor.isDisposed) {
        throw new Error(`param tensor has already been disposed for path ${param.path}`);
      }
      param.tensor.dispose();
    });
    this._params = void 0;
  }
  serializeParams() {
    return new Float32Array(
      this.getParamList().map(({ tensor: tensor2 }) => Array.from(tensor2.dataSync())).reduce((flat, arr) => flat.concat(arr))
    );
  }
  async load(weightsOrUrl) {
    if (weightsOrUrl instanceof Float32Array) {
      this.extractWeights(weightsOrUrl);
      return;
    }
    await this.loadFromUri(weightsOrUrl);
  }
  async loadFromUri(uri) {
    if (uri && typeof uri !== "string") {
      throw new Error(`${this._name}.loadFromUri - expected model uri`);
    }
    const weightMap = await loadWeightMap(uri, this.getDefaultModelName());
    this.loadFromWeightMap(weightMap);
  }
  async loadFromDisk(filePath) {
    if (filePath && typeof filePath !== "string") {
      throw new Error(`${this._name}.loadFromDisk - expected model file path`);
    }
    const { readFile } = env.getEnv();
    const { manifestUri, modelBaseUri } = getModelUris(filePath, this.getDefaultModelName());
    const fetchWeightsFromDisk = (filePaths) => Promise.all(filePaths.map((fp) => readFile(fp).then((buf) => buf.buffer)));
    const loadWeights = (void 0).weightsLoaderFactory(fetchWeightsFromDisk);
    const manifest = JSON.parse((await readFile(manifestUri)).toString());
    const weightMap = await loadWeights(manifest, modelBaseUri);
    this.loadFromWeightMap(weightMap);
  }
  loadFromWeightMap(weightMap) {
    const { paramMappings, params } = this.extractParamsFromWeightMap(weightMap);
    this._paramMappings = paramMappings;
    this._params = params;
  }
  extractWeights(weights) {
    const { paramMappings, params } = this.extractParams(weights);
    this._paramMappings = paramMappings;
    this._params = params;
  }
  traversePropertyPath(paramPath) {
    if (!this.params) {
      throw new Error("traversePropertyPath - model has no loaded params");
    }
    const result = paramPath.split("/").reduce((res, objProp2) => {
      if (!res.nextObj.hasOwnProperty(objProp2)) {
        throw new Error(`traversePropertyPath - object does not have property ${objProp2}, for path ${paramPath}`);
      }
      return { obj: res.nextObj, objProp: objProp2, nextObj: res.nextObj[objProp2] };
    }, { nextObj: this.params });
    const { obj, objProp } = result;
    if (!obj || !objProp || !(obj[objProp] instanceof void 0)) {
      throw new Error(`traversePropertyPath - parameter is not a tensor, for path ${paramPath}`);
    }
    return { obj, objProp };
  }
};

// src/common/depthwiseSeparableConv.ts
function depthwiseSeparableConv(x, params, stride) {
  return (void 0)(() => {
    let out = (void 0)(x, params.depthwise_filter, params.pointwise_filter, stride, "same");
    out = (void 0)(out, params.bias);
    return out;
  });
}

// src/faceFeatureExtractor/denseBlock.ts
function denseBlock3(x, denseBlockParams, isFirstLayer = false) {
  return (void 0)(() => {
    const out1 = (void 0)(
      isFirstLayer ? (void 0)(
        (void 0)(x, denseBlockParams.conv0.filters, [2, 2], "same"),
        denseBlockParams.conv0.bias
      ) : depthwiseSeparableConv(x, denseBlockParams.conv0, [2, 2])
    );
    const out2 = depthwiseSeparableConv(out1, denseBlockParams.conv1, [1, 1]);
    const in3 = (void 0)((void 0)(out1, out2));
    const out3 = depthwiseSeparableConv(in3, denseBlockParams.conv2, [1, 1]);
    return (void 0)((void 0)(out1, (void 0)(out2, out3)));
  });
}
function denseBlock4(x, denseBlockParams, isFirstLayer = false, isScaleDown = true) {
  return (void 0)(() => {
    const out1 = (void 0)(
      isFirstLayer ? (void 0)(
        (void 0)(x, denseBlockParams.conv0.filters, isScaleDown ? [2, 2] : [1, 1], "same"),
        denseBlockParams.conv0.bias
      ) : depthwiseSeparableConv(x, denseBlockParams.conv0, isScaleDown ? [2, 2] : [1, 1])
    );
    const out2 = depthwiseSeparableConv(out1, denseBlockParams.conv1, [1, 1]);
    const in3 = (void 0)((void 0)(out1, out2));
    const out3 = depthwiseSeparableConv(in3, denseBlockParams.conv2, [1, 1]);
    const in4 = (void 0)((void 0)(out1, (void 0)(out2, out3)));
    const out4 = depthwiseSeparableConv(in4, denseBlockParams.conv3, [1, 1]);
    return (void 0)((void 0)(out1, (void 0)(out2, (void 0)(out3, out4))));
  });
}

// src/common/convLayer.ts
function convLayer(x, params, padding = "same", withRelu = false) {
  return (void 0)(() => {
    const out = (void 0)(
      (void 0)(x, params.filters, [1, 1], padding),
      params.bias
    );
    return withRelu ? (void 0)(out) : out;
  });
}

// src/common/disposeUnusedWeightTensors.ts
function disposeUnusedWeightTensors(weightMap, paramMappings) {
  Object.keys(weightMap).forEach((path) => {
    if (!paramMappings.some((pm) => pm.originalPath === path)) {
      weightMap[path].dispose();
    }
  });
}

// src/common/extractConvParamsFactory.ts
function extractConvParamsFactory(extractWeights, paramMappings) {
  return (channelsIn, channelsOut, filterSize, mappedPrefix) => {
    const filters = (void 0)(
      extractWeights(channelsIn * channelsOut * filterSize * filterSize),
      [filterSize, filterSize, channelsIn, channelsOut]
    );
    const bias = (void 0)(extractWeights(channelsOut));
    paramMappings.push(
      { paramPath: `${mappedPrefix}/filters` },
      { paramPath: `${mappedPrefix}/bias` }
    );
    return { filters, bias };
  };
}

// src/common/extractFCParamsFactory.ts
function extractFCParamsFactory(extractWeights, paramMappings) {
  return (channelsIn, channelsOut, mappedPrefix) => {
    const fc_weights = (void 0)(extractWeights(channelsIn * channelsOut), [channelsIn, channelsOut]);
    const fc_bias = (void 0)(extractWeights(channelsOut));
    paramMappings.push(
      { paramPath: `${mappedPrefix}/weights` },
      { paramPath: `${mappedPrefix}/bias` }
    );
    return {
      weights: fc_weights,
      bias: fc_bias
    };
  };
}

// src/common/types.ts
var SeparableConvParams = class {
  // eslint-disable-next-line no-useless-constructor
  constructor(depthwise_filter, pointwise_filter, bias) {
    this.depthwise_filter = depthwise_filter;
    this.pointwise_filter = pointwise_filter;
    this.bias = bias;
  }
};

// src/common/extractSeparableConvParamsFactory.ts
function extractSeparableConvParamsFactory(extractWeights, paramMappings) {
  return (channelsIn, channelsOut, mappedPrefix) => {
    const depthwise_filter = (void 0)(extractWeights(3 * 3 * channelsIn), [3, 3, channelsIn, 1]);
    const pointwise_filter = (void 0)(extractWeights(channelsIn * channelsOut), [1, 1, channelsIn, channelsOut]);
    const bias = (void 0)(extractWeights(channelsOut));
    paramMappings.push(
      { paramPath: `${mappedPrefix}/depthwise_filter` },
      { paramPath: `${mappedPrefix}/pointwise_filter` },
      { paramPath: `${mappedPrefix}/bias` }
    );
    return new SeparableConvParams(
      depthwise_filter,
      pointwise_filter,
      bias
    );
  };
}
function loadSeparableConvParamsFactory(extractWeightEntry) {
  return (prefix) => {
    const depthwise_filter = extractWeightEntry(`${prefix}/depthwise_filter`, 4);
    const pointwise_filter = extractWeightEntry(`${prefix}/pointwise_filter`, 4);
    const bias = extractWeightEntry(`${prefix}/bias`, 1);
    return new SeparableConvParams(
      depthwise_filter,
      pointwise_filter,
      bias
    );
  };
}

// src/common/extractWeightEntryFactory.ts
function extractWeightEntryFactory(weightMap, paramMappings) {
  return (originalPath, paramRank, mappedPath) => {
    const tensor2 = weightMap[originalPath];
    if (!isTensor(tensor2, paramRank)) {
      throw new Error(`expected weightMap[${originalPath}] to be a Tensor${paramRank}D, instead have ${tensor2}`);
    }
    paramMappings.push(
      { originalPath, paramPath: mappedPath || originalPath }
    );
    return tensor2;
  };
}

// src/common/extractWeightsFactory.ts
function extractWeightsFactory(weights) {
  let remainingWeights = weights;
  function extractWeights(numWeights) {
    const ret = remainingWeights.slice(0, numWeights);
    remainingWeights = remainingWeights.slice(numWeights);
    return ret;
  }
  function getRemainingWeights() {
    return remainingWeights;
  }
  return {
    extractWeights,
    getRemainingWeights
  };
}

// src/faceFeatureExtractor/extractorsFactory.ts
function extractorsFactory(extractWeights, paramMappings) {
  const extractConvParams = extractConvParamsFactory(extractWeights, paramMappings);
  const extractSeparableConvParams = extractSeparableConvParamsFactory(extractWeights, paramMappings);
  function extractDenseBlock3Params(channelsIn, channelsOut, mappedPrefix, isFirstLayer = false) {
    const conv0 = isFirstLayer ? extractConvParams(channelsIn, channelsOut, 3, `${mappedPrefix}/conv0`) : extractSeparableConvParams(channelsIn, channelsOut, `${mappedPrefix}/conv0`);
    const conv1 = extractSeparableConvParams(channelsOut, channelsOut, `${mappedPrefix}/conv1`);
    const conv22 = extractSeparableConvParams(channelsOut, channelsOut, `${mappedPrefix}/conv2`);
    return { conv0, conv1, conv2: conv22 };
  }
  function extractDenseBlock4Params(channelsIn, channelsOut, mappedPrefix, isFirstLayer = false) {
    const { conv0, conv1, conv2: conv22 } = extractDenseBlock3Params(channelsIn, channelsOut, mappedPrefix, isFirstLayer);
    const conv3 = extractSeparableConvParams(channelsOut, channelsOut, `${mappedPrefix}/conv3`);
    return {
      conv0,
      conv1,
      conv2: conv22,
      conv3
    };
  }
  return {
    extractDenseBlock3Params,
    extractDenseBlock4Params
  };
}

// src/faceFeatureExtractor/extractParams.ts
function extractParams(weights) {
  const paramMappings = [];
  const {
    extractWeights,
    getRemainingWeights
  } = extractWeightsFactory(weights);
  const {
    extractDenseBlock4Params
  } = extractorsFactory(extractWeights, paramMappings);
  const dense0 = extractDenseBlock4Params(3, 32, "dense0", true);
  const dense1 = extractDenseBlock4Params(32, 64, "dense1");
  const dense2 = extractDenseBlock4Params(64, 128, "dense2");
  const dense3 = extractDenseBlock4Params(128, 256, "dense3");
  if (getRemainingWeights().length !== 0) {
    throw new Error(`weights remaing after extract: ${getRemainingWeights().length}`);
  }
  return {
    paramMappings,
    params: {
      dense0,
      dense1,
      dense2,
      dense3
    }
  };
}

// src/common/loadConvParamsFactory.ts
function loadConvParamsFactory(extractWeightEntry) {
  return (prefix) => {
    const filters = extractWeightEntry(`${prefix}/filters`, 4);
    const bias = extractWeightEntry(`${prefix}/bias`, 1);
    return { filters, bias };
  };
}

// src/faceFeatureExtractor/loadParamsFactory.ts
function loadParamsFactory(weightMap, paramMappings) {
  const extractWeightEntry = extractWeightEntryFactory(weightMap, paramMappings);
  const extractConvParams = loadConvParamsFactory(extractWeightEntry);
  const extractSeparableConvParams = loadSeparableConvParamsFactory(extractWeightEntry);
  function extractDenseBlock3Params(prefix, isFirstLayer = false) {
    const conv0 = isFirstLayer ? extractConvParams(`${prefix}/conv0`) : extractSeparableConvParams(`${prefix}/conv0`);
    const conv1 = extractSeparableConvParams(`${prefix}/conv1`);
    const conv22 = extractSeparableConvParams(`${prefix}/conv2`);
    return { conv0, conv1, conv2: conv22 };
  }
  function extractDenseBlock4Params(prefix, isFirstLayer = false) {
    const conv0 = isFirstLayer ? extractConvParams(`${prefix}/conv0`) : extractSeparableConvParams(`${prefix}/conv0`);
    const conv1 = extractSeparableConvParams(`${prefix}/conv1`);
    const conv22 = extractSeparableConvParams(`${prefix}/conv2`);
    const conv3 = extractSeparableConvParams(`${prefix}/conv3`);
    return {
      conv0,
      conv1,
      conv2: conv22,
      conv3
    };
  }
  return {
    extractDenseBlock3Params,
    extractDenseBlock4Params
  };
}

// src/faceFeatureExtractor/extractParamsFromWeightMap.ts
function extractParamsFromWeightMap(weightMap) {
  const paramMappings = [];
  const {
    extractDenseBlock4Params
  } = loadParamsFactory(weightMap, paramMappings);
  const params = {
    dense0: extractDenseBlock4Params("dense0", true),
    dense1: extractDenseBlock4Params("dense1"),
    dense2: extractDenseBlock4Params("dense2"),
    dense3: extractDenseBlock4Params("dense3")
  };
  disposeUnusedWeightTensors(weightMap, paramMappings);
  return { params, paramMappings };
}

// src/faceFeatureExtractor/FaceFeatureExtractor.ts
var FaceFeatureExtractor = class extends NeuralNetwork {
  constructor() {
    super("FaceFeatureExtractor");
  }
  forwardInput(input) {
    const { params } = this;
    if (!params) {
      throw new Error("FaceFeatureExtractor - load model before inference");
    }
    return (void 0)(() => {
      const batchTensor = (void 0)(input.toBatchTensor(112, true), "float32");
      const meanRgb = [122.782, 117.001, 104.298];
      const normalized = normalize(batchTensor, meanRgb).div(255);
      let out = denseBlock4(normalized, params.dense0, true);
      out = denseBlock4(out, params.dense1);
      out = denseBlock4(out, params.dense2);
      out = denseBlock4(out, params.dense3);
      out = (void 0)(out, [7, 7], [2, 2], "valid");
      return out;
    });
  }
  async forward(input) {
    return this.forwardInput(await toNetInput(input));
  }
  getDefaultModelName() {
    return "face_feature_extractor_model";
  }
  extractParamsFromWeightMap(weightMap) {
    return extractParamsFromWeightMap(weightMap);
  }
  extractParams(weights) {
    return extractParams(weights);
  }
};

// src/common/fullyConnectedLayer.ts
function fullyConnectedLayer(x, params) {
  return (void 0)(() => (void 0)(
    (void 0)(x, params.weights),
    params.bias
  ));
}

// src/faceProcessor/extractParams.ts
function extractParams2(weights, channelsIn, channelsOut) {
  const paramMappings = [];
  const {
    extractWeights,
    getRemainingWeights
  } = extractWeightsFactory(weights);
  const extractFCParams = extractFCParamsFactory(extractWeights, paramMappings);
  const fc = extractFCParams(channelsIn, channelsOut, "fc");
  if (getRemainingWeights().length !== 0) {
    throw new Error(`weights remaing after extract: ${getRemainingWeights().length}`);
  }
  return {
    paramMappings,
    params: { fc }
  };
}

// src/faceProcessor/extractParamsFromWeightMap.ts
function extractParamsFromWeightMap2(weightMap) {
  const paramMappings = [];
  const extractWeightEntry = extractWeightEntryFactory(weightMap, paramMappings);
  function extractFcParams(prefix) {
    const weights = extractWeightEntry(`${prefix}/weights`, 2);
    const bias = extractWeightEntry(`${prefix}/bias`, 1);
    return { weights, bias };
  }
  const params = {
    fc: extractFcParams("fc")
  };
  disposeUnusedWeightTensors(weightMap, paramMappings);
  return { params, paramMappings };
}

// src/faceProcessor/util.ts
function seperateWeightMaps(weightMap) {
  const featureExtractorMap = {};
  const classifierMap = {};
  Object.keys(weightMap).forEach((key) => {
    const map = key.startsWith("fc") ? classifierMap : featureExtractorMap;
    map[key] = weightMap[key];
  });
  return { featureExtractorMap, classifierMap };
}

// src/faceProcessor/FaceProcessor.ts
var FaceProcessor = class extends NeuralNetwork {
  _faceFeatureExtractor;
  constructor(_name, faceFeatureExtractor) {
    super(_name);
    this._faceFeatureExtractor = faceFeatureExtractor;
  }
  get faceFeatureExtractor() {
    return this._faceFeatureExtractor;
  }
  runNet(input) {
    const { params } = this;
    if (!params) {
      throw new Error(`${this._name} - load model before inference`);
    }
    return (void 0)(() => {
      const bottleneckFeatures = input instanceof NetInput ? this.faceFeatureExtractor.forwardInput(input) : input;
      return fullyConnectedLayer(bottleneckFeatures.as2D(bottleneckFeatures.shape[0], -1), params.fc);
    });
  }
  dispose(throwOnRedispose = true) {
    this.faceFeatureExtractor.dispose(throwOnRedispose);
    super.dispose(throwOnRedispose);
  }
  loadClassifierParams(weights) {
    const { params, paramMappings } = this.extractClassifierParams(weights);
    this._params = params;
    this._paramMappings = paramMappings;
  }
  extractClassifierParams(weights) {
    return extractParams2(weights, this.getClassifierChannelsIn(), this.getClassifierChannelsOut());
  }
  extractParamsFromWeightMap(weightMap) {
    const { featureExtractorMap, classifierMap } = seperateWeightMaps(weightMap);
    this.faceFeatureExtractor.loadFromWeightMap(featureExtractorMap);
    return extractParamsFromWeightMap2(classifierMap);
  }
  extractParams(weights) {
    const cIn = this.getClassifierChannelsIn();
    const cOut = this.getClassifierChannelsOut();
    const classifierWeightSize = cOut * cIn + cOut;
    const featureExtractorWeights = weights.slice(0, weights.length - classifierWeightSize);
    const classifierWeights = weights.slice(weights.length - classifierWeightSize);
    this.faceFeatureExtractor.extractWeights(featureExtractorWeights);
    return this.extractClassifierParams(classifierWeights);
  }
};

// src/faceExpressionNet/FaceExpressions.ts
var FACE_EXPRESSION_LABELS = ["neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised"];
var FaceExpressions = class {
  neutral = 0;
  happy = 0;
  sad = 0;
  angry = 0;
  fearful = 0;
  disgusted = 0;
  surprised = 0;
  constructor(probabilities) {
    if (probabilities.length !== 7) {
      throw new Error(`FaceExpressions.constructor - expected probabilities.length to be 7, have: ${probabilities.length}`);
    }
    FACE_EXPRESSION_LABELS.forEach((expression, idx) => {
      this[expression] = probabilities[idx];
    });
  }
  asSortedArray() {
    return FACE_EXPRESSION_LABELS.map((expression) => ({ expression, probability: this[expression] })).sort((e0, e1) => e1.probability - e0.probability);
  }
};

// src/faceExpressionNet/FaceExpressionNet.ts
var FaceExpressionNet = class extends FaceProcessor {
  constructor(faceFeatureExtractor = new FaceFeatureExtractor()) {
    super("FaceExpressionNet", faceFeatureExtractor);
  }
  forwardInput(input) {
    return (void 0)(() => (void 0)(this.runNet(input)));
  }
  async forward(input) {
    return this.forwardInput(await toNetInput(input));
  }
  async predictExpressions(input) {
    const netInput = await toNetInput(input);
    const out = await this.forwardInput(netInput);
    const probabilitesByBatch = await Promise.all((void 0)(out).map(async (t) => {
      const data = t.dataSync();
      t.dispose();
      return data;
    }));
    out.dispose();
    const predictionsByBatch = probabilitesByBatch.map((probabilites) => new FaceExpressions(probabilites));
    return netInput.isBatchInput ? predictionsByBatch : predictionsByBatch[0];
  }
  getDefaultModelName() {
    return "face_expression_model";
  }
  getClassifierChannelsIn() {
    return 256;
  }
  getClassifierChannelsOut() {
    return 7;
  }
};

// src/factories/WithFaceExpressions.ts
function isWithFaceExpressions(obj) {
  return obj.expressions instanceof FaceExpressions;
}
function extendWithFaceExpressions(sourceObj, expressions) {
  const extension = { expressions };
  return { ...sourceObj, ...extension };
}

// src/draw/drawFaceExpressions.ts
function drawFaceExpressions(canvasArg, faceExpressions, minConfidence = 0.1, textFieldAnchor) {
  const faceExpressionsArray = Array.isArray(faceExpressions) ? faceExpressions : [faceExpressions];
  faceExpressionsArray.forEach((e) => {
    const expr = e instanceof FaceExpressions ? e : isWithFaceExpressions(e) ? e.expressions : void 0;
    if (!expr) {
      throw new Error("drawFaceExpressions - expected faceExpressions to be FaceExpressions | WithFaceExpressions<{}> or array thereof");
    }
    const sorted = expr.asSortedArray();
    const resultsToDisplay = sorted.filter((exprLocal) => exprLocal.probability > minConfidence);
    const anchor = isWithFaceDetection(e) ? e.detection.box.bottomLeft : textFieldAnchor || new Point(0, 0);
    const drawTextField = new DrawTextField(
      resultsToDisplay.map((exprLocal) => `${exprLocal.expression} (${round(exprLocal.probability)})`),
      anchor
    );
    drawTextField.draw(canvasArg);
  });
}

// src/factories/WithFaceLandmarks.ts
function isWithFaceLandmarks(obj) {
  return isWithFaceDetection(obj) && obj["landmarks"] instanceof FaceLandmarks && obj["unshiftedLandmarks"] instanceof FaceLandmarks && obj["alignedRect"] instanceof FaceDetection;
}
function calculateFaceAngle(mesh) {
  const degrees = (radians) => radians * 180 / Math.PI;
  const calcLengthBetweenTwoPoints = (a, b) => Math.sqrt((a._x - b._x) ** 2 + (a._y - b._y) ** 2);
  const angle = {
    roll: void 0,
    pitch: void 0,
    yaw: void 0
  };
  const calcYaw = (leftPoint, midPoint, rightPoint) => {
    const leftToMidpoint = Math.floor(leftPoint._x - midPoint._x);
    const rightToMidpoint = Math.floor(midPoint._x - rightPoint._x);
    return leftToMidpoint - rightToMidpoint;
  };
  const calcRoll = (lever, pivot) => {
    const hypotenuse = Math.hypot(pivot._x - lever._x, pivot._y - lever._y);
    const opposite = pivot._y - lever._y;
    const angleInRadians = Math.asin(opposite / hypotenuse);
    const angleInDegrees = degrees(angleInRadians);
    const normalizeAngle = Math.floor(90 - angleInDegrees);
    const tiltDirection = pivot._x - lever._x < 0 ? -1 : 1;
    const result = normalizeAngle * tiltDirection;
    return result;
  };
  const calcPitch = (leftPoint, midPoint, rightPoint) => {
    const base = calcLengthBetweenTwoPoints(leftPoint, rightPoint);
    const baseCoords = {
      _x: (leftPoint._x + rightPoint._x) / 2,
      _y: (leftPoint._y + rightPoint._y) / 2
    };
    const midToBaseLength = calcLengthBetweenTwoPoints(midPoint, baseCoords);
    const angleInRadians = Math.atan(midToBaseLength / base);
    const angleInDegrees = Math.floor(degrees(angleInRadians));
    const direction = baseCoords._y - midPoint._y < 0 ? -1 : 1;
    const result = angleInDegrees * direction;
    return result;
  };
  if (!mesh || !mesh._positions || mesh._positions.length !== 68)
    return angle;
  const pt = mesh._positions;
  angle.roll = calcRoll(pt[27], pt[66]);
  angle.pitch = calcPitch(pt[14], pt[30], pt[2]);
  angle.yaw = calcYaw(pt[14], pt[33], pt[2]);
  return angle;
}
function extendWithFaceLandmarks(sourceObj, unshiftedLandmarks) {
  const { box: shift } = sourceObj.detection;
  const landmarks = unshiftedLandmarks.shiftBy(shift.x, shift.y);
  const rect = landmarks.align();
  const { imageDims } = sourceObj.detection;
  const alignedRect = new FaceDetection(
    sourceObj.detection.score,
    rect.rescale(imageDims.reverse()),
    imageDims
  );
  const angle = calculateFaceAngle(unshiftedLandmarks);
  const extension = { landmarks, unshiftedLandmarks, alignedRect, angle };
  return { ...sourceObj, ...extension };
}

// src/draw/DrawFaceLandmarks.ts
var DrawFaceLandmarksOptions = class {
  drawLines;
  drawPoints;
  lineWidth;
  pointSize;
  lineColor;
  pointColor;
  constructor(options = {}) {
    const {
      drawLines = true,
      drawPoints = true,
      lineWidth,
      lineColor,
      pointSize,
      pointColor
    } = options;
    this.drawLines = drawLines;
    this.drawPoints = drawPoints;
    this.lineWidth = lineWidth || 1;
    this.pointSize = pointSize || 2;
    this.lineColor = lineColor || "rgba(0, 255, 255, 1)";
    this.pointColor = pointColor || "rgba(255, 0, 255, 1)";
  }
};
var DrawFaceLandmarks = class {
  faceLandmarks;
  options;
  constructor(faceLandmarks, options = {}) {
    this.faceLandmarks = faceLandmarks;
    this.options = new DrawFaceLandmarksOptions(options);
  }
  draw(canvasArg) {
    const ctx = getContext2dOrThrow(canvasArg);
    const {
      drawLines,
      drawPoints,
      lineWidth,
      lineColor,
      pointSize,
      pointColor
    } = this.options;
    if (drawLines && this.faceLandmarks instanceof FaceLandmarks68) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      drawContour(ctx, this.faceLandmarks.getJawOutline());
      drawContour(ctx, this.faceLandmarks.getLeftEyeBrow());
      drawContour(ctx, this.faceLandmarks.getRightEyeBrow());
      drawContour(ctx, this.faceLandmarks.getNose());
      drawContour(ctx, this.faceLandmarks.getLeftEye(), true);
      drawContour(ctx, this.faceLandmarks.getRightEye(), true);
      drawContour(ctx, this.faceLandmarks.getMouth(), true);
    }
    if (drawPoints) {
      ctx.strokeStyle = pointColor;
      ctx.fillStyle = pointColor;
      const drawPoint = (pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pointSize, 0, 2 * Math.PI);
        ctx.fill();
      };
      this.faceLandmarks.positions.forEach(drawPoint);
    }
  }
};
function drawFaceLandmarks(canvasArg, faceLandmarks) {
  const faceLandmarksArray = Array.isArray(faceLandmarks) ? faceLandmarks : [faceLandmarks];
  faceLandmarksArray.forEach((f) => {
    const landmarks = f instanceof FaceLandmarks ? f : isWithFaceLandmarks(f) ? f.landmarks : void 0;
    if (!landmarks) {
      throw new Error("drawFaceLandmarks - expected faceExpressions to be FaceLandmarks | WithFaceLandmarks<WithFaceDetection<{}>> or array thereof");
    }
    new DrawFaceLandmarks(landmarks).draw(canvasArg);
  });
}

// package.json
var version7 = "1.7.12";

// src/xception/extractParams.ts
function extractorsFactory2(extractWeights, paramMappings) {
  const extractConvParams = extractConvParamsFactory(extractWeights, paramMappings);
  const extractSeparableConvParams = extractSeparableConvParamsFactory(extractWeights, paramMappings);
  function extractReductionBlockParams(channelsIn, channelsOut, mappedPrefix) {
    const separable_conv0 = extractSeparableConvParams(channelsIn, channelsOut, `${mappedPrefix}/separable_conv0`);
    const separable_conv1 = extractSeparableConvParams(channelsOut, channelsOut, `${mappedPrefix}/separable_conv1`);
    const expansion_conv = extractConvParams(channelsIn, channelsOut, 1, `${mappedPrefix}/expansion_conv`);
    return { separable_conv0, separable_conv1, expansion_conv };
  }
  function extractMainBlockParams(channels, mappedPrefix) {
    const separable_conv0 = extractSeparableConvParams(channels, channels, `${mappedPrefix}/separable_conv0`);
    const separable_conv1 = extractSeparableConvParams(channels, channels, `${mappedPrefix}/separable_conv1`);
    const separable_conv2 = extractSeparableConvParams(channels, channels, `${mappedPrefix}/separable_conv2`);
    return { separable_conv0, separable_conv1, separable_conv2 };
  }
  return {
    extractConvParams,
    extractSeparableConvParams,
    extractReductionBlockParams,
    extractMainBlockParams
  };
}
function extractParams3(weights, numMainBlocks) {
  const paramMappings = [];
  const {
    extractWeights,
    getRemainingWeights
  } = extractWeightsFactory(weights);
  const {
    extractConvParams,
    extractSeparableConvParams,
    extractReductionBlockParams,
    extractMainBlockParams
  } = extractorsFactory2(extractWeights, paramMappings);
  const entry_flow_conv_in = extractConvParams(3, 32, 3, "entry_flow/conv_in");
  const entry_flow_reduction_block_0 = extractReductionBlockParams(32, 64, "entry_flow/reduction_block_0");
  const entry_flow_reduction_block_1 = extractReductionBlockParams(64, 128, "entry_flow/reduction_block_1");
  const entry_flow = {
    conv_in: entry_flow_conv_in,
    reduction_block_0: entry_flow_reduction_block_0,
    reduction_block_1: entry_flow_reduction_block_1
  };
  const middle_flow = {};
  range(numMainBlocks, 0, 1).forEach((idx) => {
    middle_flow[`main_block_${idx}`] = extractMainBlockParams(128, `middle_flow/main_block_${idx}`);
  });
  const exit_flow_reduction_block = extractReductionBlockParams(128, 256, "exit_flow/reduction_block");
  const exit_flow_separable_conv = extractSeparableConvParams(256, 512, "exit_flow/separable_conv");
  const exit_flow = {
    reduction_block: exit_flow_reduction_block,
    separable_conv: exit_flow_separable_conv
  };
  if (getRemainingWeights().length !== 0) {
    throw new Error(`weights remaing after extract: ${getRemainingWeights().length}`);
  }
  return {
    paramMappings,
    params: { entry_flow, middle_flow, exit_flow }
  };
}

// src/xception/extractParamsFromWeightMap.ts
function loadParamsFactory2(weightMap, paramMappings) {
  const extractWeightEntry = extractWeightEntryFactory(weightMap, paramMappings);
  const extractConvParams = loadConvParamsFactory(extractWeightEntry);
  const extractSeparableConvParams = loadSeparableConvParamsFactory(extractWeightEntry);
  function extractReductionBlockParams(mappedPrefix) {
    const separable_conv0 = extractSeparableConvParams(`${mappedPrefix}/separable_conv0`);
    const separable_conv1 = extractSeparableConvParams(`${mappedPrefix}/separable_conv1`);
    const expansion_conv = extractConvParams(`${mappedPrefix}/expansion_conv`);
    return { separable_conv0, separable_conv1, expansion_conv };
  }
  function extractMainBlockParams(mappedPrefix) {
    const separable_conv0 = extractSeparableConvParams(`${mappedPrefix}/separable_conv0`);
    const separable_conv1 = extractSeparableConvParams(`${mappedPrefix}/separable_conv1`);
    const separable_conv2 = extractSeparableConvParams(`${mappedPrefix}/separable_conv2`);
    return { separable_conv0, separable_conv1, separable_conv2 };
  }
  return {
    extractConvParams,
    extractSeparableConvParams,
    extractReductionBlockParams,
    extractMainBlockParams
  };
}
function extractParamsFromWeightMap3(weightMap, numMainBlocks) {
  const paramMappings = [];
  const {
    extractConvParams,
    extractSeparableConvParams,
    extractReductionBlockParams,
    extractMainBlockParams
  } = loadParamsFactory2(weightMap, paramMappings);
  const entry_flow_conv_in = extractConvParams("entry_flow/conv_in");
  const entry_flow_reduction_block_0 = extractReductionBlockParams("entry_flow/reduction_block_0");
  const entry_flow_reduction_block_1 = extractReductionBlockParams("entry_flow/reduction_block_1");
  const entry_flow = {
    conv_in: entry_flow_conv_in,
    reduction_block_0: entry_flow_reduction_block_0,
    reduction_block_1: entry_flow_reduction_block_1
  };
  const middle_flow = {};
  range(numMainBlocks, 0, 1).forEach((idx) => {
    middle_flow[`main_block_${idx}`] = extractMainBlockParams(`middle_flow/main_block_${idx}`);
  });
  const exit_flow_reduction_block = extractReductionBlockParams("exit_flow/reduction_block");
  const exit_flow_separable_conv = extractSeparableConvParams("exit_flow/separable_conv");
  const exit_flow = {
    reduction_block: exit_flow_reduction_block,
    separable_conv: exit_flow_separable_conv
  };
  disposeUnusedWeightTensors(weightMap, paramMappings);
  return { params: { entry_flow, middle_flow, exit_flow }, paramMappings };
}

// src/xception/TinyXception.ts
function conv(x, params, stride) {
  return (void 0)((void 0)(x, params.filters, stride, "same"), params.bias);
}
function reductionBlock(x, params, isActivateInput = true) {
  let out = isActivateInput ? (void 0)(x) : x;
  out = depthwiseSeparableConv(out, params.separable_conv0, [1, 1]);
  out = depthwiseSeparableConv((void 0)(out), params.separable_conv1, [1, 1]);
  out = (void 0)(out, [3, 3], [2, 2], "same");
  out = (void 0)(out, conv(x, params.expansion_conv, [2, 2]));
  return out;
}
function mainBlock(x, params) {
  let out = depthwiseSeparableConv((void 0)(x), params.separable_conv0, [1, 1]);
  out = depthwiseSeparableConv((void 0)(out), params.separable_conv1, [1, 1]);
  out = depthwiseSeparableConv((void 0)(out), params.separable_conv2, [1, 1]);
  out = (void 0)(out, x);
  return out;
}
var TinyXception = class extends NeuralNetwork {
  _numMainBlocks;
  constructor(numMainBlocks) {
    super("TinyXception");
    this._numMainBlocks = numMainBlocks;
  }
  forwardInput(input) {
    const { params } = this;
    if (!params) {
      throw new Error("TinyXception - load model before inference");
    }
    return (void 0)(() => {
      const batchTensor = (void 0)(input.toBatchTensor(112, true), "float32");
      const meanRgb = [122.782, 117.001, 104.298];
      const normalized = normalize(batchTensor, meanRgb).div(255);
      let out = (void 0)(conv(normalized, params.entry_flow.conv_in, [2, 2]));
      out = reductionBlock(out, params.entry_flow.reduction_block_0, false);
      out = reductionBlock(out, params.entry_flow.reduction_block_1);
      range(this._numMainBlocks, 0, 1).forEach((idx) => {
        out = mainBlock(out, params.middle_flow[`main_block_${idx}`]);
      });
      out = reductionBlock(out, params.exit_flow.reduction_block);
      out = (void 0)(depthwiseSeparableConv(out, params.exit_flow.separable_conv, [1, 1]));
      return out;
    });
  }
  async forward(input) {
    return this.forwardInput(await toNetInput(input));
  }
  getDefaultModelName() {
    return "tiny_xception_model";
  }
  extractParamsFromWeightMap(weightMap) {
    return extractParamsFromWeightMap3(weightMap, this._numMainBlocks);
  }
  extractParams(weights) {
    return extractParams3(weights, this._numMainBlocks);
  }
};

// src/ageGenderNet/extractParams.ts
function extractParams4(weights) {
  const paramMappings = [];
  const {
    extractWeights,
    getRemainingWeights
  } = extractWeightsFactory(weights);
  const extractFCParams = extractFCParamsFactory(extractWeights, paramMappings);
  const age = extractFCParams(512, 1, "fc/age");
  const gender = extractFCParams(512, 2, "fc/gender");
  if (getRemainingWeights().length !== 0) {
    throw new Error(`weights remaing after extract: ${getRemainingWeights().length}`);
  }
  return {
    paramMappings,
    params: { fc: { age, gender } }
  };
}

// src/ageGenderNet/extractParamsFromWeightMap.ts
function extractParamsFromWeightMap4(weightMap) {
  const paramMappings = [];
  const extractWeightEntry = extractWeightEntryFactory(weightMap, paramMappings);
  function extractFcParams(prefix) {
    const weights = extractWeightEntry(`${prefix}/weights`, 2);
    const bias = extractWeightEntry(`${prefix}/bias`, 1);
    return { weights, bias };
  }
  const params = {
    fc: {
      age: extractFcParams("fc/age"),
      gender: extractFcParams("fc/gender")
    }
  };
  disposeUnusedWeightTensors(weightMap, paramMappings);
  return { params, paramMappings };
}

// src/ageGenderNet/types.ts
var Gender = /* @__PURE__ */ ((Gender2) => {
  Gender2["FEMALE"] = "female";
  Gender2["MALE"] = "male";
  return Gender2;
})(Gender || {});

// src/ageGenderNet/AgeGenderNet.ts
var AgeGenderNet = class extends NeuralNetwork {
  _faceFeatureExtractor;
  constructor(faceFeatureExtractor = new TinyXception(2)) {
    super("AgeGenderNet");
    this._faceFeatureExtractor = faceFeatureExtractor;
  }
  get faceFeatureExtractor() {
    return this._faceFeatureExtractor;
  }
  runNet(input) {
    const { params } = this;
    if (!params) {
      throw new Error(`${this._name} - load model before inference`);
    }
    return (void 0)(() => {
      const bottleneckFeatures = input instanceof NetInput ? this.faceFeatureExtractor.forwardInput(input) : input;
      const pooled = (void 0)(bottleneckFeatures, [7, 7], [2, 2], "valid").as2D(bottleneckFeatures.shape[0], -1);
      const age = fullyConnectedLayer(pooled, params.fc.age).as1D();
      const gender = fullyConnectedLayer(pooled, params.fc.gender);
      return { age, gender };
    });
  }
  forwardInput(input) {
    return (void 0)(() => {
      const { age, gender } = this.runNet(input);
      return { age, gender: (void 0)(gender) };
    });
  }
  async forward(input) {
    return this.forwardInput(await toNetInput(input));
  }
  async predictAgeAndGender(input) {
    const netInput = await toNetInput(input);
    const out = await this.forwardInput(netInput);
    const ages = (void 0)(out.age);
    const genders = (void 0)(out.gender);
    const ageAndGenderTensors = ages.map((ageTensor, i) => ({
      ageTensor,
      genderTensor: genders[i]
    }));
    const predictionsByBatch = await Promise.all(
      ageAndGenderTensors.map(async ({ ageTensor, genderTensor }) => {
        const age = ageTensor.dataSync()[0];
        const probMale = genderTensor.dataSync()[0];
        const isMale = probMale > 0.5;
        const gender = isMale ? "male" /* MALE */ : "female" /* FEMALE */;
        const genderProbability = isMale ? probMale : 1 - probMale;
        ageTensor.dispose();
        genderTensor.dispose();
        return { age, gender, genderProbability };
      })
    );
    out.age.dispose();
    out.gender.dispose();
    return netInput.isBatchInput ? predictionsByBatch : predictionsByBatch[0];
  }
  getDefaultModelName() {
    return "age_gender_model";
  }
  dispose(throwOnRedispose = true) {
    this.faceFeatureExtractor.dispose(throwOnRedispose);
    super.dispose(throwOnRedispose);
  }
  loadClassifierParams(weights) {
    const { params, paramMappings } = this.extractClassifierParams(weights);
    this._params = params;
    this._paramMappings = paramMappings;
  }
  extractClassifierParams(weights) {
    return extractParams4(weights);
  }
  extractParamsFromWeightMap(weightMap) {
    const { featureExtractorMap, classifierMap } = seperateWeightMaps(weightMap);
    this.faceFeatureExtractor.loadFromWeightMap(featureExtractorMap);
    return extractParamsFromWeightMap4(classifierMap);
  }
  extractParams(weights) {
    const classifierWeightSize = 512 * 1 + 1 + (512 * 2 + 2);
    const featureExtractorWeights = weights.slice(0, weights.length - classifierWeightSize);
    const classifierWeights = weights.slice(weights.length - classifierWeightSize);
    this.faceFeatureExtractor.extractWeights(featureExtractorWeights);
    return this.extractClassifierParams(classifierWeights);
  }
};

// src/faceLandmarkNet/FaceLandmark68NetBase.ts
var FaceLandmark68NetBase = class extends FaceProcessor {
  postProcess(output, inputSize, originalDimensions) {
    const inputDimensions = originalDimensions.map(({ width, height }) => {
      const scale2 = inputSize / Math.max(height, width);
      return {
        width: width * scale2,
        height: height * scale2
      };
    });
    const batchSize = inputDimensions.length;
    return (void 0)(() => {
      const createInterleavedTensor = (fillX, fillY) => (void 0)([(void 0)([68], fillX, "float32"), (void 0)([68], fillY, "float32")], 1).as2D(1, 136).as1D();
      const getPadding = (batchIdx, cond) => {
        const { width, height } = inputDimensions[batchIdx];
        return cond(width, height) ? Math.abs(width - height) / 2 : 0;
      };
      const getPaddingX = (batchIdx) => getPadding(batchIdx, (w, h) => w < h);
      const getPaddingY = (batchIdx) => getPadding(batchIdx, (w, h) => h < w);
      const landmarkTensors = output.mul((void 0)([batchSize, 136], inputSize, "float32")).sub((void 0)(Array.from(Array(batchSize), (_, batchIdx) => createInterleavedTensor(
        getPaddingX(batchIdx),
        getPaddingY(batchIdx)
      )))).div((void 0)(Array.from(Array(batchSize), (_, batchIdx) => createInterleavedTensor(
        inputDimensions[batchIdx].width,
        inputDimensions[batchIdx].height
      ))));
      return landmarkTensors;
    });
  }
  forwardInput(input) {
    return (void 0)(() => {
      const out = this.runNet(input);
      return this.postProcess(
        out,
        input.inputSize,
        input.inputDimensions.map(([height, width]) => ({ height, width }))
      );
    });
  }
  async forward(input) {
    return this.forwardInput(await toNetInput(input));
  }
  async detectLandmarks(input) {
    const netInput = await toNetInput(input);
    const landmarkTensors = (void 0)(
      () => (void 0)(this.forwardInput(netInput))
    );
    const landmarksForBatch = await Promise.all(landmarkTensors.map(
      async (landmarkTensor, batchIdx) => {
        const landmarksArray = Array.from(landmarkTensor.dataSync());
        const xCoords = landmarksArray.filter((_, i) => isEven(i));
        const yCoords = landmarksArray.filter((_, i) => !isEven(i));
        return new FaceLandmarks68(
          Array(68).fill(0).map((_, i) => new Point(xCoords[i], yCoords[i])),
          {
            height: netInput.getInputHeight(batchIdx),
            width: netInput.getInputWidth(batchIdx)
          }
        );
      }
    ));
    landmarkTensors.forEach((t) => t.dispose());
    return netInput.isBatchInput ? landmarksForBatch : landmarksForBatch[0];
  }
  getClassifierChannelsOut() {
    return 136;
  }
};

// src/faceLandmarkNet/FaceLandmark68Net.ts
var FaceLandmark68Net = class extends FaceLandmark68NetBase {
  constructor(faceFeatureExtractor = new FaceFeatureExtractor()) {
    super("FaceLandmark68Net", faceFeatureExtractor);
  }
  getDefaultModelName() {
    return "face_landmark_68_model";
  }
  getClassifierChannelsIn() {
    return 256;
  }
};

// src/faceFeatureExtractor/extractParamsFromWeightMapTiny.ts
function extractParamsFromWeightMapTiny(weightMap) {
  const paramMappings = [];
  const {
    extractDenseBlock3Params
  } = loadParamsFactory(weightMap, paramMappings);
  const params = {
    dense0: extractDenseBlock3Params("dense0", true),
    dense1: extractDenseBlock3Params("dense1"),
    dense2: extractDenseBlock3Params("dense2")
  };
  disposeUnusedWeightTensors(weightMap, paramMappings);
  return { params, paramMappings };
}

// src/faceFeatureExtractor/extractParamsTiny.ts
function extractParamsTiny(weights) {
  const paramMappings = [];
  const {
    extractWeights,
    getRemainingWeights
  } = extractWeightsFactory(weights);
  const {
    extractDenseBlock3Params
  } = extractorsFactory(extractWeights, paramMappings);
  const dense0 = extractDenseBlock3Params(3, 32, "dense0", true);
  const dense1 = extractDenseBlock3Params(32, 64, "dense1");
  const dense2 = extractDenseBlock3Params(64, 128, "dense2");
  if (getRemainingWeights().length !== 0) {
    throw new Error(`weights remaing after extract: ${getRemainingWeights().length}`);
  }
  return {
    paramMappings,
    params: { dense0, dense1, dense2 }
  };
}

// src/faceFeatureExtractor/TinyFaceFeatureExtractor.ts
var TinyFaceFeatureExtractor = class extends NeuralNetwork {
  constructor() {
    super("TinyFaceFeatureExtractor");
  }
  forwardInput(input) {
    const { params } = this;
    if (!params) {
      throw new Error("TinyFaceFeatureExtractor - load model before inference");
    }
    return (void 0)(() => {
      const batchTensor = (void 0)(input.toBatchTensor(112, true), "float32");
      const meanRgb = [122.782, 117.001, 104.298];
      const normalized = normalize(batchTensor, meanRgb).div(255);
      let out = denseBlock3(normalized, params.dense0, true);
      out = denseBlock3(out, params.dense1);
      out = denseBlock3(out, params.dense2);
      out = (void 0)(out, [14, 14], [2, 2], "valid");
      return out;
    });
  }
  async forward(input) {
    return this.forwardInput(await toNetInput(input));
  }
  getDefaultModelName() {
    return "face_feature_extractor_tiny_model";
  }
  extractParamsFromWeightMap(weightMap) {
    return extractParamsFromWeightMapTiny(weightMap);
  }
  extractParams(weights) {
    return extractParamsTiny(weights);
  }
};

// src/faceLandmarkNet/FaceLandmark68TinyNet.ts
var FaceLandmark68TinyNet = class extends FaceLandmark68NetBase {
  constructor(faceFeatureExtractor = new TinyFaceFeatureExtractor()) {
    super("FaceLandmark68TinyNet", faceFeatureExtractor);
  }
  getDefaultModelName() {
    return "face_landmark_68_tiny_model";
  }
  getClassifierChannelsIn() {
    return 128;
  }
};

// src/faceLandmarkNet/index.ts
var FaceLandmarkNet = class extends FaceLandmark68Net {
};

// src/faceRecognitionNet/scaleLayer.ts
function scale(x, params) {
  return (void 0)((void 0)(x, params.weights), params.biases);
}

// src/faceRecognitionNet/convLayer.ts
function convLayer2(x, params, strides, withRelu, padding = "same") {
  const { filters, bias } = params.conv;
  let out = (void 0)(x, filters, strides, padding);
  out = (void 0)(out, bias);
  out = scale(out, params.scale);
  return withRelu ? (void 0)(out) : out;
}
function conv2(x, params) {
  return convLayer2(x, params, [1, 1], true);
}
function convNoRelu(x, params) {
  return convLayer2(x, params, [1, 1], false);
}
function convDown(x, params) {
  return convLayer2(x, params, [2, 2], true, "valid");
}

// src/faceRecognitionNet/extractParams.ts
function extractorsFactory3(extractWeights, paramMappings) {
  function extractFilterValues(numFilterValues, numFilters, filterSize) {
    const weights = extractWeights(numFilterValues);
    const depth = weights.length / (numFilters * filterSize * filterSize);
    if (isFloat(depth)) {
      throw new Error(`depth has to be an integer: ${depth}, weights.length: ${weights.length}, numFilters: ${numFilters}, filterSize: ${filterSize}`);
    }
    return (void 0)(
      () => (void 0)(
        (void 0)(weights, [numFilters, depth, filterSize, filterSize]),
        [2, 3, 1, 0]
      )
    );
  }
  function extractConvParams(numFilterValues, numFilters, filterSize, mappedPrefix) {
    const filters = extractFilterValues(numFilterValues, numFilters, filterSize);
    const bias = (void 0)(extractWeights(numFilters));
    paramMappings.push(
      { paramPath: `${mappedPrefix}/filters` },
      { paramPath: `${mappedPrefix}/bias` }
    );
    return { filters, bias };
  }
  function extractScaleLayerParams(numWeights, mappedPrefix) {
    const weights = (void 0)(extractWeights(numWeights));
    const biases = (void 0)(extractWeights(numWeights));
    paramMappings.push(
      { paramPath: `${mappedPrefix}/weights` },
      { paramPath: `${mappedPrefix}/biases` }
    );
    return {
      weights,
      biases
    };
  }
  function extractConvLayerParams(numFilterValues, numFilters, filterSize, mappedPrefix) {
    const conv3 = extractConvParams(numFilterValues, numFilters, filterSize, `${mappedPrefix}/conv`);
    const scale2 = extractScaleLayerParams(numFilters, `${mappedPrefix}/scale`);
    return { conv: conv3, scale: scale2 };
  }
  function extractResidualLayerParams(numFilterValues, numFilters, filterSize, mappedPrefix, isDown = false) {
    const conv1 = extractConvLayerParams((isDown ? 0.5 : 1) * numFilterValues, numFilters, filterSize, `${mappedPrefix}/conv1`);
    const conv22 = extractConvLayerParams(numFilterValues, numFilters, filterSize, `${mappedPrefix}/conv2`);
    return { conv1, conv2: conv22 };
  }
  return {
    extractConvLayerParams,
    extractResidualLayerParams
  };
}
function extractParams5(weights) {
  const {
    extractWeights,
    getRemainingWeights
  } = extractWeightsFactory(weights);
  const paramMappings = [];
  const {
    extractConvLayerParams,
    extractResidualLayerParams
  } = extractorsFactory3(extractWeights, paramMappings);
  const conv32_down = extractConvLayerParams(4704, 32, 7, "conv32_down");
  const conv32_1 = extractResidualLayerParams(9216, 32, 3, "conv32_1");
  const conv32_2 = extractResidualLayerParams(9216, 32, 3, "conv32_2");
  const conv32_3 = extractResidualLayerParams(9216, 32, 3, "conv32_3");
  const conv64_down = extractResidualLayerParams(36864, 64, 3, "conv64_down", true);
  const conv64_1 = extractResidualLayerParams(36864, 64, 3, "conv64_1");
  const conv64_2 = extractResidualLayerParams(36864, 64, 3, "conv64_2");
  const conv64_3 = extractResidualLayerParams(36864, 64, 3, "conv64_3");
  const conv128_down = extractResidualLayerParams(147456, 128, 3, "conv128_down", true);
  const conv128_1 = extractResidualLayerParams(147456, 128, 3, "conv128_1");
  const conv128_2 = extractResidualLayerParams(147456, 128, 3, "conv128_2");
  const conv256_down = extractResidualLayerParams(589824, 256, 3, "conv256_down", true);
  const conv256_1 = extractResidualLayerParams(589824, 256, 3, "conv256_1");
  const conv256_2 = extractResidualLayerParams(589824, 256, 3, "conv256_2");
  const conv256_down_out = extractResidualLayerParams(589824, 256, 3, "conv256_down_out");
  const fc = (void 0)(
    () => (void 0)((void 0)(extractWeights(256 * 128), [128, 256]), [1, 0])
  );
  paramMappings.push({ paramPath: "fc" });
  if (getRemainingWeights().length !== 0) {
    throw new Error(`weights remaing after extract: ${getRemainingWeights().length}`);
  }
  const params = {
    conv32_down,
    conv32_1,
    conv32_2,
    conv32_3,
    conv64_down,
    conv64_1,
    conv64_2,
    conv64_3,
    conv128_down,
    conv128_1,
    conv128_2,
    conv256_down,
    conv256_1,
    conv256_2,
    conv256_down_out,
    fc
  };
  return { params, paramMappings };
}

// src/faceRecognitionNet/extractParamsFromWeightMap.ts
function extractorsFactory4(weightMap, paramMappings) {
  const extractWeightEntry = extractWeightEntryFactory(weightMap, paramMappings);
  function extractScaleLayerParams(prefix) {
    const weights = extractWeightEntry(`${prefix}/scale/weights`, 1);
    const biases = extractWeightEntry(`${prefix}/scale/biases`, 1);
    return { weights, biases };
  }
  function extractConvLayerParams(prefix) {
    const filters = extractWeightEntry(`${prefix}/conv/filters`, 4);
    const bias = extractWeightEntry(`${prefix}/conv/bias`, 1);
    const scale2 = extractScaleLayerParams(prefix);
    return { conv: { filters, bias }, scale: scale2 };
  }
  function extractResidualLayerParams(prefix) {
    return {
      conv1: extractConvLayerParams(`${prefix}/conv1`),
      conv2: extractConvLayerParams(`${prefix}/conv2`)
    };
  }
  return {
    extractConvLayerParams,
    extractResidualLayerParams
  };
}
function extractParamsFromWeightMap5(weightMap) {
  const paramMappings = [];
  const {
    extractConvLayerParams,
    extractResidualLayerParams
  } = extractorsFactory4(weightMap, paramMappings);
  const conv32_down = extractConvLayerParams("conv32_down");
  const conv32_1 = extractResidualLayerParams("conv32_1");
  const conv32_2 = extractResidualLayerParams("conv32_2");
  const conv32_3 = extractResidualLayerParams("conv32_3");
  const conv64_down = extractResidualLayerParams("conv64_down");
  const conv64_1 = extractResidualLayerParams("conv64_1");
  const conv64_2 = extractResidualLayerParams("conv64_2");
  const conv64_3 = extractResidualLayerParams("conv64_3");
  const conv128_down = extractResidualLayerParams("conv128_down");
  const conv128_1 = extractResidualLayerParams("conv128_1");
  const conv128_2 = extractResidualLayerParams("conv128_2");
  const conv256_down = extractResidualLayerParams("conv256_down");
  const conv256_1 = extractResidualLayerParams("conv256_1");
  const conv256_2 = extractResidualLayerParams("conv256_2");
  const conv256_down_out = extractResidualLayerParams("conv256_down_out");
  const { fc } = weightMap;
  paramMappings.push({ originalPath: "fc", paramPath: "fc" });
  if (!isTensor2D(fc)) {
    throw new Error(`expected weightMap[fc] to be a Tensor2D, instead have ${fc}`);
  }
  const params = {
    conv32_down,
    conv32_1,
    conv32_2,
    conv32_3,
    conv64_down,
    conv64_1,
    conv64_2,
    conv64_3,
    conv128_down,
    conv128_1,
    conv128_2,
    conv256_down,
    conv256_1,
    conv256_2,
    conv256_down_out,
    fc
  };
  disposeUnusedWeightTensors(weightMap, paramMappings);
  return { params, paramMappings };
}

// src/faceRecognitionNet/residualLayer.ts
function residual(x, params) {
  let out = conv2(x, params.conv1);
  out = convNoRelu(out, params.conv2);
  out = (void 0)(out, x);
  out = (void 0)(out);
  return out;
}
function residualDown(x, params) {
  let out = convDown(x, params.conv1);
  out = convNoRelu(out, params.conv2);
  let pooled = (void 0)(x, 2, 2, "valid");
  const zeros2 = (void 0)(pooled.shape);
  const isPad = pooled.shape[3] !== out.shape[3];
  const isAdjustShape = pooled.shape[1] !== out.shape[1] || pooled.shape[2] !== out.shape[2];
  if (isAdjustShape) {
    const padShapeX = [...out.shape];
    padShapeX[1] = 1;
    const zerosW = (void 0)(padShapeX);
    out = (void 0)([out, zerosW], 1);
    const padShapeY = [...out.shape];
    padShapeY[2] = 1;
    const zerosH = (void 0)(padShapeY);
    out = (void 0)([out, zerosH], 2);
  }
  pooled = isPad ? (void 0)([pooled, zeros2], 3) : pooled;
  out = (void 0)(pooled, out);
  out = (void 0)(out);
  return out;
}

// src/faceRecognitionNet/FaceRecognitionNet.ts
var FaceRecognitionNet = class extends NeuralNetwork {
  constructor() {
    super("FaceRecognitionNet");
  }
  forwardInput(input) {
    const { params } = this;
    if (!params) {
      throw new Error("FaceRecognitionNet - load model before inference");
    }
    return (void 0)(() => {
      const batchTensor = (void 0)(input.toBatchTensor(150, true), "float32");
      const meanRgb = [122.782, 117.001, 104.298];
      const normalized = normalize(batchTensor, meanRgb).div(255);
      let out = convDown(normalized, params.conv32_down);
      out = (void 0)(out, 3, 2, "valid");
      out = residual(out, params.conv32_1);
      out = residual(out, params.conv32_2);
      out = residual(out, params.conv32_3);
      out = residualDown(out, params.conv64_down);
      out = residual(out, params.conv64_1);
      out = residual(out, params.conv64_2);
      out = residual(out, params.conv64_3);
      out = residualDown(out, params.conv128_down);
      out = residual(out, params.conv128_1);
      out = residual(out, params.conv128_2);
      out = residualDown(out, params.conv256_down);
      out = residual(out, params.conv256_1);
      out = residual(out, params.conv256_2);
      out = residualDown(out, params.conv256_down_out);
      const globalAvg = out.mean([1, 2]);
      const fullyConnected = (void 0)(globalAvg, params.fc);
      return fullyConnected;
    });
  }
  async forward(input) {
    return this.forwardInput(await toNetInput(input));
  }
  async computeFaceDescriptor(input) {
    if (input?.shape?.some((dim) => dim <= 0))
      return new Float32Array(128);
    const netInput = await toNetInput(input);
    const faceDescriptorTensors = (void 0)(() => (void 0)(this.forwardInput(netInput)));
    const faceDescriptorsForBatch = await Promise.all(faceDescriptorTensors.map((t) => t.data()));
    faceDescriptorTensors.forEach((t) => t.dispose());
    return netInput.isBatchInput ? faceDescriptorsForBatch : faceDescriptorsForBatch[0];
  }
  getDefaultModelName() {
    return "face_recognition_model";
  }
  extractParamsFromWeightMap(weightMap) {
    return extractParamsFromWeightMap5(weightMap);
  }
  extractParams(weights) {
    return extractParams5(weights);
  }
};

// src/faceRecognitionNet/index.ts
function createFaceRecognitionNet(weights) {
  const net = new FaceRecognitionNet();
  net.extractWeights(weights);
  return net;
}

// src/factories/WithFaceDescriptor.ts
function extendWithFaceDescriptor(sourceObj, descriptor) {
  const extension = { descriptor };
  return { ...sourceObj, ...extension };
}

// src/factories/WithAge.ts
function isWithAge(obj) {
  return typeof obj.age === "number";
}
function extendWithAge(sourceObj, age) {
  const extension = { age };
  return { ...sourceObj, ...extension };
}

// src/factories/WithGender.ts
function isWithGender(obj) {
  return (obj.gender === "male" /* MALE */ || obj.gender === "female" /* FEMALE */) && isValidProbablitiy(obj.genderProbability);
}
function extendWithGender(sourceObj, gender, genderProbability) {
  const extension = { gender, genderProbability };
  return { ...sourceObj, ...extension };
}

// src/ssdMobilenetv1/extractParams.ts
function extractorsFactory5(extractWeights, paramMappings) {
  function extractDepthwiseConvParams(numChannels, mappedPrefix) {
    const filters = (void 0)(extractWeights(3 * 3 * numChannels), [3, 3, numChannels, 1]);
    const batch_norm_scale = (void 0)(extractWeights(numChannels));
    const batch_norm_offset = (void 0)(extractWeights(numChannels));
    const batch_norm_mean = (void 0)(extractWeights(numChannels));
    const batch_norm_variance = (void 0)(extractWeights(numChannels));
    paramMappings.push(
      { paramPath: `${mappedPrefix}/filters` },
      { paramPath: `${mappedPrefix}/batch_norm_scale` },
      { paramPath: `${mappedPrefix}/batch_norm_offset` },
      { paramPath: `${mappedPrefix}/batch_norm_mean` },
      { paramPath: `${mappedPrefix}/batch_norm_variance` }
    );
    return {
      filters,
      batch_norm_scale,
      batch_norm_offset,
      batch_norm_mean,
      batch_norm_variance
    };
  }
  function extractConvParams(channelsIn, channelsOut, filterSize, mappedPrefix, isPointwiseConv) {
    const filters = (void 0)(
      extractWeights(channelsIn * channelsOut * filterSize * filterSize),
      [filterSize, filterSize, channelsIn, channelsOut]
    );
    const bias = (void 0)(extractWeights(channelsOut));
    paramMappings.push(
      { paramPath: `${mappedPrefix}/filters` },
      { paramPath: `${mappedPrefix}/${isPointwiseConv ? "batch_norm_offset" : "bias"}` }
    );
    return { filters, bias };
  }
  function extractPointwiseConvParams(channelsIn, channelsOut, filterSize, mappedPrefix) {
    const {
      filters,
      bias
    } = extractConvParams(channelsIn, channelsOut, filterSize, mappedPrefix, true);
    return {
      filters,
      batch_norm_offset: bias
    };
  }
  function extractConvPairParams(channelsIn, channelsOut, mappedPrefix) {
    const depthwise_conv = extractDepthwiseConvParams(channelsIn, `${mappedPrefix}/depthwise_conv`);
    const pointwise_conv = extractPointwiseConvParams(channelsIn, channelsOut, 1, `${mappedPrefix}/pointwise_conv`);
    return { depthwise_conv, pointwise_conv };
  }
  function extractMobilenetV1Params() {
    const conv_0 = extractPointwiseConvParams(3, 32, 3, "mobilenetv1/conv_0");
    const conv_1 = extractConvPairParams(32, 64, "mobilenetv1/conv_1");
    const conv_2 = extractConvPairParams(64, 128, "mobilenetv1/conv_2");
    const conv_3 = extractConvPairParams(128, 128, "mobilenetv1/conv_3");
    const conv_4 = extractConvPairParams(128, 256, "mobilenetv1/conv_4");
    const conv_5 = extractConvPairParams(256, 256, "mobilenetv1/conv_5");
    const conv_6 = extractConvPairParams(256, 512, "mobilenetv1/conv_6");
    const conv_7 = extractConvPairParams(512, 512, "mobilenetv1/conv_7");
    const conv_8 = extractConvPairParams(512, 512, "mobilenetv1/conv_8");
    const conv_9 = extractConvPairParams(512, 512, "mobilenetv1/conv_9");
    const conv_10 = extractConvPairParams(512, 512, "mobilenetv1/conv_10");
    const conv_11 = extractConvPairParams(512, 512, "mobilenetv1/conv_11");
    const conv_12 = extractConvPairParams(512, 1024, "mobilenetv1/conv_12");
    const conv_13 = extractConvPairParams(1024, 1024, "mobilenetv1/conv_13");
    return {
      conv_0,
      conv_1,
      conv_2,
      conv_3,
      conv_4,
      conv_5,
      conv_6,
      conv_7,
      conv_8,
      conv_9,
      conv_10,
      conv_11,
      conv_12,
      conv_13
    };
  }
  function extractPredictionLayerParams() {
    const conv_0 = extractPointwiseConvParams(1024, 256, 1, "prediction_layer/conv_0");
    const conv_1 = extractPointwiseConvParams(256, 512, 3, "prediction_layer/conv_1");
    const conv_2 = extractPointwiseConvParams(512, 128, 1, "prediction_layer/conv_2");
    const conv_3 = extractPointwiseConvParams(128, 256, 3, "prediction_layer/conv_3");
    const conv_4 = extractPointwiseConvParams(256, 128, 1, "prediction_layer/conv_4");
    const conv_5 = extractPointwiseConvParams(128, 256, 3, "prediction_layer/conv_5");
    const conv_6 = extractPointwiseConvParams(256, 64, 1, "prediction_layer/conv_6");
    const conv_7 = extractPointwiseConvParams(64, 128, 3, "prediction_layer/conv_7");
    const box_encoding_0_predictor = extractConvParams(512, 12, 1, "prediction_layer/box_predictor_0/box_encoding_predictor");
    const class_predictor_0 = extractConvParams(512, 9, 1, "prediction_layer/box_predictor_0/class_predictor");
    const box_encoding_1_predictor = extractConvParams(1024, 24, 1, "prediction_layer/box_predictor_1/box_encoding_predictor");
    const class_predictor_1 = extractConvParams(1024, 18, 1, "prediction_layer/box_predictor_1/class_predictor");
    const box_encoding_2_predictor = extractConvParams(512, 24, 1, "prediction_layer/box_predictor_2/box_encoding_predictor");
    const class_predictor_2 = extractConvParams(512, 18, 1, "prediction_layer/box_predictor_2/class_predictor");
    const box_encoding_3_predictor = extractConvParams(256, 24, 1, "prediction_layer/box_predictor_3/box_encoding_predictor");
    const class_predictor_3 = extractConvParams(256, 18, 1, "prediction_layer/box_predictor_3/class_predictor");
    const box_encoding_4_predictor = extractConvParams(256, 24, 1, "prediction_layer/box_predictor_4/box_encoding_predictor");
    const class_predictor_4 = extractConvParams(256, 18, 1, "prediction_layer/box_predictor_4/class_predictor");
    const box_encoding_5_predictor = extractConvParams(128, 24, 1, "prediction_layer/box_predictor_5/box_encoding_predictor");
    const class_predictor_5 = extractConvParams(128, 18, 1, "prediction_layer/box_predictor_5/class_predictor");
    const box_predictor_0 = {
      box_encoding_predictor: box_encoding_0_predictor,
      class_predictor: class_predictor_0
    };
    const box_predictor_1 = {
      box_encoding_predictor: box_encoding_1_predictor,
      class_predictor: class_predictor_1
    };
    const box_predictor_2 = {
      box_encoding_predictor: box_encoding_2_predictor,
      class_predictor: class_predictor_2
    };
    const box_predictor_3 = {
      box_encoding_predictor: box_encoding_3_predictor,
      class_predictor: class_predictor_3
    };
    const box_predictor_4 = {
      box_encoding_predictor: box_encoding_4_predictor,
      class_predictor: class_predictor_4
    };
    const box_predictor_5 = {
      box_encoding_predictor: box_encoding_5_predictor,
      class_predictor: class_predictor_5
    };
    return {
      conv_0,
      conv_1,
      conv_2,
      conv_3,
      conv_4,
      conv_5,
      conv_6,
      conv_7,
      box_predictor_0,
      box_predictor_1,
      box_predictor_2,
      box_predictor_3,
      box_predictor_4,
      box_predictor_5
    };
  }
  return {
    extractMobilenetV1Params,
    extractPredictionLayerParams
  };
}
function extractParams6(weights) {
  const paramMappings = [];
  const {
    extractWeights,
    getRemainingWeights
  } = extractWeightsFactory(weights);
  const {
    extractMobilenetV1Params,
    extractPredictionLayerParams
  } = extractorsFactory5(extractWeights, paramMappings);
  const mobilenetv1 = extractMobilenetV1Params();
  const prediction_layer = extractPredictionLayerParams();
  const extra_dim = (void 0)(
    extractWeights(5118 * 4),
    [1, 5118, 4]
  );
  const output_layer = {
    extra_dim
  };
  paramMappings.push({ paramPath: "output_layer/extra_dim" });
  if (getRemainingWeights().length !== 0) {
    throw new Error(`weights remaing after extract: ${getRemainingWeights().length}`);
  }
  return {
    params: {
      mobilenetv1,
      prediction_layer,
      output_layer
    },
    paramMappings
  };
}

// src/ssdMobilenetv1/extractParamsFromWeightMap.ts
function extractorsFactory6(weightMap, paramMappings) {
  const extractWeightEntry = extractWeightEntryFactory(weightMap, paramMappings);
  function extractPointwiseConvParams(prefix, idx, mappedPrefix) {
    const filters = extractWeightEntry(`${prefix}/Conv2d_${idx}_pointwise/weights`, 4, `${mappedPrefix}/filters`);
    const batch_norm_offset = extractWeightEntry(`${prefix}/Conv2d_${idx}_pointwise/convolution_bn_offset`, 1, `${mappedPrefix}/batch_norm_offset`);
    return { filters, batch_norm_offset };
  }
  function extractConvPairParams(idx) {
    const mappedPrefix = `mobilenetv1/conv_${idx}`;
    const prefixDepthwiseConv = `MobilenetV1/Conv2d_${idx}_depthwise`;
    const mappedPrefixDepthwiseConv = `${mappedPrefix}/depthwise_conv`;
    const mappedPrefixPointwiseConv = `${mappedPrefix}/pointwise_conv`;
    const filters = extractWeightEntry(`${prefixDepthwiseConv}/depthwise_weights`, 4, `${mappedPrefixDepthwiseConv}/filters`);
    const batch_norm_scale = extractWeightEntry(`${prefixDepthwiseConv}/BatchNorm/gamma`, 1, `${mappedPrefixDepthwiseConv}/batch_norm_scale`);
    const batch_norm_offset = extractWeightEntry(`${prefixDepthwiseConv}/BatchNorm/beta`, 1, `${mappedPrefixDepthwiseConv}/batch_norm_offset`);
    const batch_norm_mean = extractWeightEntry(`${prefixDepthwiseConv}/BatchNorm/moving_mean`, 1, `${mappedPrefixDepthwiseConv}/batch_norm_mean`);
    const batch_norm_variance = extractWeightEntry(`${prefixDepthwiseConv}/BatchNorm/moving_variance`, 1, `${mappedPrefixDepthwiseConv}/batch_norm_variance`);
    return {
      depthwise_conv: {
        filters,
        batch_norm_scale,
        batch_norm_offset,
        batch_norm_mean,
        batch_norm_variance
      },
      pointwise_conv: extractPointwiseConvParams("MobilenetV1", idx, mappedPrefixPointwiseConv)
    };
  }
  function extractMobilenetV1Params() {
    return {
      conv_0: extractPointwiseConvParams("MobilenetV1", 0, "mobilenetv1/conv_0"),
      conv_1: extractConvPairParams(1),
      conv_2: extractConvPairParams(2),
      conv_3: extractConvPairParams(3),
      conv_4: extractConvPairParams(4),
      conv_5: extractConvPairParams(5),
      conv_6: extractConvPairParams(6),
      conv_7: extractConvPairParams(7),
      conv_8: extractConvPairParams(8),
      conv_9: extractConvPairParams(9),
      conv_10: extractConvPairParams(10),
      conv_11: extractConvPairParams(11),
      conv_12: extractConvPairParams(12),
      conv_13: extractConvPairParams(13)
    };
  }
  function extractConvParams(prefix, mappedPrefix) {
    const filters = extractWeightEntry(`${prefix}/weights`, 4, `${mappedPrefix}/filters`);
    const bias = extractWeightEntry(`${prefix}/biases`, 1, `${mappedPrefix}/bias`);
    return { filters, bias };
  }
  function extractBoxPredictorParams(idx) {
    const box_encoding_predictor = extractConvParams(
      `Prediction/BoxPredictor_${idx}/BoxEncodingPredictor`,
      `prediction_layer/box_predictor_${idx}/box_encoding_predictor`
    );
    const class_predictor = extractConvParams(
      `Prediction/BoxPredictor_${idx}/ClassPredictor`,
      `prediction_layer/box_predictor_${idx}/class_predictor`
    );
    return { box_encoding_predictor, class_predictor };
  }
  function extractPredictionLayerParams() {
    return {
      conv_0: extractPointwiseConvParams("Prediction", 0, "prediction_layer/conv_0"),
      conv_1: extractPointwiseConvParams("Prediction", 1, "prediction_layer/conv_1"),
      conv_2: extractPointwiseConvParams("Prediction", 2, "prediction_layer/conv_2"),
      conv_3: extractPointwiseConvParams("Prediction", 3, "prediction_layer/conv_3"),
      conv_4: extractPointwiseConvParams("Prediction", 4, "prediction_layer/conv_4"),
      conv_5: extractPointwiseConvParams("Prediction", 5, "prediction_layer/conv_5"),
      conv_6: extractPointwiseConvParams("Prediction", 6, "prediction_layer/conv_6"),
      conv_7: extractPointwiseConvParams("Prediction", 7, "prediction_layer/conv_7"),
      box_predictor_0: extractBoxPredictorParams(0),
      box_predictor_1: extractBoxPredictorParams(1),
      box_predictor_2: extractBoxPredictorParams(2),
      box_predictor_3: extractBoxPredictorParams(3),
      box_predictor_4: extractBoxPredictorParams(4),
      box_predictor_5: extractBoxPredictorParams(5)
    };
  }
  return {
    extractMobilenetV1Params,
    extractPredictionLayerParams
  };
}
function extractParamsFromWeightMap6(weightMap) {
  const paramMappings = [];
  const {
    extractMobilenetV1Params,
    extractPredictionLayerParams
  } = extractorsFactory6(weightMap, paramMappings);
  const extra_dim = weightMap["Output/extra_dim"];
  paramMappings.push({ originalPath: "Output/extra_dim", paramPath: "output_layer/extra_dim" });
  if (!isTensor3D(extra_dim)) {
    throw new Error(`expected weightMap['Output/extra_dim'] to be a Tensor3D, instead have ${extra_dim}`);
  }
  const params = {
    mobilenetv1: extractMobilenetV1Params(),
    prediction_layer: extractPredictionLayerParams(),
    output_layer: {
      extra_dim
    }
  };
  disposeUnusedWeightTensors(weightMap, paramMappings);
  return { params, paramMappings };
}

// src/ssdMobilenetv1/pointwiseConvLayer.ts
function pointwiseConvLayer(x, params, strides) {
  return (void 0)(() => {
    let out = (void 0)(x, params.filters, strides, "same");
    out = (void 0)(out, params.batch_norm_offset);
    return (void 0)(out, 0, 6);
  });
}

// src/ssdMobilenetv1/mobileNetV1.ts
var epsilon = 0.0010000000474974513;
function depthwiseConvLayer(x, params, strides) {
  return (void 0)(() => {
    let out = (void 0)(x, params.filters, strides, "same");
    out = (void 0)(
      out,
      params.batch_norm_mean,
      params.batch_norm_variance,
      params.batch_norm_offset,
      params.batch_norm_scale,
      epsilon
    );
    return (void 0)(out, 0, 6);
  });
}
function getStridesForLayerIdx(layerIdx) {
  return [2, 4, 6, 12].some((idx) => idx === layerIdx) ? [2, 2] : [1, 1];
}
function mobileNetV1(x, params) {
  return (void 0)(() => {
    let conv11;
    let out = pointwiseConvLayer(x, params.conv_0, [2, 2]);
    const convPairParams = [
      params.conv_1,
      params.conv_2,
      params.conv_3,
      params.conv_4,
      params.conv_5,
      params.conv_6,
      params.conv_7,
      params.conv_8,
      params.conv_9,
      params.conv_10,
      params.conv_11,
      params.conv_12,
      params.conv_13
    ];
    convPairParams.forEach((param, i) => {
      const layerIdx = i + 1;
      const depthwiseConvStrides = getStridesForLayerIdx(layerIdx);
      out = depthwiseConvLayer(out, param.depthwise_conv, depthwiseConvStrides);
      out = pointwiseConvLayer(out, param.pointwise_conv, [1, 1]);
      if (layerIdx === 11)
        conv11 = out;
    });
    if (conv11 === null) {
      throw new Error("mobileNetV1 - output of conv layer 11 is null");
    }
    return {
      out,
      conv11
    };
  });
}

// src/ssdMobilenetv1/nonMaxSuppression.ts
function IOU(boxes, i, j) {
  const boxesData = boxes.arraySync();
  const yminI = Math.min(boxesData[i][0], boxesData[i][2]);
  const xminI = Math.min(boxesData[i][1], boxesData[i][3]);
  const ymaxI = Math.max(boxesData[i][0], boxesData[i][2]);
  const xmaxI = Math.max(boxesData[i][1], boxesData[i][3]);
  const yminJ = Math.min(boxesData[j][0], boxesData[j][2]);
  const xminJ = Math.min(boxesData[j][1], boxesData[j][3]);
  const ymaxJ = Math.max(boxesData[j][0], boxesData[j][2]);
  const xmaxJ = Math.max(boxesData[j][1], boxesData[j][3]);
  const areaI = (ymaxI - yminI) * (xmaxI - xminI);
  const areaJ = (ymaxJ - yminJ) * (xmaxJ - xminJ);
  if (areaI <= 0 || areaJ <= 0)
    return 0;
  const intersectionYmin = Math.max(yminI, yminJ);
  const intersectionXmin = Math.max(xminI, xminJ);
  const intersectionYmax = Math.min(ymaxI, ymaxJ);
  const intersectionXmax = Math.min(xmaxI, xmaxJ);
  const intersectionArea = Math.max(intersectionYmax - intersectionYmin, 0) * Math.max(intersectionXmax - intersectionXmin, 0);
  return intersectionArea / (areaI + areaJ - intersectionArea);
}
function nonMaxSuppression2(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
  const numBoxes = boxes.shape[0];
  const outputSize = Math.min(maxOutputSize, numBoxes);
  const candidates = scores.map((score, boxIndex) => ({ score, boxIndex })).filter((c) => c.score > scoreThreshold).sort((c1, c2) => c2.score - c1.score);
  const suppressFunc = (x) => x <= iouThreshold ? 1 : 0;
  const selected = [];
  candidates.forEach((c) => {
    if (selected.length >= outputSize)
      return;
    const originalScore = c.score;
    for (let j = selected.length - 1; j >= 0; --j) {
      const iou2 = IOU(boxes, c.boxIndex, selected[j]);
      if (iou2 === 0)
        continue;
      c.score *= suppressFunc(iou2);
      if (c.score <= scoreThreshold)
        break;
    }
    if (originalScore === c.score) {
      selected.push(c.boxIndex);
    }
  });
  return selected;
}

// src/ssdMobilenetv1/outputLayer.ts
function getCenterCoordinatesAndSizesLayer(x) {
  const vec = (void 0)((void 0)(x, [1, 0]));
  const sizes = [
    (void 0)(vec[2], vec[0]),
    (void 0)(vec[3], vec[1])
  ];
  const centers = [
    (void 0)(vec[0], (void 0)(sizes[0], 2)),
    (void 0)(vec[1], (void 0)(sizes[1], 2))
  ];
  return { sizes, centers };
}
function decodeBoxesLayer(x0, x1) {
  const { sizes, centers } = getCenterCoordinatesAndSizesLayer(x0);
  const vec = (void 0)((void 0)(x1, [1, 0]));
  const div0_out = (void 0)((void 0)((void 0)((void 0)(vec[2], 5)), sizes[0]), 2);
  const add0_out = (void 0)((void 0)((void 0)(vec[0], 10), sizes[0]), centers[0]);
  const div1_out = (void 0)((void 0)((void 0)((void 0)(vec[3], 5)), sizes[1]), 2);
  const add1_out = (void 0)((void 0)((void 0)(vec[1], 10), sizes[1]), centers[1]);
  return (void 0)(
    (void 0)([
      (void 0)(add0_out, div0_out),
      (void 0)(add1_out, div1_out),
      (void 0)(add0_out, div0_out),
      (void 0)(add1_out, div1_out)
    ]),
    [1, 0]
  );
}
function outputLayer(boxPredictions, classPredictions, params) {
  return (void 0)(() => {
    const batchSize = boxPredictions.shape[0];
    let boxes = decodeBoxesLayer(
      (void 0)((void 0)(params.extra_dim, [batchSize, 1, 1]), [-1, 4]),
      (void 0)(boxPredictions, [-1, 4])
    );
    boxes = (void 0)(boxes, [batchSize, boxes.shape[0] / batchSize, 4]);
    const scoresAndClasses = (void 0)((void 0)(classPredictions, [0, 0, 1], [-1, -1, -1]));
    let scores = (void 0)(scoresAndClasses, [0, 0, 0], [-1, -1, 1]);
    scores = (void 0)(scores, [batchSize, scores.shape[1]]);
    const boxesByBatch = (void 0)(boxes);
    const scoresByBatch = (void 0)(scores);
    return { boxes: boxesByBatch, scores: scoresByBatch };
  });
}

// src/ssdMobilenetv1/boxPredictionLayer.ts
function boxPredictionLayer(x, params) {
  return (void 0)(() => {
    const batchSize = x.shape[0];
    const boxPredictionEncoding = (void 0)(
      convLayer(x, params.box_encoding_predictor),
      [batchSize, -1, 1, 4]
    );
    const classPrediction = (void 0)(
      convLayer(x, params.class_predictor),
      [batchSize, -1, 3]
    );
    return { boxPredictionEncoding, classPrediction };
  });
}

// src/ssdMobilenetv1/predictionLayer.ts
function predictionLayer(x, conv11, params) {
  return (void 0)(() => {
    const conv0 = pointwiseConvLayer(x, params.conv_0, [1, 1]);
    const conv1 = pointwiseConvLayer(conv0, params.conv_1, [2, 2]);
    const conv22 = pointwiseConvLayer(conv1, params.conv_2, [1, 1]);
    const conv3 = pointwiseConvLayer(conv22, params.conv_3, [2, 2]);
    const conv4 = pointwiseConvLayer(conv3, params.conv_4, [1, 1]);
    const conv5 = pointwiseConvLayer(conv4, params.conv_5, [2, 2]);
    const conv6 = pointwiseConvLayer(conv5, params.conv_6, [1, 1]);
    const conv7 = pointwiseConvLayer(conv6, params.conv_7, [2, 2]);
    const boxPrediction0 = boxPredictionLayer(conv11, params.box_predictor_0);
    const boxPrediction1 = boxPredictionLayer(x, params.box_predictor_1);
    const boxPrediction2 = boxPredictionLayer(conv1, params.box_predictor_2);
    const boxPrediction3 = boxPredictionLayer(conv3, params.box_predictor_3);
    const boxPrediction4 = boxPredictionLayer(conv5, params.box_predictor_4);
    const boxPrediction5 = boxPredictionLayer(conv7, params.box_predictor_5);
    const boxPredictions = (void 0)([
      boxPrediction0.boxPredictionEncoding,
      boxPrediction1.boxPredictionEncoding,
      boxPrediction2.boxPredictionEncoding,
      boxPrediction3.boxPredictionEncoding,
      boxPrediction4.boxPredictionEncoding,
      boxPrediction5.boxPredictionEncoding
    ], 1);
    const classPredictions = (void 0)([
      boxPrediction0.classPrediction,
      boxPrediction1.classPrediction,
      boxPrediction2.classPrediction,
      boxPrediction3.classPrediction,
      boxPrediction4.classPrediction,
      boxPrediction5.classPrediction
    ], 1);
    return {
      boxPredictions,
      classPredictions
    };
  });
}

// src/ssdMobilenetv1/SsdMobilenetv1Options.ts
var SsdMobilenetv1Options = class {
  _name = "SsdMobilenetv1Options";
  _minConfidence;
  _maxResults;
  constructor({ minConfidence, maxResults } = {}) {
    this._minConfidence = minConfidence || 0.5;
    this._maxResults = maxResults || 100;
    if (typeof this._minConfidence !== "number" || this._minConfidence <= 0 || this._minConfidence >= 1) {
      throw new Error(`${this._name} - expected minConfidence to be a number between 0 and 1`);
    }
    if (typeof this._maxResults !== "number") {
      throw new Error(`${this._name} - expected maxResults to be a number`);
    }
  }
  get minConfidence() {
    return this._minConfidence;
  }
  get maxResults() {
    return this._maxResults;
  }
};

// src/ssdMobilenetv1/SsdMobilenetv1.ts
var SsdMobilenetv1 = class extends NeuralNetwork {
  constructor() {
    super("SsdMobilenetv1");
  }
  forwardInput(input) {
    const { params } = this;
    if (!params)
      throw new Error("SsdMobilenetv1 - load model before inference");
    return (void 0)(() => {
      const batchTensor = (void 0)(input.toBatchTensor(512, false), "float32");
      const x = (void 0)((void 0)(batchTensor, 127.5), 1);
      const features = mobileNetV1(x, params.mobilenetv1);
      const { boxPredictions, classPredictions } = predictionLayer(features.out, features.conv11, params.prediction_layer);
      return outputLayer(boxPredictions, classPredictions, params.output_layer);
    });
  }
  async forward(input) {
    return this.forwardInput(await toNetInput(input));
  }
  async locateFaces(input, options = {}) {
    const { maxResults, minConfidence } = new SsdMobilenetv1Options(options);
    const netInput = await toNetInput(input);
    const { boxes: _boxes, scores: _scores } = this.forwardInput(netInput);
    const boxes = _boxes[0];
    const scores = _scores[0];
    for (let i = 1; i < _boxes.length; i++) {
      _boxes[i].dispose();
      _scores[i].dispose();
    }
    const scoresData = Array.from(scores.dataSync());
    const iouThreshold = 0.5;
    const indices = nonMaxSuppression2(boxes, scoresData, maxResults, iouThreshold, minConfidence);
    const reshapedDims = netInput.getReshapedInputDimensions(0);
    const inputSize = netInput.inputSize;
    const padX = inputSize / reshapedDims.width;
    const padY = inputSize / reshapedDims.height;
    const boxesData = boxes.arraySync();
    const results = indices.map((idx) => {
      const [top, bottom] = [
        Math.max(0, boxesData[idx][0]),
        Math.min(1, boxesData[idx][2])
      ].map((val) => val * padY);
      const [left, right] = [
        Math.max(0, boxesData[idx][1]),
        Math.min(1, boxesData[idx][3])
      ].map((val) => val * padX);
      return new FaceDetection(
        scoresData[idx],
        new Rect(left, top, right - left, bottom - top),
        { height: netInput.getInputHeight(0), width: netInput.getInputWidth(0) }
      );
    });
    boxes.dispose();
    scores.dispose();
    return results;
  }
  getDefaultModelName() {
    return "ssd_mobilenetv1_model";
  }
  extractParamsFromWeightMap(weightMap) {
    return extractParamsFromWeightMap6(weightMap);
  }
  extractParams(weights) {
    return extractParams6(weights);
  }
};

// src/ssdMobilenetv1/index.ts
function createSsdMobilenetv1(weights) {
  const net = new SsdMobilenetv1();
  net.extractWeights(weights);
  return net;
}
function createFaceDetectionNet(weights) {
  return createSsdMobilenetv1(weights);
}
var FaceDetectionNet = class extends SsdMobilenetv1 {
};

// src/tinyYolov2/const.ts
var IOU_THRESHOLD = 0.4;
var BOX_ANCHORS = [
  new Point(0.738768, 0.874946),
  new Point(2.42204, 2.65704),
  new Point(4.30971, 7.04493),
  new Point(10.246, 4.59428),
  new Point(12.6868, 11.8741)
];
var BOX_ANCHORS_SEPARABLE = [
  new Point(1.603231, 2.094468),
  new Point(6.041143, 7.080126),
  new Point(2.882459, 3.518061),
  new Point(4.266906, 5.178857),
  new Point(9.041765, 10.66308)
];
var MEAN_RGB_SEPARABLE = [117.001, 114.697, 97.404];
var DEFAULT_MODEL_NAME = "tiny_yolov2_model";
var DEFAULT_MODEL_NAME_SEPARABLE_CONV = "tiny_yolov2_separable_conv_model";

// src/tinyYolov2/config.ts
var isNumber2 = (arg) => typeof arg === "number";
function validateConfig(config) {
  if (!config) {
    throw new Error(`invalid config: ${config}`);
  }
  if (typeof config.withSeparableConvs !== "boolean") {
    throw new Error(`config.withSeparableConvs has to be a boolean, have: ${config.withSeparableConvs}`);
  }
  if (!isNumber2(config.iouThreshold) || config.iouThreshold < 0 || config.iouThreshold > 1) {
    throw new Error(`config.iouThreshold has to be a number between [0, 1], have: ${config.iouThreshold}`);
  }
  if (!Array.isArray(config.classes) || !config.classes.length || !config.classes.every((c) => typeof c === "string")) {
    throw new Error(`config.classes has to be an array class names: string[], have: ${JSON.stringify(config.classes)}`);
  }
  if (!Array.isArray(config.anchors) || !config.anchors.length || !config.anchors.map((a) => a || {}).every((a) => isNumber2(a.x) && isNumber2(a.y))) {
    throw new Error(`config.anchors has to be an array of { x: number, y: number }, have: ${JSON.stringify(config.anchors)}`);
  }
  if (config.meanRgb && (!Array.isArray(config.meanRgb) || config.meanRgb.length !== 3 || !config.meanRgb.every(isNumber2))) {
    throw new Error(`config.meanRgb has to be an array of shape [number, number, number], have: ${JSON.stringify(config.meanRgb)}`);
  }
}

// src/tinyYolov2/leaky.ts
function leaky(x) {
  return (void 0)(() => {
    const min = (void 0)(x, (void 0)(0.10000000149011612));
    return (void 0)((void 0)((void 0)(x, min)), min);
  });
}

// src/tinyYolov2/convWithBatchNorm.ts
function convWithBatchNorm(x, params) {
  return (void 0)(() => {
    let out = (void 0)(x, [[0, 0], [1, 1], [1, 1], [0, 0]]);
    out = (void 0)(out, params.conv.filters, [1, 1], "valid");
    out = (void 0)(out, params.bn.sub);
    out = (void 0)(out, params.bn.truediv);
    out = (void 0)(out, params.conv.bias);
    return leaky(out);
  });
}

// src/tinyYolov2/depthwiseSeparableConv.ts
function depthwiseSeparableConv2(x, params) {
  return (void 0)(() => {
    let out = (void 0)(x, [[0, 0], [1, 1], [1, 1], [0, 0]]);
    out = (void 0)(out, params.depthwise_filter, params.pointwise_filter, [1, 1], "valid");
    out = (void 0)(out, params.bias);
    return leaky(out);
  });
}

// src/tinyYolov2/extractParams.ts
function extractorsFactory7(extractWeights, paramMappings) {
  const extractConvParams = extractConvParamsFactory(extractWeights, paramMappings);
  function extractBatchNormParams(size, mappedPrefix) {
    const sub6 = (void 0)(extractWeights(size));
    const truediv = (void 0)(extractWeights(size));
    paramMappings.push(
      { paramPath: `${mappedPrefix}/sub` },
      { paramPath: `${mappedPrefix}/truediv` }
    );
    return { sub: sub6, truediv };
  }
  function extractConvWithBatchNormParams(channelsIn, channelsOut, mappedPrefix) {
    const conv3 = extractConvParams(channelsIn, channelsOut, 3, `${mappedPrefix}/conv`);
    const bn = extractBatchNormParams(channelsOut, `${mappedPrefix}/bn`);
    return { conv: conv3, bn };
  }
  const extractSeparableConvParams = extractSeparableConvParamsFactory(extractWeights, paramMappings);
  return {
    extractConvParams,
    extractConvWithBatchNormParams,
    extractSeparableConvParams
  };
}
function extractParams7(weights, config, boxEncodingSize, filterSizes) {
  const {
    extractWeights,
    getRemainingWeights
  } = extractWeightsFactory(weights);
  const paramMappings = [];
  const {
    extractConvParams,
    extractConvWithBatchNormParams,
    extractSeparableConvParams
  } = extractorsFactory7(extractWeights, paramMappings);
  let params;
  if (config.withSeparableConvs) {
    const [s0, s1, s2, s3, s4, s5, s6, s7, s8] = filterSizes;
    const conv0 = config.isFirstLayerConv2d ? extractConvParams(s0, s1, 3, "conv0") : extractSeparableConvParams(s0, s1, "conv0");
    const conv1 = extractSeparableConvParams(s1, s2, "conv1");
    const conv22 = extractSeparableConvParams(s2, s3, "conv2");
    const conv3 = extractSeparableConvParams(s3, s4, "conv3");
    const conv4 = extractSeparableConvParams(s4, s5, "conv4");
    const conv5 = extractSeparableConvParams(s5, s6, "conv5");
    const conv6 = s7 ? extractSeparableConvParams(s6, s7, "conv6") : void 0;
    const conv7 = s8 ? extractSeparableConvParams(s7, s8, "conv7") : void 0;
    const conv8 = extractConvParams(s8 || s7 || s6, 5 * boxEncodingSize, 1, "conv8");
    params = {
      conv0,
      conv1,
      conv2: conv22,
      conv3,
      conv4,
      conv5,
      conv6,
      conv7,
      conv8
    };
  } else {
    const [s0, s1, s2, s3, s4, s5, s6, s7, s8] = filterSizes;
    const conv0 = extractConvWithBatchNormParams(s0, s1, "conv0");
    const conv1 = extractConvWithBatchNormParams(s1, s2, "conv1");
    const conv22 = extractConvWithBatchNormParams(s2, s3, "conv2");
    const conv3 = extractConvWithBatchNormParams(s3, s4, "conv3");
    const conv4 = extractConvWithBatchNormParams(s4, s5, "conv4");
    const conv5 = extractConvWithBatchNormParams(s5, s6, "conv5");
    const conv6 = extractConvWithBatchNormParams(s6, s7, "conv6");
    const conv7 = extractConvWithBatchNormParams(s7, s8, "conv7");
    const conv8 = extractConvParams(s8, 5 * boxEncodingSize, 1, "conv8");
    params = {
      conv0,
      conv1,
      conv2: conv22,
      conv3,
      conv4,
      conv5,
      conv6,
      conv7,
      conv8
    };
  }
  if (getRemainingWeights().length !== 0) {
    throw new Error(`weights remaing after extract: ${getRemainingWeights().length}`);
  }
  return { params, paramMappings };
}

// src/tinyYolov2/extractParamsFromWeightMap.ts
function extractorsFactory8(weightMap, paramMappings) {
  const extractWeightEntry = extractWeightEntryFactory(weightMap, paramMappings);
  function extractBatchNormParams(prefix) {
    const sub6 = extractWeightEntry(`${prefix}/sub`, 1);
    const truediv = extractWeightEntry(`${prefix}/truediv`, 1);
    return { sub: sub6, truediv };
  }
  function extractConvParams(prefix) {
    const filters = extractWeightEntry(`${prefix}/filters`, 4);
    const bias = extractWeightEntry(`${prefix}/bias`, 1);
    return { filters, bias };
  }
  function extractConvWithBatchNormParams(prefix) {
    const conv3 = extractConvParams(`${prefix}/conv`);
    const bn = extractBatchNormParams(`${prefix}/bn`);
    return { conv: conv3, bn };
  }
  const extractSeparableConvParams = loadSeparableConvParamsFactory(extractWeightEntry);
  return {
    extractConvParams,
    extractConvWithBatchNormParams,
    extractSeparableConvParams
  };
}
function extractParamsFromWeightMap7(weightMap, config) {
  const paramMappings = [];
  const {
    extractConvParams,
    extractConvWithBatchNormParams,
    extractSeparableConvParams
  } = extractorsFactory8(weightMap, paramMappings);
  let params;
  if (config.withSeparableConvs) {
    const numFilters = config.filterSizes && config.filterSizes.length || 9;
    params = {
      conv0: config.isFirstLayerConv2d ? extractConvParams("conv0") : extractSeparableConvParams("conv0"),
      conv1: extractSeparableConvParams("conv1"),
      conv2: extractSeparableConvParams("conv2"),
      conv3: extractSeparableConvParams("conv3"),
      conv4: extractSeparableConvParams("conv4"),
      conv5: extractSeparableConvParams("conv5"),
      conv6: numFilters > 7 ? extractSeparableConvParams("conv6") : void 0,
      conv7: numFilters > 8 ? extractSeparableConvParams("conv7") : void 0,
      conv8: extractConvParams("conv8")
    };
  } else {
    params = {
      conv0: extractConvWithBatchNormParams("conv0"),
      conv1: extractConvWithBatchNormParams("conv1"),
      conv2: extractConvWithBatchNormParams("conv2"),
      conv3: extractConvWithBatchNormParams("conv3"),
      conv4: extractConvWithBatchNormParams("conv4"),
      conv5: extractConvWithBatchNormParams("conv5"),
      conv6: extractConvWithBatchNormParams("conv6"),
      conv7: extractConvWithBatchNormParams("conv7"),
      conv8: extractConvParams("conv8")
    };
  }
  disposeUnusedWeightTensors(weightMap, paramMappings);
  return { params, paramMappings };
}

// src/tinyYolov2/TinyYolov2Options.ts
var TinyYolov2Options = class {
  _name = "TinyYolov2Options";
  _inputSize;
  _scoreThreshold;
  constructor({ inputSize, scoreThreshold } = {}) {
    this._inputSize = inputSize || 416;
    this._scoreThreshold = scoreThreshold || 0.5;
    if (typeof this._inputSize !== "number" || this._inputSize % 32 !== 0) {
      throw new Error(`${this._name} - expected inputSize to be a number divisible by 32`);
    }
    if (typeof this._scoreThreshold !== "number" || this._scoreThreshold <= 0 || this._scoreThreshold >= 1) {
      throw new Error(`${this._name} - expected scoreThreshold to be a number between 0 and 1`);
    }
  }
  get inputSize() {
    return this._inputSize;
  }
  get scoreThreshold() {
    return this._scoreThreshold;
  }
};

// src/tinyYolov2/TinyYolov2Base.ts
var _TinyYolov2Base = class extends NeuralNetwork {
  _config;
  constructor(config) {
    super("TinyYolov2");
    validateConfig(config);
    this._config = config;
  }
  get config() {
    return this._config;
  }
  get withClassScores() {
    return this.config.withClassScores || this.config.classes.length > 1;
  }
  get boxEncodingSize() {
    return 5 + (this.withClassScores ? this.config.classes.length : 0);
  }
  runTinyYolov2(x, params) {
    let out = convWithBatchNorm(x, params.conv0);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = convWithBatchNorm(out, params.conv1);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = convWithBatchNorm(out, params.conv2);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = convWithBatchNorm(out, params.conv3);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = convWithBatchNorm(out, params.conv4);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = convWithBatchNorm(out, params.conv5);
    out = (void 0)(out, [2, 2], [1, 1], "same");
    out = convWithBatchNorm(out, params.conv6);
    out = convWithBatchNorm(out, params.conv7);
    return convLayer(out, params.conv8, "valid", false);
  }
  runMobilenet(x, params) {
    let out = this.config.isFirstLayerConv2d ? leaky(convLayer(x, params.conv0, "valid", false)) : depthwiseSeparableConv2(x, params.conv0);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = depthwiseSeparableConv2(out, params.conv1);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = depthwiseSeparableConv2(out, params.conv2);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = depthwiseSeparableConv2(out, params.conv3);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = depthwiseSeparableConv2(out, params.conv4);
    out = (void 0)(out, [2, 2], [2, 2], "same");
    out = depthwiseSeparableConv2(out, params.conv5);
    out = (void 0)(out, [2, 2], [1, 1], "same");
    out = params.conv6 ? depthwiseSeparableConv2(out, params.conv6) : out;
    out = params.conv7 ? depthwiseSeparableConv2(out, params.conv7) : out;
    return convLayer(out, params.conv8, "valid", false);
  }
  forwardInput(input, inputSize) {
    const { params } = this;
    if (!params) {
      throw new Error("TinyYolov2 - load model before inference");
    }
    return (void 0)(() => {
      let batchTensor = (void 0)(input.toBatchTensor(inputSize, false), "float32");
      batchTensor = this.config.meanRgb ? normalize(batchTensor, this.config.meanRgb) : batchTensor;
      batchTensor = batchTensor.div(255);
      return this.config.withSeparableConvs ? this.runMobilenet(batchTensor, params) : this.runTinyYolov2(batchTensor, params);
    });
  }
  async forward(input, inputSize) {
    return this.forwardInput(await toNetInput(input), inputSize);
  }
  async detect(input, forwardParams = {}) {
    const { inputSize, scoreThreshold } = new TinyYolov2Options(forwardParams);
    const netInput = await toNetInput(input);
    const out = await this.forwardInput(netInput, inputSize);
    const out0 = (void 0)(() => (void 0)(out)[0].expandDims());
    const inputDimensions = {
      width: netInput.getInputWidth(0),
      height: netInput.getInputHeight(0)
    };
    const results = await this.extractBoxes(out0, netInput.getReshapedInputDimensions(0), scoreThreshold);
    out.dispose();
    out0.dispose();
    const boxes = results.map((res) => res.box);
    const scores = results.map((res) => res.score);
    const classScores = results.map((res) => res.classScore);
    const classNames = results.map((res) => this.config.classes[res.label]);
    const indices = nonMaxSuppression(
      boxes.map((box) => box.rescale(inputSize)),
      scores,
      this.config.iouThreshold,
      true
    );
    const detections = indices.map((idx) => new ObjectDetection(
      scores[idx],
      classScores[idx],
      classNames[idx],
      boxes[idx],
      inputDimensions
    ));
    return detections;
  }
  getDefaultModelName() {
    return "";
  }
  extractParamsFromWeightMap(weightMap) {
    return extractParamsFromWeightMap7(weightMap, this.config);
  }
  extractParams(weights) {
    const filterSizes = this.config.filterSizes || _TinyYolov2Base.DEFAULT_FILTER_SIZES;
    const numFilters = filterSizes ? filterSizes.length : void 0;
    if (numFilters !== 7 && numFilters !== 8 && numFilters !== 9) {
      throw new Error(`TinyYolov2 - expected 7 | 8 | 9 convolutional filters, but found ${numFilters} filterSizes in config`);
    }
    return extractParams7(weights, this.config, this.boxEncodingSize, filterSizes);
  }
  async extractBoxes(outputTensor, inputBlobDimensions, scoreThreshold) {
    const { width, height } = inputBlobDimensions;
    const inputSize = Math.max(width, height);
    const correctionFactorX = inputSize / width;
    const correctionFactorY = inputSize / height;
    const numCells = outputTensor.shape[1];
    const numBoxes = this.config.anchors.length;
    const [boxesTensor, scoresTensor, classScoresTensor] = (void 0)(() => {
      const reshaped = outputTensor.reshape([numCells, numCells, numBoxes, this.boxEncodingSize]);
      const boxes = reshaped.slice([0, 0, 0, 0], [numCells, numCells, numBoxes, 4]);
      const scores = reshaped.slice([0, 0, 0, 4], [numCells, numCells, numBoxes, 1]);
      const classScores = this.withClassScores ? (void 0)(reshaped.slice([0, 0, 0, 5], [numCells, numCells, numBoxes, this.config.classes.length]), 3) : (void 0)(0);
      return [boxes, scores, classScores];
    });
    const results = [];
    const scoresData = await scoresTensor.array();
    const boxesData = await boxesTensor.array();
    for (let row = 0; row < numCells; row++) {
      for (let col = 0; col < numCells; col++) {
        for (let anchor = 0; anchor < numBoxes; anchor++) {
          const score = sigmoid(scoresData[row][col][anchor][0]);
          if (!scoreThreshold || score > scoreThreshold) {
            const ctX = (col + sigmoid(boxesData[row][col][anchor][0])) / numCells * correctionFactorX;
            const ctY = (row + sigmoid(boxesData[row][col][anchor][1])) / numCells * correctionFactorY;
            const widthLocal = Math.exp(boxesData[row][col][anchor][2]) * this.config.anchors[anchor].x / numCells * correctionFactorX;
            const heightLocal = Math.exp(boxesData[row][col][anchor][3]) * this.config.anchors[anchor].y / numCells * correctionFactorY;
            const x = ctX - widthLocal / 2;
            const y = ctY - heightLocal / 2;
            const pos = { row, col, anchor };
            const { classScore, label } = this.withClassScores ? await this.extractPredictedClass(classScoresTensor, pos) : { classScore: 1, label: 0 };
            results.push({
              box: new BoundingBox(x, y, x + widthLocal, y + heightLocal),
              score,
              classScore: score * classScore,
              label,
              ...pos
            });
          }
        }
      }
    }
    boxesTensor.dispose();
    scoresTensor.dispose();
    classScoresTensor.dispose();
    return results;
  }
  async extractPredictedClass(classesTensor, pos) {
    const { row, col, anchor } = pos;
    const classesData = await classesTensor.array();
    return Array(this.config.classes.length).fill(0).map((_, i) => classesData[row][col][anchor][i]).map((classScore, label) => ({
      classScore,
      label
    })).reduce((max, curr) => max.classScore > curr.classScore ? max : curr);
  }
};
var TinyYolov2Base = _TinyYolov2Base;
__publicField(TinyYolov2Base, "DEFAULT_FILTER_SIZES", [3, 16, 32, 64, 128, 256, 512, 1024, 1024]);

// src/tinyYolov2/TinyYolov2.ts
var TinyYolov2 = class extends TinyYolov2Base {
  constructor(withSeparableConvs = true) {
    const config = {
      withSeparableConvs,
      iouThreshold: IOU_THRESHOLD,
      classes: ["face"],
      ...withSeparableConvs ? {
        anchors: BOX_ANCHORS_SEPARABLE,
        meanRgb: MEAN_RGB_SEPARABLE
      } : {
        anchors: BOX_ANCHORS,
        withClassScores: true
      }
    };
    super(config);
  }
  get withSeparableConvs() {
    return this.config.withSeparableConvs;
  }
  get anchors() {
    return this.config.anchors;
  }
  async locateFaces(input, forwardParams) {
    const objectDetections = await this.detect(input, forwardParams);
    return objectDetections.map((det) => new FaceDetection(det.score, det.relativeBox, { width: det.imageWidth, height: det.imageHeight }));
  }
  getDefaultModelName() {
    return this.withSeparableConvs ? DEFAULT_MODEL_NAME_SEPARABLE_CONV : DEFAULT_MODEL_NAME;
  }
  extractParamsFromWeightMap(weightMap) {
    return super.extractParamsFromWeightMap(weightMap);
  }
};

// src/tinyYolov2/index.ts
function createTinyYolov2(weights, withSeparableConvs = true) {
  const net = new TinyYolov2(withSeparableConvs);
  net.extractWeights(weights);
  return net;
}

// src/tinyFaceDetector/TinyFaceDetectorOptions.ts
var TinyFaceDetectorOptions = class extends TinyYolov2Options {
  _name = "TinyFaceDetectorOptions";
};

// src/globalApi/ComposableTask.ts
var ComposableTask = class {
  // eslint-disable-next-line no-unused-vars
  async then(onfulfilled) {
    return onfulfilled(await this.run());
  }
  async run() {
    throw new Error("ComposableTask - run is not implemented");
  }
};

// src/globalApi/extractFacesAndComputeResults.ts
async function extractAllFacesAndComputeResults(parentResults, input, computeResults, extractedFaces, getRectForAlignment = ({ alignedRect }) => alignedRect) {
  const faceBoxes = parentResults.map((parentResult) => isWithFaceLandmarks(parentResult) ? getRectForAlignment(parentResult) : parentResult.detection);
  const faces = extractedFaces || (input instanceof void 0 ? await extractFaceTensors(input, faceBoxes) : await extractFaces(input, faceBoxes));
  const results = await computeResults(faces);
  faces.forEach((f) => f instanceof void 0 && f.dispose());
  return results;
}
async function extractSingleFaceAndComputeResult(parentResult, input, computeResult, extractedFaces, getRectForAlignment) {
  return extractAllFacesAndComputeResults(
    [parentResult],
    input,
    async (faces) => computeResult(faces[0]),
    extractedFaces,
    getRectForAlignment
  );
}

// src/tinyFaceDetector/const.ts
var IOU_THRESHOLD2 = 0.4;
var BOX_ANCHORS2 = [
  new Point(1.603231, 2.094468),
  new Point(6.041143, 7.080126),
  new Point(2.882459, 3.518061),
  new Point(4.266906, 5.178857),
  new Point(9.041765, 10.66308)
];
var MEAN_RGB = [117.001, 114.697, 97.404];

// src/tinyFaceDetector/TinyFaceDetector.ts
var TinyFaceDetector = class extends TinyYolov2Base {
  constructor() {
    const config = {
      withSeparableConvs: true,
      iouThreshold: IOU_THRESHOLD2,
      classes: ["face"],
      anchors: BOX_ANCHORS2,
      meanRgb: MEAN_RGB,
      isFirstLayerConv2d: true,
      filterSizes: [3, 16, 32, 64, 128, 256, 512]
    };
    super(config);
  }
  get anchors() {
    return this.config.anchors;
  }
  async locateFaces(input, forwardParams) {
    const objectDetections = await this.detect(input, forwardParams);
    return objectDetections.map((det) => new FaceDetection(det.score, det.relativeBox, { width: det.imageWidth, height: det.imageHeight }));
  }
  getDefaultModelName() {
    return "tiny_face_detector_model";
  }
  extractParamsFromWeightMap(weightMap) {
    return super.extractParamsFromWeightMap(weightMap);
  }
};

// src/globalApi/nets.ts
var nets = {
  ssdMobilenetv1: new SsdMobilenetv1(),
  tinyFaceDetector: new TinyFaceDetector(),
  tinyYolov2: new TinyYolov2(),
  faceLandmark68Net: new FaceLandmark68Net(),
  faceLandmark68TinyNet: new FaceLandmark68TinyNet(),
  faceRecognitionNet: new FaceRecognitionNet(),
  faceExpressionNet: new FaceExpressionNet(),
  ageGenderNet: new AgeGenderNet()
};
var ssdMobilenetv1 = (input, options) => nets.ssdMobilenetv1.locateFaces(input, options);
var tinyFaceDetector = (input, options) => nets.tinyFaceDetector.locateFaces(input, options);
var tinyYolov2 = (input, options) => nets.tinyYolov2.locateFaces(input, options);
var detectFaceLandmarks = (input) => nets.faceLandmark68Net.detectLandmarks(input);
var detectFaceLandmarksTiny = (input) => nets.faceLandmark68TinyNet.detectLandmarks(input);
var computeFaceDescriptor = (input) => nets.faceRecognitionNet.computeFaceDescriptor(input);
var recognizeFaceExpressions = (input) => nets.faceExpressionNet.predictExpressions(input);
var predictAgeAndGender = (input) => nets.ageGenderNet.predictAgeAndGender(input);
var loadSsdMobilenetv1Model = (url2) => nets.ssdMobilenetv1.load(url2);
var loadTinyFaceDetectorModel = (url2) => nets.tinyFaceDetector.load(url2);
var loadTinyYolov2Model = (url2) => nets.tinyYolov2.load(url2);
var loadFaceLandmarkModel = (url2) => nets.faceLandmark68Net.load(url2);
var loadFaceLandmarkTinyModel = (url2) => nets.faceLandmark68TinyNet.load(url2);
var loadFaceRecognitionModel = (url2) => nets.faceRecognitionNet.load(url2);
var loadFaceExpressionModel = (url2) => nets.faceExpressionNet.load(url2);
var loadAgeGenderModel = (url2) => nets.ageGenderNet.load(url2);
var loadFaceDetectionModel = loadSsdMobilenetv1Model;
var locateFaces = ssdMobilenetv1;
var detectLandmarks = detectFaceLandmarks;

// src/globalApi/PredictFaceExpressionsTask.ts
var PredictFaceExpressionsTaskBase = class extends ComposableTask {
  constructor(parentTask, input, extractedFaces) {
    super();
    this.parentTask = parentTask;
    this.input = input;
    this.extractedFaces = extractedFaces;
  }
};
var PredictAllFaceExpressionsTask = class extends PredictFaceExpressionsTaskBase {
  async run() {
    const parentResults = await this.parentTask;
    const faceExpressionsByFace = await extractAllFacesAndComputeResults(
      parentResults,
      this.input,
      async (faces) => Promise.all(
        faces.map((face) => nets.faceExpressionNet.predictExpressions(face))
      ),
      this.extractedFaces
    );
    return parentResults.map(
      (parentResult, i) => extendWithFaceExpressions(parentResult, faceExpressionsByFace[i])
    );
  }
  withAgeAndGender() {
    return new PredictAllAgeAndGenderTask(this, this.input);
  }
};
var PredictSingleFaceExpressionsTask = class extends PredictFaceExpressionsTaskBase {
  async run() {
    const parentResult = await this.parentTask;
    if (!parentResult) {
      return void 0;
    }
    const faceExpressions = await extractSingleFaceAndComputeResult(
      parentResult,
      this.input,
      (face) => nets.faceExpressionNet.predictExpressions(face),
      this.extractedFaces
    );
    return extendWithFaceExpressions(parentResult, faceExpressions);
  }
  withAgeAndGender() {
    return new PredictSingleAgeAndGenderTask(this, this.input);
  }
};
var PredictAllFaceExpressionsWithFaceAlignmentTask = class extends PredictAllFaceExpressionsTask {
  withAgeAndGender() {
    return new PredictAllAgeAndGenderWithFaceAlignmentTask(this, this.input);
  }
  withFaceDescriptors() {
    return new ComputeAllFaceDescriptorsTask(this, this.input);
  }
};
var PredictSingleFaceExpressionsWithFaceAlignmentTask = class extends PredictSingleFaceExpressionsTask {
  withAgeAndGender() {
    return new PredictSingleAgeAndGenderWithFaceAlignmentTask(this, this.input);
  }
  withFaceDescriptor() {
    return new ComputeSingleFaceDescriptorTask(this, this.input);
  }
};

// src/globalApi/PredictAgeAndGenderTask.ts
var PredictAgeAndGenderTaskBase = class extends ComposableTask {
  constructor(parentTask, input, extractedFaces) {
    super();
    this.parentTask = parentTask;
    this.input = input;
    this.extractedFaces = extractedFaces;
  }
};
var PredictAllAgeAndGenderTask = class extends PredictAgeAndGenderTaskBase {
  async run() {
    const parentResults = await this.parentTask;
    const ageAndGenderByFace = await extractAllFacesAndComputeResults(
      parentResults,
      this.input,
      async (faces) => Promise.all(faces.map((face) => nets.ageGenderNet.predictAgeAndGender(face))),
      this.extractedFaces
    );
    return parentResults.map((parentResult, i) => {
      const { age, gender, genderProbability } = ageAndGenderByFace[i];
      return extendWithAge(extendWithGender(parentResult, gender, genderProbability), age);
    });
  }
  withFaceExpressions() {
    return new PredictAllFaceExpressionsTask(this, this.input);
  }
};
var PredictSingleAgeAndGenderTask = class extends PredictAgeAndGenderTaskBase {
  async run() {
    const parentResult = await this.parentTask;
    if (!parentResult)
      return void 0;
    const { age, gender, genderProbability } = await extractSingleFaceAndComputeResult(
      parentResult,
      this.input,
      (face) => nets.ageGenderNet.predictAgeAndGender(face),
      this.extractedFaces
    );
    return extendWithAge(extendWithGender(parentResult, gender, genderProbability), age);
  }
  withFaceExpressions() {
    return new PredictSingleFaceExpressionsTask(this, this.input);
  }
};
var PredictAllAgeAndGenderWithFaceAlignmentTask = class extends PredictAllAgeAndGenderTask {
  withFaceExpressions() {
    return new PredictAllFaceExpressionsWithFaceAlignmentTask(this, this.input);
  }
  withFaceDescriptors() {
    return new ComputeAllFaceDescriptorsTask(this, this.input);
  }
};
var PredictSingleAgeAndGenderWithFaceAlignmentTask = class extends PredictSingleAgeAndGenderTask {
  withFaceExpressions() {
    return new PredictSingleFaceExpressionsWithFaceAlignmentTask(this, this.input);
  }
  withFaceDescriptor() {
    return new ComputeSingleFaceDescriptorTask(this, this.input);
  }
};

// src/globalApi/ComputeFaceDescriptorsTasks.ts
var ComputeFaceDescriptorsTaskBase = class extends ComposableTask {
  constructor(parentTask, input) {
    super();
    this.parentTask = parentTask;
    this.input = input;
  }
};
var ComputeAllFaceDescriptorsTask = class extends ComputeFaceDescriptorsTaskBase {
  async run() {
    const parentResults = await this.parentTask;
    const descriptors2 = await extractAllFacesAndComputeResults(
      parentResults,
      this.input,
      (faces) => Promise.all(faces.map((face) => nets.faceRecognitionNet.computeFaceDescriptor(face))),
      null,
      (parentResult) => parentResult.landmarks.align(null, { useDlibAlignment: true })
    );
    return descriptors2.map((descriptor, i) => extendWithFaceDescriptor(parentResults[i], descriptor));
  }
  withFaceExpressions() {
    return new PredictAllFaceExpressionsWithFaceAlignmentTask(this, this.input);
  }
  withAgeAndGender() {
    return new PredictAllAgeAndGenderWithFaceAlignmentTask(this, this.input);
  }
};
var ComputeSingleFaceDescriptorTask = class extends ComputeFaceDescriptorsTaskBase {
  async run() {
    const parentResult = await this.parentTask;
    if (!parentResult)
      return void 0;
    const descriptor = await extractSingleFaceAndComputeResult(
      parentResult,
      this.input,
      (face) => nets.faceRecognitionNet.computeFaceDescriptor(face),
      null,
      // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
      (parentResult2) => parentResult2.landmarks.align(null, { useDlibAlignment: true })
    );
    return extendWithFaceDescriptor(parentResult, descriptor);
  }
  withFaceExpressions() {
    return new PredictSingleFaceExpressionsWithFaceAlignmentTask(this, this.input);
  }
  withAgeAndGender() {
    return new PredictSingleAgeAndGenderWithFaceAlignmentTask(this, this.input);
  }
};

// src/globalApi/DetectFaceLandmarksTasks.ts
var DetectFaceLandmarksTaskBase = class extends ComposableTask {
  constructor(parentTask, input, useTinyLandmarkNet) {
    super();
    this.parentTask = parentTask;
    this.input = input;
    this.useTinyLandmarkNet = useTinyLandmarkNet;
  }
  get landmarkNet() {
    return this.useTinyLandmarkNet ? nets.faceLandmark68TinyNet : nets.faceLandmark68Net;
  }
};
var DetectAllFaceLandmarksTask = class extends DetectFaceLandmarksTaskBase {
  async run() {
    const parentResults = await this.parentTask;
    const detections = parentResults.map((res) => res.detection);
    const faces = this.input instanceof void 0 ? await extractFaceTensors(this.input, detections) : await extractFaces(this.input, detections);
    const faceLandmarksByFace = await Promise.all(faces.map((face) => this.landmarkNet.detectLandmarks(face)));
    faces.forEach((f) => f instanceof void 0 && f.dispose());
    const result = parentResults.filter((_parentResult, i) => faceLandmarksByFace[i]).map((parentResult, i) => extendWithFaceLandmarks(parentResult, faceLandmarksByFace[i]));
    return result;
  }
  withFaceExpressions() {
    return new PredictAllFaceExpressionsWithFaceAlignmentTask(this, this.input);
  }
  withAgeAndGender() {
    return new PredictAllAgeAndGenderWithFaceAlignmentTask(this, this.input);
  }
  withFaceDescriptors() {
    return new ComputeAllFaceDescriptorsTask(this, this.input);
  }
};
var DetectSingleFaceLandmarksTask = class extends DetectFaceLandmarksTaskBase {
  async run() {
    const parentResult = await this.parentTask;
    if (!parentResult) {
      return void 0;
    }
    const { detection } = parentResult;
    const faces = this.input instanceof void 0 ? await extractFaceTensors(this.input, [detection]) : await extractFaces(this.input, [detection]);
    const landmarks = await this.landmarkNet.detectLandmarks(faces[0]);
    faces.forEach((f) => f instanceof void 0 && f.dispose());
    return extendWithFaceLandmarks(parentResult, landmarks);
  }
  withFaceExpressions() {
    return new PredictSingleFaceExpressionsWithFaceAlignmentTask(this, this.input);
  }
  withAgeAndGender() {
    return new PredictSingleAgeAndGenderWithFaceAlignmentTask(this, this.input);
  }
  withFaceDescriptor() {
    return new ComputeSingleFaceDescriptorTask(this, this.input);
  }
};

// src/globalApi/DetectFacesTasks.ts
var DetectFacesTaskBase = class extends ComposableTask {
  // eslint-disable-next-line no-unused-vars
  constructor(input, options = new SsdMobilenetv1Options()) {
    super();
    this.input = input;
    this.options = options;
  }
};
var DetectAllFacesTask = class extends DetectFacesTaskBase {
  async run() {
    const { input, options } = this;
    let result;
    if (options instanceof TinyFaceDetectorOptions)
      result = nets.tinyFaceDetector.locateFaces(input, options);
    else if (options instanceof SsdMobilenetv1Options)
      result = nets.ssdMobilenetv1.locateFaces(input, options);
    else if (options instanceof TinyYolov2Options)
      result = nets.tinyYolov2.locateFaces(input, options);
    else
      throw new Error("detectFaces - expected options to be instance of TinyFaceDetectorOptions | SsdMobilenetv1Options | TinyYolov2Options");
    return result;
  }
  runAndExtendWithFaceDetections() {
    return new Promise((resolve, reject) => {
      this.run().then((detections) => resolve(detections.map((detection) => extendWithFaceDetection({}, detection)))).catch((err) => reject(err));
    });
  }
  withFaceLandmarks(useTinyLandmarkNet = false) {
    return new DetectAllFaceLandmarksTask(
      this.runAndExtendWithFaceDetections(),
      this.input,
      useTinyLandmarkNet
    );
  }
  withFaceExpressions() {
    return new PredictAllFaceExpressionsTask(
      this.runAndExtendWithFaceDetections(),
      this.input
    );
  }
  withAgeAndGender() {
    return new PredictAllAgeAndGenderTask(
      this.runAndExtendWithFaceDetections(),
      this.input
    );
  }
};
var DetectSingleFaceTask = class extends DetectFacesTaskBase {
  async run() {
    const faceDetections = await new DetectAllFacesTask(this.input, this.options);
    let faceDetectionWithHighestScore = faceDetections[0];
    faceDetections.forEach((faceDetection) => {
      if (faceDetection.score > faceDetectionWithHighestScore.score)
        faceDetectionWithHighestScore = faceDetection;
    });
    return faceDetectionWithHighestScore;
  }
  runAndExtendWithFaceDetection() {
    return new Promise(async (resolve) => {
      const detection = await this.run();
      resolve(detection ? extendWithFaceDetection({}, detection) : void 0);
    });
  }
  withFaceLandmarks(useTinyLandmarkNet = false) {
    return new DetectSingleFaceLandmarksTask(
      this.runAndExtendWithFaceDetection(),
      this.input,
      useTinyLandmarkNet
    );
  }
  withFaceExpressions() {
    return new PredictSingleFaceExpressionsTask(
      this.runAndExtendWithFaceDetection(),
      this.input
    );
  }
  withAgeAndGender() {
    return new PredictSingleAgeAndGenderTask(
      this.runAndExtendWithFaceDetection(),
      this.input
    );
  }
};

// src/globalApi/detectFaces.ts
function detectSingleFace(input, options = new SsdMobilenetv1Options()) {
  return new DetectSingleFaceTask(input, options);
}
function detectAllFaces(input, options = new SsdMobilenetv1Options()) {
  return new DetectAllFacesTask(input, options);
}

// src/globalApi/allFaces.ts
async function allFacesSsdMobilenetv1(input, minConfidence) {
  return detectAllFaces(input, new SsdMobilenetv1Options(minConfidence ? { minConfidence } : {})).withFaceLandmarks().withFaceDescriptors();
}
async function allFacesTinyYolov2(input, forwardParams = {}) {
  return detectAllFaces(input, new TinyYolov2Options(forwardParams)).withFaceLandmarks().withFaceDescriptors();
}
var allFaces = allFacesSsdMobilenetv1;

// src/euclideanDistance.ts
function euclideanDistance(arr1, arr2) {
  if (arr1.length !== arr2.length)
    throw new Error("euclideanDistance: arr1.length !== arr2.length");
  const desc1 = Array.from(arr1);
  const desc2 = Array.from(arr2);
  return Math.sqrt(
    desc1.map((val, i) => val - desc2[i]).reduce((res, diff) => res + diff * diff, 0)
  );
}

// src/globalApi/FaceMatcher.ts
var FaceMatcher = class {
  _labeledDescriptors;
  _distanceThreshold;
  constructor(inputs, distanceThreshold = 0.6) {
    this._distanceThreshold = distanceThreshold;
    const inputArray = Array.isArray(inputs) ? inputs : [inputs];
    if (!inputArray.length)
      throw new Error("FaceRecognizer.constructor - expected atleast one input");
    let count = 1;
    const createUniqueLabel = () => `person ${count++}`;
    this._labeledDescriptors = inputArray.map((desc) => {
      if (desc instanceof LabeledFaceDescriptors)
        return desc;
      if (desc instanceof Float32Array)
        return new LabeledFaceDescriptors(createUniqueLabel(), [desc]);
      if (desc.descriptor && desc.descriptor instanceof Float32Array)
        return new LabeledFaceDescriptors(createUniqueLabel(), [desc.descriptor]);
      throw new Error("FaceRecognizer.constructor - expected inputs to be of type LabeledFaceDescriptors | WithFaceDescriptor<any> | Float32Array | Array<LabeledFaceDescriptors | WithFaceDescriptor<any> | Float32Array>");
    });
  }
  get labeledDescriptors() {
    return this._labeledDescriptors;
  }
  get distanceThreshold() {
    return this._distanceThreshold;
  }
  computeMeanDistance(queryDescriptor, descriptors2) {
    return descriptors2.map((d) => euclideanDistance(d, queryDescriptor)).reduce((d1, d2) => d1 + d2, 0) / (descriptors2.length || 1);
  }
  matchDescriptor(queryDescriptor) {
    return this.labeledDescriptors.map(({ descriptors: descriptors2, label }) => new FaceMatch(label, this.computeMeanDistance(queryDescriptor, descriptors2))).reduce((best, curr) => best.distance < curr.distance ? best : curr);
  }
  findBestMatch(queryDescriptor) {
    const bestMatch = this.matchDescriptor(queryDescriptor);
    return bestMatch.distance < this._distanceThreshold ? bestMatch : new FaceMatch("unknown", bestMatch.distance);
  }
  toJSON() {
    return {
      distanceThreshold: this._distanceThreshold,
      labeledDescriptors: this._labeledDescriptors.map((ld) => ld.toJSON())
    };
  }
  static fromJSON(json) {
    const labeledDescriptors = json.labeledDescriptors.map((ld) => LabeledFaceDescriptors.fromJSON(ld));
    return new FaceMatcher(labeledDescriptors, json.distanceThreshold);
  }
};

// src/tinyFaceDetector/index.ts
function createTinyFaceDetector(weights) {
  const net = new TinyFaceDetector();
  net.extractWeights(weights);
  return net;
}

// src/resizeResults.ts
function resizeResults(results, dimensions) {
  const { width, height } = new Dimensions(dimensions.width, dimensions.height);
  if (width <= 0 || height <= 0) {
    throw new Error(`resizeResults - invalid dimensions: ${JSON.stringify({ width, height })}`);
  }
  if (Array.isArray(results)) {
    return results.map((obj) => resizeResults(obj, { width, height }));
  }
  if (isWithFaceLandmarks(results)) {
    const resizedDetection = results.detection.forSize(width, height);
    const resizedLandmarks = results.unshiftedLandmarks.forSize(resizedDetection.box.width, resizedDetection.box.height);
    return extendWithFaceLandmarks(extendWithFaceDetection(results, resizedDetection), resizedLandmarks);
  }
  if (isWithFaceDetection(results)) {
    return extendWithFaceDetection(results, results.detection.forSize(width, height));
  }
  if (results instanceof FaceLandmarks || results instanceof FaceDetection) {
    return results.forSize(width, height);
  }
  return results;
}

// src/index.ts
var version8 = version7;
export {
  AgeGenderNet,
  BoundingBox,
  Box,
  ComposableTask,
  ComputeAllFaceDescriptorsTask,
  ComputeFaceDescriptorsTaskBase,
  ComputeSingleFaceDescriptorTask,
  DetectAllFaceLandmarksTask,
  DetectAllFacesTask,
  DetectFaceLandmarksTaskBase,
  DetectFacesTaskBase,
  DetectSingleFaceLandmarksTask,
  DetectSingleFaceTask,
  Dimensions,
  FACE_EXPRESSION_LABELS,
  FaceDetection,
  FaceDetectionNet,
  FaceExpressionNet,
  FaceExpressions,
  FaceLandmark68Net,
  FaceLandmark68TinyNet,
  FaceLandmarkNet,
  FaceLandmarks,
  FaceLandmarks5,
  FaceLandmarks68,
  FaceMatch,
  FaceMatcher,
  FaceRecognitionNet,
  Gender,
  LabeledBox,
  LabeledFaceDescriptors,
  NetInput,
  NeuralNetwork,
  ObjectDetection,
  Point,
  PredictedBox,
  Rect,
  SsdMobilenetv1,
  SsdMobilenetv1Options,
  TinyFaceDetector,
  TinyFaceDetectorOptions,
  TinyYolov2,
  TinyYolov2Options,
  allFaces,
  allFacesSsdMobilenetv1,
  allFacesTinyYolov2,
  awaitMediaLoaded,
  bufferToImage,
  computeFaceDescriptor,
  createCanvas,
  createCanvasFromMedia,
  createFaceDetectionNet,
  createFaceRecognitionNet,
  createSsdMobilenetv1,
  createTinyFaceDetector,
  createTinyYolov2,
  detectAllFaces,
  detectFaceLandmarks,
  detectFaceLandmarksTiny,
  detectLandmarks,
  detectSingleFace,
  draw_exports as draw,
  env,
  euclideanDistance,
  extendWithAge,
  extendWithFaceDescriptor,
  extendWithFaceDetection,
  extendWithFaceExpressions,
  extendWithFaceLandmarks,
  extendWithGender,
  extractFaceTensors,
  extractFaces,
  fetchImage,
  fetchJson,
  fetchNetWeights,
  fetchOrThrow,
  fetchVideo,
  getContext2dOrThrow,
  getMediaDimensions,
  imageTensorToCanvas,
  imageToSquare,
  inverseSigmoid,
  iou,
  isMediaElement,
  isMediaLoaded,
  isWithAge,
  isWithFaceDetection,
  isWithFaceExpressions,
  isWithFaceLandmarks,
  isWithGender,
  loadAgeGenderModel,
  loadFaceDetectionModel,
  loadFaceExpressionModel,
  loadFaceLandmarkModel,
  loadFaceLandmarkTinyModel,
  loadFaceRecognitionModel,
  loadSsdMobilenetv1Model,
  loadTinyFaceDetectorModel,
  loadTinyYolov2Model,
  loadWeightMap,
  locateFaces,
  matchDimensions,
  minBbox,
  nets,
  nonMaxSuppression,
  normalize,
  padToSquare,
  predictAgeAndGender,
  recognizeFaceExpressions,
  resizeResults,
  resolveInput,
  shuffleArray,
  sigmoid,
  ssdMobilenetv1,
  tfjs_esm_exports as tf,
  tinyFaceDetector,
  tinyYolov2,
  toNetInput,
  utils_exports as utils,
  validateConfig,
  version8 as version
};
