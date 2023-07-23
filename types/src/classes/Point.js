export class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    get x() { return this._x; }
    get y() { return this._y; }
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
        return Math.sqrt((this.x ** 2) + (this.y ** 2));
    }
    floor() {
        return new Point(Math.floor(this.x), Math.floor(this.y));
    }
}
