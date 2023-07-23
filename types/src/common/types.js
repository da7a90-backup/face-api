export class SeparableConvParams {
    // eslint-disable-next-line no-useless-constructor
    constructor(
    // eslint-disable-next-line no-unused-vars
    depthwise_filter, 
    // eslint-disable-next-line no-unused-vars
    pointwise_filter, 
    // eslint-disable-next-line no-unused-vars
    bias) {
        this.depthwise_filter = depthwise_filter;
        this.pointwise_filter = pointwise_filter;
        this.bias = bias;
    }
}
