import axios from 'axios';
import loadTf from 'tfjs-node-lambda';
import { Readable } from 'stream';

const downloadFile = async (url) => {
  const req = await axios.get(
    url,
    { responseType: 'arraybuffer' },
  );
  return req.data;
};

const file = await downloadFile('https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.10/nodejs12.x-tf2.8.6.br');

const readStream = Readable.from(file);

const tf = await loadTf(readStream);
import { getModelUris } from './common/getModelUris';
import { loadWeightMap } from './dom/index';
import { env } from './env/index';
export class NeuralNetwork {
    constructor(name) {
        this._params = undefined;
        this._paramMappings = [];
        this._name = name;
    }
    get params() { return this._params; }
    get paramMappings() { return this._paramMappings; }
    get isLoaded() { return !!this.params; }
    getParamFromPath(paramPath) {
        const { obj, objProp } = this.traversePropertyPath(paramPath);
        return obj[objProp];
    }
    reassignParamFromPath(paramPath, tensor) {
        const { obj, objProp } = this.traversePropertyPath(paramPath);
        obj[objProp].dispose();
        obj[objProp] = tensor;
    }
    getParamList() {
        return this._paramMappings.map(({ paramPath }) => ({
            path: paramPath,
            tensor: this.getParamFromPath(paramPath),
        }));
    }
    getTrainableParams() {
        return this.getParamList().filter((param) => param.tensor instanceof tf.Variable);
    }
    getFrozenParams() {
        return this.getParamList().filter((param) => !(param.tensor instanceof tf.Variable));
    }
    variable() {
        this.getFrozenParams().forEach(({ path, tensor }) => {
            this.reassignParamFromPath(path, tensor.variable());
        });
    }
    freeze() {
        this.getTrainableParams().forEach(({ path, tensor: variable }) => {
            const tensor = tf.tensor(variable.dataSync());
            variable.dispose();
            this.reassignParamFromPath(path, tensor);
        });
    }
    dispose(throwOnRedispose = true) {
        this.getParamList().forEach((param) => {
            if (throwOnRedispose && param.tensor.isDisposed) {
                throw new Error(`param tensor has already been disposed for path ${param.path}`);
            }
            param.tensor.dispose();
        });
        this._params = undefined;
    }
    serializeParams() {
        return new Float32Array(this.getParamList()
            .map(({ tensor }) => Array.from(tensor.dataSync()))
            .reduce((flat, arr) => flat.concat(arr)));
    }
    async load(weightsOrUrl) {
        if (weightsOrUrl instanceof Float32Array) {
            this.extractWeights(weightsOrUrl);
            return;
        }
        await this.loadFromUri(weightsOrUrl);
    }
    async loadFromUri(uri) {
        if (uri && typeof uri !== 'string') {
            throw new Error(`${this._name}.loadFromUri - expected model uri`);
        }
        const weightMap = await loadWeightMap(uri, this.getDefaultModelName());
        this.loadFromWeightMap(weightMap);
    }
    async loadFromDisk(filePath) {
        if (filePath && typeof filePath !== 'string') {
            throw new Error(`${this._name}.loadFromDisk - expected model file path`);
        }
        const { readFile } = env.getEnv();
        const { manifestUri, modelBaseUri } = getModelUris(filePath, this.getDefaultModelName());
        const fetchWeightsFromDisk = (filePaths) => Promise.all(filePaths.map((fp) => readFile(fp).then((buf) => buf.buffer)));
        const loadWeights = tf['io'].weightsLoaderFactory(fetchWeightsFromDisk);
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
            throw new Error('traversePropertyPath - model has no loaded params');
        }
        const result = paramPath.split('/').reduce((res, objProp) => {
            // eslint-disable-next-line no-prototype-builtins
            if (!res.nextObj.hasOwnProperty(objProp)) {
                throw new Error(`traversePropertyPath - object does not have property ${objProp}, for path ${paramPath}`);
            }
            return { obj: res.nextObj, objProp, nextObj: res.nextObj[objProp] };
        }, { nextObj: this.params });
        const { obj, objProp } = result;
        if (!obj || !objProp || !(obj[objProp] instanceof tf.Tensor)) {
            throw new Error(`traversePropertyPath - parameter is not a tensor, for path ${paramPath}`);
        }
        return { obj, objProp };
    }
}
