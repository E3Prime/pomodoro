export class Particle {
  canvasState: {width: number; height: number};
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  driftAngle: number;
  driftSpeed: number;
  driftAmplitude: number;
  angle: number;
  angleVelocity: number;

  constructor(canvasState: {width: number; height: number}) {
    this.canvasState = canvasState;
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.speed = 0;
    this.alpha = 1;
    this.driftAngle = 0;
    this.driftSpeed = 0;
    this.driftAmplitude = 0;
    this.angle = 0;
    this.angleVelocity = 0;

    this.reset(true);
  }

  reset(initial = false) {
    const w = this.canvasState.width || window.innerWidth;
    const h = this.canvasState.height || window.innerHeight;

    this.x = Math.random() * w;
    this.y = initial ? Math.random() * h : h + 20;

    this.size = Math.random() * 5 + 2;
    this.speed = Math.random() * 1 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.3;

    // Drift variables
    this.driftAngle = Math.random() * Math.PI * 2;
    this.driftSpeed = Math.random() * 0.03 + 0.02;
    this.driftAmplitude = Math.random() * 0.5;

    // Rotation variables
    this.angle = Math.random() * Math.PI * 2;
    this.angleVelocity = Math.random() * 0.02 - 0.01;
  }

  update() {
    this.y -= this.speed;

    // Handle horizontal sway
    this.driftAngle += this.driftSpeed;
    this.x += Math.cos(this.driftAngle) * this.driftAmplitude;

    this.angle += this.angleVelocity;

    // Object pooling: reset if off-screen
    if (this.y < -50) {
      this.reset();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();

    // Top Tip
    ctx.moveTo(0, -this.size);
    // Curve to Right Tip
    ctx.quadraticCurveTo(0, 0, this.size, 0);
    // Curve to Bottom Tip
    ctx.quadraticCurveTo(0, 0, 0, this.size);
    // Curve to Left Tip
    ctx.quadraticCurveTo(0, 0, -this.size, 0);
    // Curve back to Top Tip
    ctx.quadraticCurveTo(0, 0, 0, -this.size);

    ctx.closePath();
    ctx.shadowBlur = 15;
    ctx.shadowColor = `rgba(255, 255, 255, ${this.alpha})`;

    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
    ctx.restore();
  }
}
