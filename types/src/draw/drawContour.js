export function drawContour(ctx, points, isClosed = false) {
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