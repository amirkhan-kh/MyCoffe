import type { Scene } from "./scene";
import { SOFT_PAD, leafSprites, moteSprite, petalSprites, snowSprites, soften, type Sprite } from "./sprites";

type Kind = "leaf" | "petal" | "snow" | "rain" | "mote";

interface P {
  kind: Kind;
  x: number;
  y: number;
  z: number;
  vy: number;
  size: number;
  rot: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  sway: number;
  swayFreq: number;
  phase: number;
  alpha: number;
  sprite: Sprite | null;
  /** shown while the leaf is flipped over */
  back: Sprite | null;
  front: boolean;
  retire: boolean;
  born: number;
}

interface Bird {
  kind: "swallow" | "gull";
  x: number;
  baseY: number;
  y: number;
  vx: number;
  amp: number;
  freq: number;
  phase: number;
  size: number;
  flapRate: number;
  t: number;
}

const R = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

export class ParticleEngine {
  private back: CanvasRenderingContext2D;
  private front: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private area = 1;
  private quality = 1;
  private particles: P[] = [];
  private birds: Bird[] = [];
  private scene: Scene | null = null;
  private t = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private frameTimes: number[] = [];
  private nextBirdAt = 4;
  private gust = { start: -100, dur: 0, peak: 0, next: 6 };
  private flash = { at: -100, next: 6 };

  private leaves = leafSprites();
  private petals = petalSprites();
  private softPetals = this.petals.map((p) => soften(p, 4));
  private snow = snowSprites();
  private mote = moteSprite();

  constructor(
    private backCanvas: HTMLCanvasElement,
    private frontCanvas: HTMLCanvasElement,
  ) {
    this.back = backCanvas.getContext("2d")!;
    this.front = frontCanvas.getContext("2d")!;
    this.resize();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    for (const c of [this.backCanvas, this.frontCanvas]) {
      c.width = Math.round(this.w * this.dpr);
      c.height = Math.round(this.h * this.dpr);
    }
    this.area = Math.max(0.7, Math.min(2.4, (this.w * this.h) / (390 * 844)));
    if (this.scene) this.rebalance();
  }

  configure(scene: Scene) {
    this.scene = scene;
    this.rebalance();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.trackPerformance(dt);
      this.update(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.particles = [];
    this.birds = [];
  }

  /* --------------------------------- population -------------------------------- */

  private target(kind: Kind) {
    const s = this.scene!;
    const base = { leaf: s.leaves, petal: s.petals, snow: s.snow, rain: s.rain, mote: s.motes }[kind];
    return Math.round(base * this.area * this.quality);
  }

  private rebalance() {
    for (const kind of ["leaf", "petal", "snow", "rain", "mote"] as Kind[]) {
      const live = this.particles.filter((p) => p.kind === kind && !p.retire);
      const want = this.target(kind);
      if (live.length < want) {
        for (let i = live.length; i < want; i++) this.particles.push(this.spawn(kind, true));
      } else {
        for (let i = want; i < live.length; i++) live[i].retire = true;
      }
    }
  }

  private spawn(kind: Kind, scatter: boolean): P {
    const z = Math.random();
    const p: P = {
      kind,
      x: R(-40, this.w + 40),
      y: scatter ? R(-this.h * 0.2, this.h) : R(-80, -20),
      z,
      vy: 0,
      size: 10,
      rot: R(0, Math.PI * 2),
      spin: R(-1.6, 1.6),
      flip: R(0, Math.PI * 2),
      flipSpeed: R(1.2, 3.2),
      sway: R(10, 30),
      swayFreq: R(0.5, 1.4),
      phase: R(0, Math.PI * 2),
      alpha: 1,
      sprite: null,
      back: null,
      front: z > 0.72,
      retire: false,
      born: scatter ? this.t : -100,
    };
    switch (kind) {
      case "leaf": {
        const leaf = pick(this.leaves);
        if (z > 0.95) {
          p.sprite = p.back = leaf.soft;
          p.size = R(34, 56) * SOFT_PAD;
          p.vy = R(80, 115);
          p.sway = R(40, 70);
          p.alpha = R(0.75, 0.92);
          p.flipSpeed = R(0.8, 1.8);
        } else {
          p.sprite = leaf.face;
          p.back = leaf.back;
          p.size = R(13, 21) * (0.55 + 0.8 * z);
          p.vy = R(38, 62) * (0.6 + 0.6 * z);
          p.sway = R(18, 42) * (0.6 + 0.6 * z);
          p.alpha = 0.6 + 0.4 * z;
        }
        break;
      }
      case "petal": {
        const i = (Math.random() * this.petals.length) | 0;
        const hero = z > 0.95;
        p.sprite = p.back = hero ? this.softPetals[i] : this.petals[i];
        p.size = hero ? R(20, 30) * SOFT_PAD : R(8, 13) * (0.55 + 0.8 * z);
        p.vy = (hero ? R(55, 80) : R(20, 38)) * (0.6 + 0.6 * z);
        p.sway = R(20, 46);
        p.flipSpeed = R(2, 4.2);
        p.alpha = hero ? 0.55 : 0.6 + 0.4 * z;
        break;
      }
      case "snow":
        if (z > 0.96) {
          p.sprite = this.snow.bokeh;
          p.size = R(12, 22);
          p.alpha = R(0.22, 0.42);
        } else if (z > 0.78) {
          p.sprite = this.snow.crystal;
          p.size = R(7, 12);
          p.alpha = R(0.65, 0.95);
        } else {
          p.sprite = this.snow.small;
          p.size = R(2.2, 5.5) * (0.6 + 0.6 * z);
          p.alpha = R(0.45, 0.95) * (0.55 + 0.45 * z);
        }
        p.vy = R(26, 58) * (0.55 + 0.9 * z);
        p.sway = R(6, 18);
        p.spin = R(-0.8, 0.8);
        p.front = z > 0.78;
        break;
      case "rain":
        p.vy = R(820, 1250) * (0.55 + 0.45 * z);
        p.size = 0.6 + 0.9 * z;
        p.alpha = 0.1 + 0.28 * z;
        p.front = z > 0.86;
        if (!scatter) p.y = R(-this.h * 0.3, -10);
        break;
      case "mote":
        p.sprite = this.mote;
        p.size = R(2, 5.5) * (0.6 + 0.6 * z);
        p.vy = -R(6, 16) * (0.6 + 0.6 * z);
        p.alpha = R(0.35, 0.8);
        p.y = scatter ? R(0, this.h) : this.h + 10;
        break;
    }
    return p;
  }

  /* ----------------------------------- motion ---------------------------------- */

  private gustValue() {
    const s = this.scene!;
    const g = this.gust;
    if (this.t > g.next) {
      g.start = this.t;
      g.dur = R(2.5, 4.5);
      g.peak = R(0.6, 1) * s.gustiness;
      g.next = this.t + R(9, 18) * (1.4 - s.gustiness * 0.6);
    }
    const k = (this.t - g.start) / g.dur;
    const env = k >= 0 && k <= 1 ? Math.sin(Math.PI * k) ** 2 * g.peak : 0;
    const noise = (Math.sin(this.t * 0.21) * Math.sin(this.t * 0.13 + 2) + 1) * 0.15 * s.gustiness;
    return env + noise;
  }

  private update(dt: number) {
    const s = this.scene;
    if (!s) return;
    this.t += dt;
    const gust = this.gustValue();
    const wind = s.windX * (1 + gust * 1.8);
    const fromLeft = wind > 0;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const sway = Math.sin(this.t * p.swayFreq + p.phase) * p.sway;
      switch (p.kind) {
        case "leaf":
        case "petal": {
          p.flip += p.flipSpeed * dt * (1 + gust * 1.5);
          p.rot += p.spin * dt * (1 + gust * 2.2);
          const edge = Math.abs(Math.cos(p.flip));
          const fall = p.vy * (0.6 + 0.7 * (1 - edge));
          const push = (p.kind === "leaf" ? 70 : 55) * (0.4 + 0.6 * p.z);
          p.x += (wind * push + sway) * dt;
          p.y += (fall - gust * 34 * p.z) * dt;
          break;
        }
        case "snow": {
          const storm = 1 + s.blizzard * 1.6;
          p.x += (wind * 42 * (0.45 + 0.55 * p.z) * storm + sway) * dt;
          p.y += p.vy * (1 + s.blizzard * 0.5) * dt;
          p.rot += p.spin * dt;
          break;
        }
        case "rain":
          p.x += wind * 240 * dt;
          p.y += p.vy * dt;
          break;
        case "mote":
          p.x += (sway * 0.35 + wind * 6) * dt;
          p.y += p.vy * dt;
          break;
      }

      const out =
        p.kind === "mote"
          ? p.y < -20
          : p.y > this.h + 40 || p.x < -90 || p.x > this.w + 90;
      if (out) {
        if (p.retire) {
          this.particles.splice(i, 1);
          continue;
        }
        const n = this.spawn(p.kind, false);
        if (p.kind !== "mote" && Math.abs(wind) > 0.7 && Math.random() < 0.45) {
          n.x = fromLeft ? R(-80, -20) : R(this.w + 20, this.w + 80);
          n.y = R(-40, this.h * 0.6);
        }
        this.particles[i] = n;
      }
    }

    this.updateBirds(dt);
  }

  private updateBirds(dt: number) {
    const s = this.scene!;
    if ((s.swallows || s.gulls) && this.t > this.nextBirdAt) {
      const kind = s.swallows ? "swallow" : "gull";
      const dir = Math.random() < 0.5 ? 1 : -1;
      const flock = kind === "swallow" ? 1 + ((Math.random() * 3) | 0) : 1 + ((Math.random() * 2) | 0);
      const baseY = R(0.06, 0.24) * this.h;
      for (let i = 0; i < flock; i++) {
        const speed = kind === "swallow" ? R(170, 250) : R(60, 95);
        this.birds.push({
          kind,
          x: dir > 0 ? -40 - i * R(30, 70) : this.w + 40 + i * R(30, 70),
          baseY: baseY + R(-26, 26),
          y: baseY,
          vx: speed * dir,
          amp: kind === "swallow" ? R(18, 46) : R(6, 14),
          freq: kind === "swallow" ? R(0.005, 0.01) : R(0.002, 0.004),
          phase: R(0, Math.PI * 2),
          size: kind === "swallow" ? R(0.75, 1.15) : R(0.8, 1.1),
          flapRate: kind === "swallow" ? R(15, 19) : R(5, 7),
          t: R(0, 2),
        });
      }
      this.nextBirdAt = this.t + (kind === "swallow" ? R(9, 20) : R(14, 26));
    }
    for (let i = this.birds.length - 1; i >= 0; i--) {
      const b = this.birds[i];
      b.t += dt;
      b.x += b.vx * dt;
      b.y = b.baseY + Math.sin(b.x * b.freq + b.phase) * b.amp;
      if (b.x < -160 || b.x > this.w + 160) this.birds.splice(i, 1);
    }
  }

  /* ----------------------------------- render ---------------------------------- */

  private draw() {
    const { back, front, dpr } = this;
    back.setTransform(1, 0, 0, 1, 0, 0);
    front.setTransform(1, 0, 0, 1, 0, 0);
    back.clearRect(0, 0, this.backCanvas.width, this.backCanvas.height);
    front.clearRect(0, 0, this.frontCanvas.width, this.frontCanvas.height);

    this.drawRain(back, false);
    this.drawRain(front, true);

    for (const p of this.particles) {
      if (p.kind === "rain") continue;
      const g = p.front ? front : back;
      const fadeIn = Math.min(1, (this.t - p.born) / 1.4);
      if (p.kind === "mote") {
        const tw = 0.55 + 0.45 * Math.sin(this.t * p.swayFreq * 3 + p.phase);
        g.globalCompositeOperation = "lighter";
        g.globalAlpha = p.alpha * tw * fadeIn;
        g.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
        g.drawImage(p.sprite!, -p.size, -p.size, p.size * 2, p.size * 2);
        g.globalCompositeOperation = "source-over";
        continue;
      }
      const cos = Math.cos(p.rot);
      const sin = Math.sin(p.rot);
      let sx = 1;
      let img = p.sprite!;
      if (p.kind === "leaf" || p.kind === "petal") {
        const f = Math.cos(p.flip);
        sx = Math.sign(f || 1) * Math.max(0.14, Math.abs(f));
        if (f < 0 && p.back) img = p.back;
        g.globalAlpha = p.alpha * (0.72 + 0.28 * Math.abs(f)) * fadeIn;
      } else {
        g.globalAlpha = p.alpha * fadeIn;
      }
      g.setTransform(cos * sx * dpr, sin * sx * dpr, -sin * dpr, cos * dpr, p.x * dpr, p.y * dpr);
      g.drawImage(img, -p.size, -p.size, p.size * 2, p.size * 2);
    }

    resetComposite(back);
    resetComposite(front);
    this.drawBirds(back);
    this.drawFlash();
  }

  private drawRain(g: CanvasRenderingContext2D, frontLayer: boolean) {
    const s = this.scene;
    if (!s || s.rain === 0) return;
    const wind = s.windX * 240;
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    g.lineCap = "round";
    for (const bucket of [0, 1, 2]) {
      g.beginPath();
      let any = false;
      let width = 1;
      for (const p of this.particles) {
        if (p.kind !== "rain" || p.front !== frontLayer) continue;
        if (Math.min(2, (p.z * 3) | 0) !== bucket) continue;
        any = true;
        width = p.size;
        g.moveTo(p.x, p.y);
        g.lineTo(p.x - wind * 0.018, p.y - p.vy * 0.018);
      }
      if (!any) continue;
      g.strokeStyle = `rgba(206, 218, 235, ${0.1 + bucket * 0.1})`;
      g.lineWidth = width;
      g.stroke();
    }
  }

  private drawBirds(g: CanvasRenderingContext2D) {
    if (this.birds.length === 0) return;
    for (const b of this.birds) {
      const dir = Math.sign(b.vx);
      g.setTransform(this.dpr * b.size * dir, 0, 0, this.dpr * b.size, b.x * this.dpr, b.y * this.dpr);
      if (b.kind === "swallow") {
        const cycle = b.t % 1.3;
        const span = cycle < 0.75 ? 0.6 + 0.4 * Math.sin(b.t * b.flapRate) : 1;
        g.fillStyle = "rgba(22, 20, 28, 0.88)";
        g.beginPath();
        g.ellipse(0, 0, 6.5, 1.9, 0, 0, Math.PI * 2);
        g.arc(6, 0, 2, 0, Math.PI * 2);
        g.moveTo(-5, -0.8);
        g.lineTo(-17, -4.2);
        g.lineTo(-9.5, 0);
        g.lineTo(-17, 4.2);
        g.lineTo(-5, 0.8);
        g.moveTo(2, -1);
        g.quadraticCurveTo(0, -9 * span, -10, -16 * span);
        g.quadraticCurveTo(-3, -7 * span, -3.5, -1);
        g.moveTo(2, 1);
        g.quadraticCurveTo(0, 9 * span, -10, 16 * span);
        g.quadraticCurveTo(-3, 7 * span, -3.5, 1);
        g.fill();
      } else {
        const k = 3 + Math.sin(b.t * b.flapRate) * 4;
        g.strokeStyle = "rgba(245, 242, 236, 0.85)";
        g.lineWidth = 1.8;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(-15, -k);
        g.quadraticCurveTo(-7, -k - 6, 0, 0);
        g.quadraticCurveTo(7, -k - 6, 15, -k);
        g.stroke();
      }
    }
  }

  private drawFlash() {
    const s = this.scene!;
    if (!s.storm) return;
    if (this.t > this.flash.next) {
      this.flash.at = this.t;
      this.flash.next = this.t + R(5, 13);
    }
    const k = this.t - this.flash.at;
    if (k > 0.6) return;
    const a = k < 0.08 ? 0.5 : k < 0.16 ? 0.08 : k < 0.26 ? 0.35 : Math.max(0, 0.35 * (1 - (k - 0.26) / 0.34));
    for (const g of [this.back, this.front]) {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = a * (g === this.front ? 0.35 : 0.6);
      g.fillStyle = "#e8eeff";
      g.fillRect(0, 0, g.canvas.width, g.canvas.height);
      g.globalAlpha = 1;
    }
  }

  private trackPerformance(dt: number) {
    this.frameTimes.push(dt);
    if (this.frameTimes.length < 90) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes = [];
    if (avg > 0.024 && this.quality > 0.4) {
      this.quality = Math.max(0.4, this.quality - 0.2);
      this.rebalance();
    }
  }
}

function resetComposite(g: CanvasRenderingContext2D) {
  g.globalAlpha = 1;
  g.globalCompositeOperation = "source-over";
}
