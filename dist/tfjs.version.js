/*
  Face-API
  homepage: <https://github.com/vladmandic/face-api>
  author: <https://github.com/vladmandic>'
*/


// node_modules/@tensorflow/tfjs-core/package.json
var version = "4.9.0";

// node_modules/@tensorflow/tfjs-converter/package.json
var version2 = "4.9.0";

// node_modules/@tensorflow/tfjs-backend-cpu/package.json
var version3 = "4.9.0";

// node_modules/@tensorflow/tfjs-backend-webgl/package.json
var version4 = "4.9.0";

// node_modules/@tensorflow/tfjs-backend-wasm/package.json
var version5 = "4.9.0";

// src/tfjs/tf-version.ts
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
export {
  version6 as version
};
