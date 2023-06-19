export default class MathUtil {
  static getDeltaByAngle(angle: number, speed: number) {
    return {
      dx: Math.sin((Math.PI * angle) / 180) * speed,
      dy: Math.cos((Math.PI * angle) / 180) * speed,
    };
  }
}
