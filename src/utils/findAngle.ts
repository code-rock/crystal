const findAngle = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x1 - x2;
    const deltaY = y1 - y2;
    return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
}
export default findAngle;