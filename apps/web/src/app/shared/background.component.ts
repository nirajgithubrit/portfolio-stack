import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';

interface Dot { x: number; y: number; vx: number; vy: number; }

/** Fixed, full-page animated particle network that reacts to the pointer. Colours follow the active theme. */
@Component({
  selector: 'app-background',
  standalone: true,
  template: `<canvas #c></canvas>`,
  styles: [`
    :host { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
    canvas { width: 100%; height: 100%; display: block; opacity: 0.7; }
  `],
})
export class BackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('c', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private zone = inject(NgZone);
  private raf = 0;
  private dots: Dot[] = [];
  private mouse = { x: -999, y: -999 };
  private w = 0;
  private h = 0;
  private rgb = '140,120,255';
  private accentRgb = '0,212,255';
  private mo?: MutationObserver;

  private onMove = (e: MouseEvent) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; };
  private onResize = () => this.resize();

  ngOnInit() {
    this.readColors();
    this.resize();
    // Run outside Angular: a 60fps loop must not trigger change detection
    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.onMove);
      window.addEventListener('resize', this.onResize);
      this.mo = new MutationObserver(() => this.readColors());
      this.mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) this.loop();
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    this.mo?.disconnect();
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('resize', this.onResize);
  }

  private readColors() {
    const cs = getComputedStyle(document.documentElement);
    this.rgb = cs.getPropertyValue('--particle-rgb').trim().replace(/\s/g, '') || this.rgb;
    this.accentRgb = cs.getPropertyValue('--accent-rgb').trim().replace(/\s/g, '') || this.accentRgb;
  }

  private resize() {
    const c = this.canvas.nativeElement;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = innerWidth;
    this.h = innerHeight;
    c.width = this.w * dpr;
    c.height = this.h * dpr;
    c.getContext('2d')!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.floor((this.w * this.h) / 18000));
    this.dots = Array.from({ length: count }, () => ({
      x: Math.random() * this.w, y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    }));
  }

  private loop = () => {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    const rgb = this.rgb;
    ctx.clearRect(0, 0, this.w, this.h);
    for (const d of this.dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > this.w) d.vx *= -1;
      if (d.y < 0 || d.y > this.h) d.vy *= -1;
      ctx.fillStyle = `rgba(${rgb},0.8)`;
      ctx.beginPath(); ctx.arc(d.x, d.y, 1.6, 0, 6.283); ctx.fill();
    }
    for (let i = 0; i < this.dots.length; i++) {
      const a = this.dots[i];
      for (let j = i + 1; j < this.dots.length; j++) {
        const b = this.dots[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - dist / 130) * 0.35})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - this.mouse.x, a.y - this.mouse.y);
      if (md < 180) {
        ctx.strokeStyle = `rgba(${this.accentRgb},${(1 - md / 180) * 0.6})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(this.mouse.x, this.mouse.y); ctx.stroke();
      }
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}
